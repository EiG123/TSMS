import { success } from "zod";

export const pmTitleService = {
  async InsertTitle(
    pm_name: string,
    pm_description: string,
    pm_key: string,
    pm_type: string,
    pm_status: string,
    pm_rank: number,
    pool: any,
  ) {
    const client = await pool.connect();
    const sql = `
      INSERT INTO pm_title (
        title,
        description,
        key,
        type,
        status,
        rank
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `;

    const values = [
      pm_name,
      pm_description,
      pm_key,
      pm_type,
      pm_status,
      pm_rank
    ]

    const result = await client.query(sql, values);
    return {
      success: true
    }
  },

  async EditpmTitle(data: any, pool: any) {
    const client = await pool.connect();
    try {
      const sql = `
      UPDATE pm_title
      SET
        title = $1,
        description = $2,
        key = $3,
        type = $4,
        status = $5,
        rank = $6
      WHERE id = $7
      RETURNING id;
    `;

      const values = [
        data.pm_name,
        data.pm_description,
        data.pm_key,
        data.pm_type,   // ใช้ตัวเดียว
        data.pm_status,
        data.pm_rank,
        data.pm_id
      ];

      const result = await client.query(sql, values);

      return {
        success: result.rowCount > 0
      };

    } catch (error) {
      console.error("EditpmTitle error:", error);
      return { success: false };
    } finally {
      client.release();
    }
  },


  async getAllPmTitle(pool: any) {
    const client = await pool.connect();
    try {
      const sql = `SELECT * FROM pm_title`;
      const res = await client.query(sql);
      return {
        result: res.rows,
        success: true
      }
    } catch (error) {
      return {
        success: false
      }
    } finally {
      client.release();
    }
  },

  async getPmTitleById(pool: any, id: number) {
    const client = await pool.connect();
    try {
      // 1. เพิ่มชื่อคอลัมน์ (id = $1)
      const sql = `SELECT * FROM pm_title WHERE id = $1`;
      const values = [id];
      const result = await client.query(sql, values);

      return {
        // 2. ส่งกลับแถวแรกที่เจอ (หรือ null ถ้าไม่เจอ)
        result: result.rows[0] || null,
        success: true
      };
    } catch (error) {
      console.error('Error in getPmTitleById:', error);
      return {
        success: false,
      };
    } finally {
      // 3. สำคัญมาก: ต้องคืน client ให้ pool เสมอ
      client.release();
    }
  },

  async getAllPmTitleChild(pool: any, id: number) {
    const client = await pool.connect();
    try {
      const sql = `
          SELECT
            ptc.id,
            ptc.title_child_name,
            ptc.rank,
            ptc.status,
            COUNT(pd.id) AS pm_detail_count
          FROM pm_title_child ptc
          LEFT JOIN pm_title_child_value pd
            ON pd.title_child_id = ptc.id
          WHERE ptc.title_id = $1
          GROUP BY ptc.id
          ORDER BY ptc.rank ASC;
      `;


      const values = [id];
      const result = await client.query(sql, values);

      console.log(result.rows);
      return {
        result: result.rows || null,
        success: true
      };
    } catch (error) {
      console.error('Error in getAllPmTitleChild:', error);
      return {
        success: false,
      };
    } finally {
      client.release();
    }
  },

  async InsertTitleChild(data: any, pool: any) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      /* ==================== pm_title_child ==================== */
      const sqlTitleChild = `
      INSERT INTO pm_title_child (
        title_id,
        title_child_name,
        description,
        rank,
        status
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;

      const { rows } = await client.query(sqlTitleChild, [
        data.title_id,
        data.title_child_name,
        data.description,
        data.rank,
        data.status
      ]);

      const titleChildId = rows[0].id;

      /* ==================== pm_value (BULK) ==================== */
      if (Array.isArray(data.values) && data.values.length > 0) {
        const valuePlaceholders: string[] = [];
        const valueParams: any[] = [];

        data.values.forEach((item: any, index: number) => {
          const baseIndex = index * 4;

          valuePlaceholders.push(
            `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4})`
          );
          valueParams.push(
            data.title_id,
            titleChildId,
            item.name,
            item.input_type,
          );
        });

        const sqlPmValue = `
        INSERT INTO pm_title_child_value (
          title_id,
          title_child_id,
          name,
          input_type
        )
        VALUES ${valuePlaceholders.join(", ")}
      `;

        const responseValue = await client.query(sqlPmValue, valueParams);
      }
      console.log("pass");

      /* ==================== pm_image (BULK) ==================== */
      if (
        Array.isArray(data.image_descriptions) &&
        data.image_descriptions.length > 0
      ) {
        const imagePlaceholders: string[] = [];
        const imageParams: any[] = [];

        data.image_descriptions.forEach((desc: string, index: number) => {
          const baseIndex = index * 2;

          imagePlaceholders.push(
            `($${baseIndex + 1}, $${baseIndex + 2})`
          );

          imageParams.push(titleChildId, desc);
        });

        const sqlPmImage = `
        INSERT INTO pm_images (
          title_child_id,
          description
        )
        VALUES ${imagePlaceholders.join(", ")}
      `;

        await client.query(sqlPmImage, imageParams);
      }

      await client.query("COMMIT");

      return { success: true };

    } catch (error: any) {
      await client.query("ROLLBACK");
      console.error("InsertTitleChild error:", error);

      return {
        success: false,
        error: error.message,
      };

    } finally {
      client.release();
    }
  },

  async deleteTitleChildById(
    data: any,
    pool: any
  ) {
    const client = await pool.connect();
    const sql = `
      DELETE FROM pm_title_child WHERE id = $1;
    `;

    const values = [
      data.id
    ]

    const result = await client.query(sql, values);
    return {
      success: true
    }
  },

  async deleteTitleById(
    data: any,
    pool: any
  ) {
    const client = await pool.connect();
    const sql = `
      DELETE FROM pm_title WHERE id = $1;
    `;

    const values = [
      data.id
    ]

    const result = await client.query(sql, values);
    return {
      success: true
    }
  },

  async getTitleByType(data: any, pool: any) {
    const client = await pool.connect();

    if (data.type == 'ac_power') {
      data.type = 'kwh_meter';
    }
    try {
      const sql = `
        SELECT * FROM pm_title WHERE key = $1;
      `;

      const result = await client.query(sql, [data.type]);

      return {
        result: result.rows,
        success: true
      };

    } catch (error) {
      console.error("getTitleByType error:", error);
      return { success: false };
    } finally {
      client.release();
    }
  },

  async getTitleChildByTitle(data: any, pool: any) {
    const client = await pool.connect();
    try {
      const sql = `
        SELECT * FROM pm_title_child WHERE title_id = $1 
        LEFT JOIN ON pm_title_child_value;
      `;
      const result = await client.query(sql, [data.title_id]);

      return {
        result: result.rows,
        success: true
      };

    } catch (error) {
      console.error("getTitleByType error:", error);
      return { success: false };
    } finally {
      client.release();
    }
  }


};
