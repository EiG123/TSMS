import { date, success } from "zod";
import { fi } from "zod/locales";

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


  async getAllPmTitle(data: any, pool: any) {
    const client = await pool.connect();
    try {
      const sql = `SELECT * FROM pm_title WHERE type = $1`;
      const res = await client.query(sql, [data.type]);
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

  async getAllPmTitleChild(pool: any, data: number) {
    const client = await pool.connect();
    try {
      const sql = `
          SELECT * FROM pm_title_child WHERE title_id = $1
      `;
      const values = [data];
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
        status,

        value_status_1,
        value_name_1,
        value_input_type_1,

        value_status_2,
        value_name_2,
        value_input_type_2,

        value_status_3,
        value_name_3,
        value_input_type_3,

        img_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id
    `;

      const { rows } = await client.query(sqlTitleChild, [
        data.title_id,
        data.title_child_name,
        data.description,
        data.rank,
        data.status,

        data.value_status_1,
        data.value_name_1,
        data.value_input_type_1,

        data.value_status_2,
        data.value_name_2,
        data.value_input_type_2,

        data.value_status_3,
        data.value_name_3,
        data.value_input_type_3,

        data.image_status,
      ]);

      const titleChildId = rows[0].id;

      /* ==================== pm_image (BULK) ==================== */
      if (
        Array.isArray(data.image_descriptions) &&
        data.image_descriptions.length > 0
      ) {
        const imagePlaceholders: string[] = [];
        const imageParams: any[] = [];

        data.image_descriptions.forEach((desc: string, index: number) => {
          const baseIndex = index * 4;

          imagePlaceholders.push(
            `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4})`
          );

          imageParams.push(data.title_id, titleChildId, desc, index + 1);
        });

        const sqlPmImage = `
        INSERT INTO pm_title_images (
          title_id,
          title_child_id,
          description,
          img_number
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
        SELECT
            ptc.*,
            COALESCE(pimg.images, '[]'::json) AS pm_images
        FROM pm_title_child ptc

        LEFT JOIN LATERAL (
            SELECT json_agg(
                json_build_object(
                    'title_image_id', pti.id,
                    'img_number', pti.img_number,
                    'description', pti.description,
                    'file_path', pmi.file_path,
                    'pm_image_id', pmi.id
                )
                ORDER BY pti.img_number
            ) AS images
            FROM pm_title_images pti
            LEFT JOIN pm_images pmi
                ON pmi.title_image_id = pti.id
                AND pmi.pm_id = $2
                AND pmi.order_number = $3
            WHERE pti.title_id = ptc.title_id
              AND pti.title_child_id = ptc.id
        ) pimg ON true

        WHERE ptc.title_id = $1;
      `;
      const result = await client.query(sql, [data.title_id, data.pm_id, data.order_number]);
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

  async getTitleChildDataByTitle(data: any, pool: any) {
    const client = await pool.connect();
    try {
      const sql = `
        SELECT
            ptc.*,
            COALESCE(pimg.images, '[]'::json) AS pm_images,
            pd.value_1,
            pd.value_2,
            pd.value_3
        FROM pm_title_child ptc

        LEFT JOIN LATERAL (
            SELECT json_agg(
                json_build_object(
                    'title_image_id', pti.id,
                    'description', pti.description,
                    'img_number', pti.img_number,
                    'file_path', pmi.file_path,
                    'pm_image_id', pmi.id
                )
                ORDER BY pti.img_number
            ) AS images
            FROM pm_title_images pti
            LEFT JOIN pm_images pmi
                ON pmi.title_image_id = pti.id
                AND pmi.pm_id = $2
                AND pmi.order_number = $4
            WHERE pti.title_id = ptc.title_id
              AND pti.title_child_id = ptc.id
        ) pimg ON true

        LEFT JOIN pm_details pd
            ON ptc.id = pd.title_child_id
            AND pd.pm_id = $2
            AND pd.order_number = $4

        WHERE ptc.title_id = $1
          AND ptc.id = $3;
      `;
      const result = await client.query(sql, [data.title_id, data.pm_id, data.title_child_id, data.order_number]);
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

  async getTitleChildData(data: any, pool: any) {
    const client = await pool.connect();
    try {
      const sql = `
        SELECT * FROM pm_title_child WHERE id = $1 AND title_id = $2
      `;
      const result = await client.query(sql, [data.title_child_id, data.title_id]);
      const sql_img = `SELECT * FROM pm_title_images WHERE title_id = $1 AND title_child_id = $2`;
      const img_result = await client.query(sql_img, [data.title_id, data.title_child_id]);

      return {
        result: result.rows,
        img_result: img_result.rows,
        success: true
      };

    } catch (error) {
      console.error("getTitleByType error:", error);
      return { success: false };
    } finally {
      client.release();
    }
  },

  async EditpmTitleChild(data: any, pool: any) {
    const client = await pool.connect();
    try {
      // ✅ แก้เป็น UPDATE และนับ $placeholder ให้ถูก
      const sql = `
      UPDATE pm_title_child SET
        title_child_name  = $3,
        description       = $4,
        rank              = $5,
        status            = $6,

        value_status_1    = $7,
        value_name_1      = $8,
        value_input_type_1 = $9,

        value_status_2    = $10,
        value_name_2      = $11,
        value_input_type_2 = $12,

        value_status_3    = $13,
        value_name_3      = $14,
        value_input_type_3 = $15,

        img_status        = $16
      WHERE title_id = $1 AND id = $2
      RETURNING id
    `;

      const { rows } = await client.query(sql, [
        data.title_id,         // $1
        data.title_child_id,   // $2

        data.title_child_name, // $3
        data.description,      // $4
        data.rank,             // $5
        data.status,           // $6

        data.value_status_1,   // $7
        data.value_name_1,     // $8
        data.value_input_type_1, // $9

        data.value_status_2,   // $10
        data.value_name_2,     // $11
        data.value_input_type_2, // $12

        data.value_status_3,   // $13
        data.value_name_3,     // $14
        data.value_input_type_3, // $15

        data.image_status,     // $16
      ]);

      console.log(data.title_id);
      console.log(data.title_child_id);

      /* ==================== pm_images ==================== */
      if (Array.isArray(data.image_descriptions)) {
        // 1. ดึงจำนวน images ที่มีอยู่ใน DB
        const { rows: existingImages } = await client.query(
          `SELECT img_number FROM pm_title_images 
          WHERE title_id = $1 AND title_child_id = $2 
          ORDER BY img_number`,
          [data.title_id, data.title_child_id]
        );

        const existingCount = existingImages.length;
        const newCount = data.image_descriptions.length;

        for (let i = 0; i < newCount; i++) {
          if (i < existingCount) {
            // ✅ UPDATE row ที่มีอยู่แล้ว
            await client.query(
              `UPDATE pm_title_images 
         SET description = $3
            WHERE title_id = $1 AND title_child_id = $2 AND img_number = $4`,
              [data.title_id, data.title_child_id, data.image_descriptions[i], i + 1]
            );
          } else {
            // ✅ INSERT row ที่เพิ่มมาใหม่
            await client.query(
              `INSERT INTO pm_title_images (title_id, title_child_id, description, img_number)
              VALUES ($1, $2, $3, $4)`,
              [data.title_id, data.title_child_id, data.image_descriptions[i], i + 1]
            );
          }
        }

        // ✅ DELETE row ที่เกิน (กรณีใหม่น้อยกว่าเดิม)
        if (newCount < existingCount) {
          await client.query(
            `DELETE FROM pm_title_images
            WHERE title_id = $1 AND title_child_id = $2 AND img_number > $3`,
            [data.title_id, data.title_child_id, newCount]
          );
        }
      }

      return { success: true };

    } catch (error) {
      console.error("EditpmTitleChild error:", error);
      return { success: false };
    } finally {
      client.release();
    }
  },

};
