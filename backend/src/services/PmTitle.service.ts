import { Pool } from "pg";
export const pmTitleService = {
  async InsertTitle(
    pm_name: string,
    pm_description: string,
    pm_title_type: string,
    pm_mode: string,
    pm_type: string,
    pm_status: string,
    pm_reportable: string,
    pm_fso: string,
    pm_rank: number,
    pool: Pool,
  ) {
    const client = await pool.connect();
    const sql = `
      INSERT INTO pm_title (
        title,
        description,
        title_type,
        pm_mode,
        pm_type,
        status,
        reportable,
        fso,
        rank
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    const values = [
      pm_name,
      pm_description,
      pm_title_type,
      pm_mode,
      pm_type,
      pm_status,
      pm_reportable,
      pm_fso,
      pm_rank
    ]

    const result = await client.query(sql, values);
    return {
      success: true
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
            ptc.id               AS title_child_id,
            ptc.title_child_name,
            ptc.description,
            ptc.rank,
            ptc.status,
            ptc.reportable,
            ptc.fso,

            pr.result_status,
            pv.value_status,

            COUNT(*) OVER () AS title_child_count

          FROM pm_title_child ptc

          LEFT JOIN pm_result pr
            ON pr.title_child_id = ptc.id

          LEFT JOIN pm_value pv
            ON pv.title_child_id = ptc.id

          WHERE ptc.title_id = $1

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
    console.log(data);
    try {
      await client.query("BEGIN");

      /* ==================== pm_title_child ==================== */
      const sqlTitleChild = `
      INSERT INTO pm_title_child (
        title_id,
        title_child_name,
        description,
        rank,
        status,
        reportable,
        fso
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

      const { rows } = await client.query(sqlTitleChild, [
        data.pm_id,
        data.title_child_name,
        data.description,
        data.rank,
        data.status,
        data.reportable,
        data.fso,
      ]);

      const titleChildId = rows[0].id;

      /* ==================== pm_result ==================== */
      const sqlPmResult = `
      INSERT INTO pm_result (
        title_child_id,
        result_status,
        result_name,
        result_type,
        dropdown_checkbox_name,
        dropdown_checkbox_value
      )
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

      await client.query(sqlPmResult, [
        titleChildId,
        data.result_status,
        data.result_name,
        data.result_type,
        data.dropdown_checkbox_name,
        data.dropdown_checkbox_value,
      ]);

      /* ==================== pm_value (BULK) ==================== */
      if (Array.isArray(data.values) && data.values.length > 0) {
        const valuePlaceholders: string[] = [];
        const valueParams: any[] = [];

        data.values.forEach((item: any, index: number) => {
          const baseIndex = index * 5;

          valuePlaceholders.push(
            `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5})`
          );

          valueParams.push(
            titleChildId,
            index + 1,              // value_number
            data.value_status,
            item.name,
            item.input_type
          );
        });

        const sqlPmValue = `
        INSERT INTO pm_value (
          title_child_id,
          value_number,
          value_status,
          value_name,
          value_type
        )
        VALUES ${valuePlaceholders.join(", ")}
      `;

        const responseValue = await client.query(sqlPmValue, valueParams);
      }

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
  }


};
