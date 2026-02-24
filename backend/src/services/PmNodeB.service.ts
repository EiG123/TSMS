import { Pool } from "pg";
import { success } from "zod";
import fs from "fs";
import path from "path";
export const PmService = {
  async getData(
    db: any
  ) {
    const client = await db.connect();

    try {
      const sql = `SELECT * FROM pm`

      const res = await client.query(sql);
      return {
        data: res.rows,
        success: true
      }
    } catch (err) {
      return {
        success: false
      }
    } finally {
      client.release();
    }
  },



  async InsertPM(data: any, db: Pool) {
    const bulkInsertNumbered = async (
      client: any,
      table: string,
      pmId: number,
      count: number
    ) => {
      if (!count || count <= 0) return;

      const values: any[] = [];
      const placeholders: string[] = [];

      for (let i = 0; i < count; i++) {
        const idx = values.length;
        values.push(pmId, i + 1);
        placeholders.push(`($${idx + 1}, $${idx + 2})`);
      }

      await client.query(
        `INSERT INTO ${table} (pm_id, number)
        VALUES ${placeholders.join(",")}`,
        values
      );
    };

    const client = await db.connect();

    try {
      await client.query("BEGIN"); // ⭐ เริ่ม transaction

      const query = `
      INSERT INTO pm (
        site_name,
        date,
        planwork,
        service_status,
        created_at
      ) VALUES ($1, $2, $3, $4, NOW())
      RETURNING id
    `;

      const values = [
        data.site_id,
        data.datetime,
        data.planwork,
        data.status
      ];

      const result = await client.query(query, values);
      const pmId = result.rows[0].id;

      // ===========================
      // pm_generator
      // ===========================
      await bulkInsertNumbered(client, "pm_generator", pmId, data.generator);

      // ===========================
      // pm_transformer
      // ===========================
      await bulkInsertNumbered(client, "pm_transformer", pmId, data.transformer);

      // ===========================
      // pm_kwh_meter
      // ===========================
      if (data.kwh_meter?.length) {
        const sql = `
        INSERT INTO pm_kwh_meter (pm_id, number, phase)
        VALUES ($1, $2, $3)
      `;
        for (let i = 0; i < data.kwh_meter.length; i++) {
          await client.query(sql, [
            pmId,
            i + 1,
            data.kwh_meter[i].phase
          ]);
        }
      }

      // ===========================
      // pm_solar_cell
      // ===========================
      await bulkInsertNumbered(client, "pm_solar_cell", pmId, data.solar_cell);

      // ===========================
      // pm_mowing
      // ===========================
      await bulkInsertNumbered(client, "pm_mowing", pmId, data.mowing);

      // ⭐ ถ้าทุกอย่างผ่าน
      await client.query("COMMIT");

      return {
        success: true,
        pm_id: pmId,
        message: "บันทึกข้อมูล PM สำเร็จ"
      };

    } catch (error) {
      await client.query("ROLLBACK"); // ⭐ rollback ทั้งหมด
      console.error("Transaction error:", error);

      return {
        success: false,
        message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล (rollback แล้ว)"
      };

    } finally {
      client.release();
    }
  },

  async PmsubmitData(data: any, images: any, pool: any) {
    const client = await pool.connect();
    console.log(data);
    try {
      await client.query("BEGIN");

      /* ==================== pm_details ==================== */
      const sql = `
      INSERT INTO pm_details (
        pm_id,
        title_id,
        title_child_id,
        value_1,
        value_2,
        value_3
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (pm_id, title_id, title_child_id)
      DO UPDATE SET
        value_1 = EXCLUDED.value_1,
        value_2 = EXCLUDED.value_2,
        value_3 = EXCLUDED.value_3
    `;

      await client.query(sql, [
        data.pm_id,
        data.title_id,
        data.title_child_id,
        data.value_1 || null,
        data.value_2 || null,
        data.value_3 || null,
      ]);

      /* ==================== pm_image ==================== */
      for (const img of images) {
        const { title_image_id, img_number, file } = img;

        const uploadDir = "uploads/pm/";
        fs.mkdirSync(uploadDir, { recursive: true });

        const ext = path.extname(file.name);
        const fileName = `${Date.now()}_${img_number}${ext}`;
        const filePath = `${uploadDir}/${fileName}`;

        const buffer = await file.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));

        await client.query(
          `
          INSERT INTO pm_images (
            pm_id,
            title_id,
            title_child_id,
            title_image_id,
            img_number,
            file_path,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,NOW())
          ON CONFLICT (pm_id, title_id, title_child_id, img_number)
          DO UPDATE SET
            file_path = EXCLUDED.file_path,
            title_image_id = EXCLUDED.title_image_id
          `,
          [
            data.pm_id,
            data.title_id,
            data.title_child_id,
            title_image_id,
            img_number,
            filePath
          ]
        );
      }


      await client.query("COMMIT");
      return { success: true };

    } catch (error: any) {
      await client.query("ROLLBACK");
      console.error("PmsubmitData error:", error);
      return { success: false, error: error.message };

    } finally {
      client.release();
    }
  }
};
