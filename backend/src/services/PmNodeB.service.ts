import { Pool } from "pg";
import { success } from "zod";
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

  async PmsubmitData(data: any, pool: any) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const rows = Object.values(data);

      if (rows.length === 0) {
        throw new Error("No data provided");
      }

      const placeholders: string[] = [];
      const params: any[] = [];

      rows.forEach((item: any, index: number) => {
        const baseIndex = index * 3;

        placeholders.push(
          `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`
        );

        params.push(
          item.pmId,
          item.title_child_value_id,
          item.value
        );
      });

      const sql = `
        INSERT INTO pm_details
        (
          pm_id,
          title_child_value_id,
          value
        )
        VALUES ${placeholders.join(", ")}
        ON CONFLICT (pm_id, title_child_value_id)
        DO UPDATE
        SET value = EXCLUDED.value
      `;

      const res = await client.query(sql, params);

      await client.query("COMMIT");

      return { success: true };

    } catch (error: any) {
      await client.query("ROLLBACK");
      console.error("PmsubmitData error:", error);

      return {
        success: false,
        error: error.message
      };

    } finally {
      client.release();
    }
  }




};
