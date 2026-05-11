import pool from "../db.js";

interface AuditLogPayload {
    user_id?: number;
    username?: string;
    email?: string;

    action: string;
    module?: string;

    target_table?: string;
    target_id?: string;

    detail?: string;

    old_data?: any;
    new_data?: any;

    method?: string;
    endpoint?: string;

    ip_address?: string;
    user_agent?: string;

    success?: boolean;
}

export const logService = {
    async getLogs(filters: any, db: any) {

        let whereSql = `
    WHERE 1=1
  `;

        const values: any[] = [];

        let index = 1;

        // user_id
        if (filters.user_id) {
            whereSql += `
      AND user_id = $${index++}
    `;

            values.push(filters.user_id);
        }

        // username
        if (filters.username) {
            whereSql += `
      AND LOWER(username)
      LIKE LOWER($${index++})
    `;

            values.push(
                `%${filters.username}%`
            );
        }

        // email
        if (filters.email) {
            whereSql += `
      AND LOWER(email)
      LIKE LOWER($${index++})
    `;

            values.push(
                `%${filters.email}%`
            );
        }

        // action
        if (filters.action) {
            whereSql += `
      AND LOWER(action)
      LIKE LOWER($${index++})
    `;

            values.push(
                `%${filters.action}%`
            );
        }

        // start date
        if (filters.start_date) {
            whereSql += `
      AND created_at >= $${index++}
    `;

            values.push(filters.start_date);
        }

        // end date
        if (filters.end_date) {

            // 👇 เพิ่ม 23:59:59
            whereSql += `
      AND created_at <= $${index++}
    `;

            values.push(
                filters.end_date + " 23:59:59"
            );
        }

        // pagination
        const limit =
            Number(filters.limit) || 50;

        const page =
            Number(filters.page) || 1;

        const offset =
            (page - 1) * limit;

        // =========================
        // COUNT QUERY
        // =========================

        const countSql = `
    SELECT COUNT(*) AS total
    FROM audit_logs
    ${whereSql}
  `;

        const countResult =
            await db.query(
                countSql,
                values
            );

        const total =
            Number(
                countResult.rows[0].total
            );

        // =========================
        // MAIN QUERY
        // =========================

        const dataSql = `
    SELECT *
    FROM audit_logs

    ${whereSql}

    ORDER BY created_at DESC

    LIMIT $${index++}
    OFFSET $${index++}
  `;

        const dataValues = [
            ...values,
            limit,
            offset,
        ];

        const result =
            await db.query(
                dataSql,
                dataValues
            );

        return {

            data: result.rows,

            pagination: {
                total,
                page,
                limit,

                total_pages:
                    Math.ceil(total / limit),
            },
        };
    },

    async createAuditLog(
        payload: AuditLogPayload
    ) {
        try {
            const query = `
      INSERT INTO audit_logs (
        user_id,
        username,
        email,

        action,
        module,

        target_table,
        target_id,

        description,

        old_data,
        new_data,

        method,
        endpoint,

        ip_address,
        user_agent,

        success
      )
      VALUES (
        $1,$2,$3,
        $4,$5,
        $6,$7,
        $8,
        $9,$10,
        $11,$12,
        $13,$14,
        $15
      )
    `;

            const values = [
                payload.user_id || null,
                payload.username || null,
                payload.email || null,

                payload.action,
                payload.module || null,

                payload.target_table || null,
                payload.target_id || null,

                payload.detail || null,

                payload.old_data
                    ? JSON.stringify(payload.old_data)
                    : null,

                payload.new_data
                    ? JSON.stringify(payload.new_data)
                    : null,

                payload.method || null,
                payload.endpoint || null,

                payload.ip_address || null,
                payload.user_agent || null,

                payload.success ?? true,
            ];

            await pool.query(query, values);
        } catch (error) {
            console.error("Create Audit Log Error:", error);
        }
    }
};