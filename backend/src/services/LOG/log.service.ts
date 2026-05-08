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