import { Pool } from "pg";
export const PmService = {
  async InsertPM(
    site_id: string,
    region: string,
    datetime: string,
    status: string,
    generator: string,
    transformer: string,
    kwh_meter: any,
    solar_cell: string,
    mowing: string,
    created_by: string,
    remark: string,
    db: Pool
  ) {
    const client = await db.connect();
    try {
      const query = `
                INSERT INTO pm_nodeb (
                    site_id,
                    region,
                    datetime,
                    status,
                    generator,
                    transformer,
                    kwh_meter,
                    solar_cell,
                    mowing,
                    created_by,
                    remark,
                    created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
                RETURNING id
            `;
      console.log("ALL KWH_DATA");
      console.log(kwh_meter);
      let kwh_meter_data = [];
      if (kwh_meter !== "") {
        kwh_meter_data = JSON.parse(kwh_meter);
      }
      console.log("KWH PARSE DATA");
      console.log(kwh_meter_data);
      const kwh_meter_total = kwh_meter_data.length;

      const values = [
        site_id,
        region,
        datetime,
        status,
        generator,
        transformer,
        kwh_meter_total,
        solar_cell,
        mowing,
        created_by,
        remark
      ];

      const result = await client.query(query, values);

      const pmId = result.rows[0].id;

      if (kwh_meter_data.length != 0) {
        for (let i = 0; i < kwh_meter_data.length; i++) {
          const meter = kwh_meter_data[i];
          const phaseType = meter.phase;


          // 1. insert pm_kwh_meter
          const meterResult = await client.query(
            `
              INSERT INTO pm_kwh_meter (
                pm_id,
                cab_number,
                kwh_meter_number,
                phase_type
              )
              VALUES ($1, $2, $3, $4)
              RETURNING id
              `,
            [
              pmId,
              i + 1,              // cab_number
              i + 1,              // หรือเลขจริงจาก FE
              phaseType
            ]
          );

          const kwhMeterId = meterResult.rows[0].id;

          // 2. insert ตาม phase
          if (phaseType === "P1") {
            await client.query(
              `
              INSERT INTO pm_kwh_meter_p1 (kwh_meter_id)
              VALUES ($1)
              `,
              [kwhMeterId]
            );
          }

          if (phaseType === "P3") {
            await client.query(
              `
              INSERT INTO pm_kwh_meter_p3 (kwh_meter_id)
              VALUES ($1)
              `,
              [kwhMeterId]
            );
          }
        }
      }


      // ⭐ ส่ง pm_id กลับไป
      return {
        success: true,
        pm_id: result.rows[0].id,  // ⭐ สำคัญ!
        message: "บันทึกข้อมูล PM สำเร็จ"
      };

    } catch (error) {
      console.error('Database error:', error);
      return {
        success: false,
        message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
      };
    } finally {
      client.release();
    }
  },

  // ⭐ Insert Site Information
  // async InsertSiteInformation(pm_id: number, data: any, db: Pool) {
  //   const client = await db.connect();
  //   try {
  //     // สร้าง dynamic query จาก data object
  //     const fields = Object.keys(data);
  //     const values = Object.values(data);

  //     const placeholders = fields.map((_, i) => `$${i + 2}`).join(', ');
  //     const fieldNames = fields.join(', ');

  //     const query = `
  //               INSERT INTO pm_site_information (
  //                   pm_id, ${fieldNames}
  //               ) VALUES ($1, ${placeholders})
  //           `;

  //     await client.query(query, [pm_id, ...values]);

  //     return {
  //       success: true,
  //       message: "บันทึก Site Information สำเร็จ"
  //     };

  //   } catch (error) {
  //     console.error('Database error:', error);
  //     return {
  //       success: false,
  //       message: "เกิดข้อผิดพลาดในการบันทึก Site Information"
  //     };
  //   } finally {
  //     client.release();
  //   }
  // },


};
