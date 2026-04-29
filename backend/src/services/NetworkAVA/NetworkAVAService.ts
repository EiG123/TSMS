// NetworkAVAService.ts
import * as XLSX from "xlsx";

export const NetworkAVAService = {
  async UploadSitesAVA(file: File, pool: any) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1) parse excel
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const rawData: any[] = XLSX.utils.sheet_to_json(sheet, {
        defval: null,
      });

      // 2) normalize data
      const data = rawData.map((row) => ({
        site_code: String(row.site_code || "").trim(),
        system: String(row.system || "").trim().toUpperCase(),
        operator: String(row.operator || "").trim().toUpperCase(),
        date: row.date,
        avg_availability: Number(row.avg_availability),
      }));

      console.log(data);

      // 3) validate (basic)
      const validRows = data.filter(
        (r) =>
          r.site_code &&
          r.system &&
          r.operator &&
          r.date &&
          !isNaN(r.avg_availability)
      );

      if (validRows.length === 0) {
        throw new Error("No valid data");
      }

      // 4) insert systems
      await client.query(`
        INSERT INTO systems (system_name)
        SELECT DISTINCT system FROM (
          SELECT UNNEST($1::text[]) AS system
        ) t
        ON CONFLICT DO NOTHING
      `, [validRows.map(r => r.system)]);

      // 5) insert operators
      await client.query(`
        INSERT INTO operators (operator_name)
        SELECT DISTINCT operator FROM (
          SELECT UNNEST($1::text[]) AS operator
        ) t
        ON CONFLICT DO NOTHING
      `, [validRows.map(r => r.operator)]);

      // 6) insert sites
      await client.query(`
        INSERT INTO sites (site_code)
        SELECT DISTINCT site_code FROM (
          SELECT UNNEST($1::text[]) AS site_code
        ) t
        ON CONFLICT DO NOTHING
      `, [validRows.map(r => r.site_code)]);

      // 7) create site_config
      await client.query(`
        INSERT INTO site_config (site_id, system_id, operator_id)
        SELECT DISTINCT
          s.id,
          sys.system_id,
          op.operator_id
        FROM (
          SELECT 
            UNNEST($1::text[]) AS site_code,
            UNNEST($2::text[]) AS system,
            UNNEST($3::text[]) AS operator
        ) t
        JOIN sites s ON s.site_code = t.site_code
        JOIN systems sys ON sys.system_name = t.system
        JOIN operators op ON op.operator_name = t.operator
        ON CONFLICT DO NOTHING
      `, [
        validRows.map(r => r.site_code),
        validRows.map(r => r.system),
        validRows.map(r => r.operator),
      ]);

      // 8) insert availability (loop แบบปลอดภัยก่อน)
      for (const row of validRows) {
        await client.query(
          `
          INSERT INTO site_availability_daily (
            site_config_id,
            snapshot_date,
            avg_availability
          )
          SELECT
            sc.id,
            $4::date,
            $5
          FROM sites s
          JOIN systems sys ON sys.system_name = $2
          JOIN operators op ON op.operator_name = $3
          JOIN site_config sc
            ON sc.site_id = s.id
            AND sc.system_id = sys.system_id
            AND sc.operator_id = op.operator_id
          WHERE s.site_code = $1
          ON CONFLICT DO NOTHING
          `,
          [
            row.site_code,
            row.system,
            row.operator,
            row.date,
            row.avg_availability,
          ]
        );
      }

      await client.query("COMMIT");

      return {
        total: rawData.length,
        inserted: validRows.length,
        success: true
      };

    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },
};