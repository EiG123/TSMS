// NetworkAVAService.ts
import * as XLSX from "xlsx";
import { logService } from "../LOG/log.service.js";

export const NetworkAVAService = {
  async UploadSitesAVA(file: File, pool: any) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1) parse excel
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, {
        type: "array",
        cellDates: true, // 👈 สำคัญมาก
      }); const sheet = workbook.Sheets[workbook.SheetNames[0]];

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


  async UploadIncidentTT(file: File, pool: any) {
    const client = await pool.connect();

    const extractSiteCodes = (subject: string): string[] => {
      if (!subject) return [];

      const regex = /[A-Z]{2,}\d{3,}/gi;

      const matches = [...subject.matchAll(regex)];

      return [...new Set(matches.map((m) => m[0].toUpperCase()))];
    };

    try {
      await client.query("BEGIN");

      // 1) parse excel
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, {
        type: "array",
        cellDates: true, // 🔥 สำคัญ
      }); const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const rawData: any[] = XLSX.utils.sheet_to_json(sheet, {
        defval: null,
      });

      // 2) helper parse date
      const parseDate = (val: any) => {
        console.log(val);
        if (!val) return null;

        if (val instanceof Date) return val;

        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
      };

      const normalizeKey = (key: string) => {
        return key
          .toLowerCase()
          .replace(/\s+/g, "_")   // space → _
          .replace(/[^a-z0-9_]/g, ""); // remove แปลก ๆ
      };

      const normalizeRowKeys = (row: any) => {
        const newRow: any = {};

        for (const key in row) {
          const normalizedKey = normalizeKey(key);
          newRow[normalizedKey] = row[key];
        }

        return newRow;
      };

      const pick = (row: any, keys: string[]) => {
        for (const k of keys) {
          if (row[k] !== undefined && row[k] !== null) {
            return row[k];
          }
        }
        return null;
      };

      const cleanedRaw = rawData.map(normalizeRowKeys);
      // 3) normalize
      const data = cleanedRaw.map((row) => ({
        incident_number: String(row.incident || "").trim(),
        global_id: row.global_id ? String(row.global_id).trim() : null,
        ticket_type: pick(row, ["tickettype", "ticket_type"]),
        urgency: pick(row, ["urgency"]),
        severity: row.severity,
        subject: row.subject,
        classification: row.classification,
        status: row.status,

        creator_id: row.creator_id,
        creator_name: row.creator_name,
        department: row.department,
        activity_owner: row.activity_owner,
        activity_status: row.activity_status,
        external_ticket: row.external_ticket,

        owner: row.owner,
        owner_group: row.owner_group,

        failure_class: row.failure_class,
        problem: row.problem,
        cause: row.cause,
        remedy: row.remedy,
        external_system: row.external_system,


        fault_datetime: parseDate(pick(row, ["Fault Date", "Fault_Date", "fault date", "fault_date"])),
        create_datetime: parseDate(pick(row, ["Create Date", "Create_Date", "create date", "create_date"])),
        expected_finish_datetime: parseDate(pick(row, ["Expected Finish", "Expected_Finish", "expected finish", "expected_finish"])),
        actual_start_datetime: parseDate(pick(row, ["Actual Start Date", "Actual_Start_Date", "actual start date", "actual_start_date"])),
        actual_finish_datetime: parseDate(pick(row, ["Actual Finish Date", "Actual_Finish_Date", "actual finish date", "actual_finish_date"])),
        restoration_datetime: parseDate(pick(row, ["Restoration Date", "Restoration_Date", "Restoration_Date", "restoration_date"])),

        raw_payload: row,
      }));


      // 4) validate
      const validRows = data.filter((r) => r.incident_number);

      if (validRows.length === 0) {
        throw new Error("No valid incident data");
      }

      // 5) insert incidents
      for (const row of validRows) {
        await client.query(
          `
          INSERT INTO incidents (
            global_id,
            incident_number,
            ticket_type,
            urgency,
            severity,
            subject,
            classification,
            status,
            creator_id,
            creator_name,
            department,
            activity_owner,
            activity_status,
            external_ticket,
            owner,
            owner_group,
            failure_class,
            problem,
            cause,
            remedy,
            external_system,
            fault_datetime,
            create_datetime,
            expected_finish_datetime,
            actual_start_datetime,
            actual_finish_datetime,
            restoration_datetime,
            raw_payload
          )
          VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,
            $9,$10,$11,$12,$13,$14,
            $15,$16,$17,$18,$19,$20,$21,
            $22,$23,$24,$25,$26,$27,$28
          )
          ON CONFLICT ON CONSTRAINT uq_incident_dedup DO NOTHING
          `,
          [
            row.global_id,
            row.incident_number,
            row.ticket_type,
            row.urgency,
            row.severity,
            row.subject,
            row.classification,
            row.status,
            row.creator_id,
            row.creator_name,
            row.department,
            row.activity_owner,
            row.activity_status,
            row.external_ticket,
            row.owner,
            row.owner_group,
            row.failure_class,
            row.problem,
            row.cause,
            row.remedy,
            row.external_system,
            row.fault_datetime,
            row.create_datetime,
            row.expected_finish_datetime,
            row.actual_start_datetime,
            row.actual_finish_datetime,
            row.restoration_datetime,
            row.raw_payload,
          ]
        );
      }

      for (const row of validRows) {
        const siteCodes = extractSiteCodes(row.subject);

        console.log(siteCodes);

        if (!siteCodes.length) continue;

        for (const code of siteCodes) {
          const siteRes = await client.query(
            `SELECT id FROM sites WHERE site_code = $1`,
            [code]
          );

          if (siteRes.rows.length === 0) continue;

          const siteId = siteRes.rows[0].id;

          await client.query(
            `
            INSERT INTO incident_site_impact (
              incident_id,
              site_id,
              impact_start,
              impact_end
            )
            SELECT
              i.incident_id,
              $2,
              $3,
              $4
            FROM incidents i
            WHERE i.incident_number = $1
            LIMIT 1
            `,
            [
              row.incident_number,
              siteId,
              row.fault_datetime,
              row.restoration_datetime,
            ]
          );
        }
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

  async AVAChart(data: any, pool: any) {
    const { site_code, start_date, end_date } = data;

    if (!site_code) {
      throw new Error("site_code is required");
    }

    const client = await pool.connect();

    console.log(data);
    try {
      // const res = await client.query(
      //   `
      //   WITH date_series AS (
      //     SELECT generate_series(
      //       $2::date,
      //       $3::date,
      //       interval '1 day'
      //     )::date AS d
      //   ),

      //   site_configs AS (
      //     SELECT sc.id
      //     FROM sites s
      //     JOIN site_config sc ON sc.site_id = s.id
      //     WHERE s.site_code = $1
      //   ),

      //   ava AS (
      //     SELECT
      //       sad.snapshot_date,
      //       AVG(sad.avg_availability) AS availability
      //     FROM site_availability_daily sad
      //     JOIN site_configs sc ON sc.id = sad.site_config_id
      //     GROUP BY sad.snapshot_date
      //   ),

      //   inc AS (
      //     SELECT
      //       isi.site_id,
      //       i.incident_id,
      //       i.incident_number,
      //       i.subject,
      //       i.fault_datetime,
      //       i.create_datetime,
      //       i.actual_start_datetime,
      //       i.actual_finish_datetime,
      //       i.restoration_datetime,
      //       i.severity,
      //       i.problem,
      //       i.cause,
      //       i.remedy
      //     FROM incidents i
      //     JOIN incident_site_impact isi
      //       ON isi.incident_id = i.incident_id
      //     JOIN sites s
      //       ON s.id = isi.site_id
      //     WHERE s.site_code = $1
      //   )

      //   SELECT
      //     to_char(ds.d, 'YYYY-MM-DD') AS date,
      //     COALESCE(a.availability, 0) AS availability,

      //     COALESCE(
      //       json_agg(
      //         json_build_object(
      //           'id', inc.incident_id,
      //           'ticket', inc.incident_number,
      //           'severity', inc.severity,
      //           'subject', inc.subject,
      //           'problem', inc.problem,
      //           'cause', inc.cause,
      //           'remedy', inc.remedy,
      //           'fault_datetime', inc.fault_datetime,
      //           'create_datetime', inc.create_datetime,
      //           'actual_start_datetime', inc.actual_start_datetime,
      //           'actual_finish_datetime', inc.actual_finish_datetime,
      //           'restoration_datetime', inc.restoration_datetime
      //         )
      //       ) FILTER (WHERE inc.incident_id IS NOT NULL),
      //       '[]'
      //     ) AS incidents

      //   FROM date_series ds

      //   LEFT JOIN ava a
      //     ON a.snapshot_date = ds.d

      //   LEFT JOIN inc
      //     ON inc.fault_datetime::date <= ds.d
      //     AND (inc.restoration_datetime IS NULL OR inc.restoration_datetime::date >= ds.d)

      //   GROUP BY ds.d, a.availability
      //   ORDER BY ds.d;
      // `,
      //   [site_code, start_date, end_date]
      // );
      const res = await client.query(
        `
        WITH date_series AS (
          SELECT generate_series(
            $2::date,
            $3::date,
            interval '1 day'
          )::date AS d
        ),

        site_configs AS (
          SELECT sc.id
          FROM sites s
          JOIN site_config sc ON sc.site_id = s.id
          WHERE s.site_code = $1
        ),

        ava AS (
          SELECT
            sad.snapshot_date,
            AVG(sad.avg_availability) AS availability
          FROM site_availability_daily sad
          JOIN site_configs sc ON sc.id = sad.site_config_id
          GROUP BY sad.snapshot_date
        ),

        inc AS (
          SELECT
            isi.site_id,
            i.incident_id,
            i.incident_number,
            i.subject,
            i.fault_datetime,
            i.create_datetime,
            i.actual_start_datetime,
            i.actual_finish_datetime,
            i.restoration_datetime,
            i.severity,
            i.problem,
            i.cause,
            i.remedy
          FROM incidents i
          JOIN incident_site_impact isi
            ON isi.incident_id = i.incident_id
          JOIN sites s
            ON s.id = isi.site_id
          WHERE s.site_code = $1
        )

        SELECT
          to_char(ds.d, 'YYYY-MM-DD') AS date,
          COALESCE(a.availability, 0) AS availability,

          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'id', inc.incident_id,
                'ticket', inc.incident_number,
                'severity', inc.severity,
                'subject', inc.subject,
                'problem', inc.problem,
                'cause', inc.cause,
                'remedy', inc.remedy,
                'fault_datetime', inc.fault_datetime,
                'create_datetime', inc.create_datetime,
                'actual_start_datetime', inc.actual_start_datetime,
                'actual_finish_datetime', inc.actual_finish_datetime,
                'restoration_datetime', inc.restoration_datetime
              )
            ) FILTER (WHERE inc.incident_id IS NOT NULL),
            '[]'
          ) AS incidents

        FROM date_series ds

        LEFT JOIN ava a
          ON a.snapshot_date = ds.d

        LEFT JOIN inc
          ON inc.fault_datetime::date = ds.d

        GROUP BY ds.d, a.availability
        ORDER BY ds.d;
      `,
        [site_code, start_date, end_date]
      );
      return res.rows;
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  },

  async AVAChartALL(data: any, pool: any) {
    const { site_codes, start_date, end_date } = data;

    console.log(data);

    if (!site_codes) {
      throw new Error("list site_code is required");
    }

    const client = await pool.connect();

    console.log(data);
    try {
      // const res = await client.query(
      //   `
      //   WITH date_series AS (
      //     SELECT generate_series(
      //       $2::date,
      //       $3::date,
      //       interval '1 day'
      //     )::date AS d
      //   ),

      //   site_configs AS (
      //     SELECT sc.id
      //     FROM sites s
      //     JOIN site_config sc ON sc.site_id = s.id
      //     WHERE s.site_code = ANY($1)
      //   ),

      //   ava AS (
      //     SELECT
      //       sad.snapshot_date,
      //       AVG(sad.avg_availability) AS availability
      //     FROM site_availability_daily sad
      //     JOIN site_configs sc ON sc.id = sad.site_config_id
      //     GROUP BY sad.snapshot_date
      //   ),

      //   inc AS (
      //     SELECT
      //       isi.site_id,
      //       i.incident_id,
      //       i.incident_number,
      //       i.subject,
      //       i.fault_datetime,
      //       i.create_datetime,
      //       i.actual_start_datetime,
      //       i.actual_finish_datetime,
      //       i.restoration_datetime,
      //       i.severity,
      //       i.problem,
      //       i.cause,
      //       i.remedy
      //     FROM incidents i
      //     JOIN incident_site_impact isi
      //       ON isi.incident_id = i.incident_id
      //     JOIN sites s
      //       ON s.id = isi.site_id
      //     WHERE s.site_code = ANY($1)
      //   )

      //   SELECT
      //     to_char(ds.d, 'YYYY-MM-DD') AS date,
      //     COALESCE(a.availability, 0) AS availability,

      //     COALESCE(
      //       json_agg(
      //         json_build_object(
      //           'id', inc.incident_id,
      //           'ticket', inc.incident_number,
      //           'severity', inc.severity,
      //           'subject', inc.subject,
      //           'problem', inc.problem,
      //           'cause', inc.cause,
      //           'remedy', inc.remedy,
      //           'fault_datetime', inc.fault_datetime,
      //           'create_datetime', inc.create_datetime,
      //           'actual_start_datetime', inc.actual_start_datetime,
      //           'actual_finish_datetime', inc.actual_finish_datetime,
      //           'restoration_datetime', inc.restoration_datetime
      //         )
      //       ) FILTER (WHERE inc.incident_id IS NOT NULL),
      //       '[]'
      //     ) AS incidents

      //   FROM date_series ds

      //   LEFT JOIN ava a
      //     ON a.snapshot_date = ds.d

      //   LEFT JOIN inc
      //     ON inc.fault_datetime::date <= ds.d
      //     AND (inc.restoration_datetime IS NULL OR inc.restoration_datetime::date >= ds.d)

      //   GROUP BY ds.d, a.availability
      //   ORDER BY ds.d;
      // `,
      //   [site_code, start_date, end_date]
      // );
      const res = await client.query(
        `
        WITH date_series AS (
          SELECT generate_series(
            $2::date,
            $3::date,
            interval '1 day'
          )::date AS d
        ),

        site_list AS (
          SELECT DISTINCT s.site_code
          FROM sites s
          WHERE s.site_code = ANY($1)
        ),

        site_dates AS (
          SELECT
            sl.site_code,
            ds.d
          FROM site_list sl
          CROSS JOIN date_series ds
        ),

        site_configs AS (
          SELECT
            sc.id,
            s.site_code
          FROM sites s
          JOIN site_config sc
            ON sc.site_id = s.id
          WHERE s.site_code = ANY($1)
        ),

        ava AS (
          SELECT
            sc.site_code,
            sad.snapshot_date,
            AVG(sad.avg_availability) AS availability
          FROM site_availability_daily sad
          JOIN site_configs sc
            ON sc.id = sad.site_config_id
          GROUP BY
            sc.site_code,
            sad.snapshot_date
        ),

        inc AS (
          SELECT
            isi.site_id,
            s.site_code,
            i.incident_id,
            i.incident_number,
            i.subject,
            i.fault_datetime,
            i.create_datetime,
            i.actual_start_datetime,
            i.actual_finish_datetime,
            i.restoration_datetime,
            i.severity,
            i.problem,
            i.cause,
            i.remedy
          FROM incidents i
          JOIN incident_site_impact isi
            ON isi.incident_id = i.incident_id
          JOIN sites s
            ON s.id = isi.site_id
          WHERE s.site_code = ANY($1)
        )

        SELECT
          sd.site_code,
          to_char(sd.d, 'YYYY-MM-DD') AS date,

          COALESCE(a.availability, 0) AS availability,

          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'id', inc.incident_id,
                'ticket', inc.incident_number,
                'site', inc.site_code,
                'severity', inc.severity,
                'subject', inc.subject,
                'problem', inc.problem,
                'cause', inc.cause,
                'remedy', inc.remedy,
                'fault_datetime', inc.fault_datetime,
                'create_datetime', inc.create_datetime,
                'actual_start_datetime', inc.actual_start_datetime,
                'actual_finish_datetime', inc.actual_finish_datetime,
                'restoration_datetime', inc.restoration_datetime
              )
            ) FILTER (
              WHERE inc.incident_id IS NOT NULL
            ),
            '[]'
          ) AS incidents

        FROM site_dates sd

        LEFT JOIN ava a
          ON a.site_code = sd.site_code
          AND a.snapshot_date = sd.d

        LEFT JOIN inc
          ON inc.site_code = sd.site_code
          AND inc.fault_datetime::date = sd.d

        GROUP BY
          sd.site_code,
          sd.d,
          a.availability

        ORDER BY
          sd.site_code,
          sd.d;
      `,
        [site_codes, start_date, end_date]
      );
      return res.rows;
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  },

  async AVAChartALL_graph(data: any, pool: any) {
    const { site_codes, start_date, end_date } = data;

    console.log(data);

    if (!site_codes) {
      throw new Error("list site_code is required");
    }

    const client = await pool.connect();
    try {
      const sql = `
      WITH date_series AS (
        SELECT generate_series(
          $2::date,
          $3::date,
          interval '1 day'
        )::date AS d
      ),

      site_configs AS (
        SELECT
          sc.id
        FROM sites s
        JOIN site_config sc
          ON sc.site_id = s.id
        WHERE s.site_code = ANY($1)
      ),

      ava AS (
        SELECT
          sad.snapshot_date,
          AVG(sad.avg_availability) AS availability
        FROM site_availability_daily sad
        JOIN site_configs sc
          ON sc.id = sad.site_config_id
        GROUP BY sad.snapshot_date
      )

      SELECT
        to_char(ds.d, 'YYYY-MM-DD') AS date,

        ROUND(
          COALESCE(a.availability, 0)::numeric,
          3
        ) AS availability

      FROM date_series ds

      LEFT JOIN ava a
        ON a.snapshot_date = ds.d

      ORDER BY ds.d;
      `;
      const res = await client.query(sql, [site_codes, start_date, end_date]);
      return res.rows;
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }

  },

  async AVAChartALL_incident(data: any, pool: any) {
    const { site_codes, date } = data;

    console.log(data);

    if (!site_codes) {
      throw new Error("list site_code is required");
    }

    const client = await pool.connect();
    try {
      const sql = `
      SELECT DISTINCT
        i.incident_id,
        i.incident_number AS ticket,
        s.site_code AS site,
        i.severity,
        i.subject,
        i.problem,
        i.cause,
        i.remedy,
        i.fault_datetime,
        i.create_datetime,
        i.actual_start_datetime,
        i.actual_finish_datetime,
        i.restoration_datetime

      FROM incidents i

      JOIN incident_site_impact isi
        ON isi.incident_id = i.incident_id

      JOIN sites s
        ON s.id = isi.site_id

      WHERE s.site_code = ANY($1)

      AND i.fault_datetime::date = $2::date

      ORDER BY
        i.fault_datetime ASC;
      `;
      const res = await client.query(sql, [site_codes, date]);
      return res.rows;
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }

  }
};