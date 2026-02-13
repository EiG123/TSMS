import { Pool } from "pg";
export const PmService = {
  async getData(
    db: any
  ) {
    const client = await db.connect();

    try{
      const sql = `SELECT * FROM pm`

      const res = await client.query(sql);
      return {
        data: res.rows,
        success: true
      }
    }catch(err){
      return{
        success: false
      }
    }finally{
      client.release();
    }
  },


  async InsertPM(
    data: any,
    db: Pool
  ) {
    const client = await db.connect();
    console.log(data);
    try {
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

      //pm_generator
      if(data.generator?.length){
        const sql_pm_generator = `
          INSERT INTO pm_generator (
            pm_id,
            number,
          ) VALUES ($1, $2);
        `;

        for(let i=0;i<data.pm_generator.length;i++){
          const values_pm_generator = [
            pmId,
            i+1,
          ];

          await client.query(sql_pm_generator, values_pm_generator)
        }
      }

      //pm_transformer
      if(data.transformer?.length){
        const sql_pm_transformer = `
          INSERT INTO pm_transformer (
            pm_id,
            number,
          ) VALUES ($1, $2);
        `;

        for(let i=0;i<data.pm_transformer.length;i++){
          const values_pm_transformer = [
            pmId,
            i+1,
          ];

          await client.query(sql_pm_transformer, values_pm_transformer)
        }
      }

      // pm_kwh_meter
      if(data.kwh_meter?.length){
        const sql_pm_kwh_meter = `
          INSERT INTO pm_kwh_meter (
            pm_id,
            number,
            phase
          ) VALUES ($1, $2, $3);
        `;
        for(let i=0;i<data.pm_kwh_meter.length;i++){
          const values_pm_kwh_meter = [
            pmId,
            i+1,
            data.pm_kwh_meter[i]
          ];

          await client.query(sql_pm_kwh_meter, values_pm_kwh_meter)
        }
      }

      //pm_solar_cell
      if(data.solar_cell?.length){
        const sql_pm_solar_cell = `
          INSERT INTO pm_solar_cell (
            pm_id,
            number,
          ) VALUES ($1, $2);
        `;

        for(let i=0;i<data.pm_solar_cell.length;i++){
          const values_pm_solar_cell = [
            pmId,
            i+1,
          ];

          await client.query(sql_pm_solar_cell, values_pm_solar_cell)
        }
      }

      //pm_mowing
      if(data.mowing?.length){
        const sql_pm_mowing = `
          INSERT INTO pm_mowing (
            pm_id,
            number,
          ) VALUES ($1, $2);
        `;

        for(let i=0;i<data.pm_mowing.length;i++){
          const values_pm_mowing = [
            pmId,
            i+1,
          ];

          await client.query(sql_pm_mowing, values_pm_mowing)
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
};
