import { Pool } from "pg";
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
      if (data.generator > 0) {
        const sql = `
        INSERT INTO pm_generator (pm_id, number)
        VALUES ($1, $2)
      `;

        for (let i = 0; i < data.generator; i++) {
          await client.query(sql, [pmId, i + 1]);
        }
      }

      // ===========================
      // pm_transformer
      // ===========================
      if (data.transformer > 0) {
        const sql = `
        INSERT INTO pm_transformer (pm_id, number)
        VALUES ($1, $2)
      `;

        for (let i = 0; i < data.transformer; i++) {
          await client.query(sql, [pmId, i + 1]);
        }
      }

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
            data.kwh_meter[i]
          ]);
        }
      }

      // ===========================
      // pm_solar_cell
      // ===========================
      if (data.solar_cell > 0) {
        const sql = `
        INSERT INTO pm_solar_cell (pm_id, number)
        VALUES ($1, $2)
      `;

        for (let i = 0; i < data.solar_cell; i++) {
          await client.query(sql, [pmId, i + 1]);
        }
      }

      // ===========================
      // pm_mowing
      // ===========================
      if (data.mowing > 0) {
        const sql = `
        INSERT INTO pm_mowing (pm_id, number)
        VALUES ($1, $2)
      `;

        for (let i = 0; i < data.mowing; i++) {
          await client.query(sql, [pmId, i + 1]);
        }
      }

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
  }

};
