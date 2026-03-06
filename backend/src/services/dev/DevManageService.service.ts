import { success } from "zod";

export const DevManageService = {
    async getAllRole(db: any) {
        const client = await db.connect();
        try {
            const sql = `SELECT 
            r.id,
            r.name,
            r.description,
            COALESCE(
                ARRAY_AGG(p.name)
                FILTER (WHERE p.name IS NOT NULL),
                '{}'
            ) AS permissions
            FROM roles r
            LEFT JOIN role_permissions rp ON rp.role_id = r.id
            LEFT JOIN permissions p ON p.id = rp.permission_id
            GROUP BY r.id
            ORDER BY r.id
            `;
            const res = await client.query(sql);

            return {
                success: true,
                result: res.rows
            }
        } catch (err) {
            return {
                success: false
            }
        } finally {
            client.release();
        }
    },

    async getAllPermission(db: any) {
        const client = await db.connect();
        try {
            const sql = `SELECT * FROM permissions`;
            const res = await client.query(sql);
            return {
                result: res.rows,
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

    async getAllRoleWithPermission(db: any) {
        const client = await db.connect();
        try {
            const sql = `SELECT
                r.id,
                r.name,
                r.description,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', p.id,
                            'name', p.name,
                            'description', p.description
                        )
                    ) FILTER (WHERE p.id IS NOT NULL),
                    '[]'
                ) AS permissions
            FROM roles r
            LEFT JOIN role_permissions rp 
                ON rp.role_id = r.id
            LEFT JOIN permissions p 
                ON p.id = rp.permission_id
            GROUP BY r.id
            ORDER BY r.id;`;
            const res = await client.query(sql);
            return {
                result: res.rows,
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

    async savePermissions(data: any, db: any) {
        const client = await db.connect();
        if (data.roleId === 1) {
            return { success: false, message: "dev role locked" }
        }

        try {
            await client.query("BEGIN");

            const sql_delete = `DELETE FROM role_permissions WHERE role_id = $1`;
            await client.query(sql_delete, [data.roleId]);

            if (data.permissions && data.permissions.length > 0) {
                const sql = `
                INSERT INTO role_permissions (role_id, permission_id)
                SELECT $1, p.id
                FROM permissions p
                WHERE p.name = ANY($2::text[])
                `;
                await client.query(sql, [data.roleId, data.permissions]);
            }

            await client.query("COMMIT");
            return {
                success: true
            }
        } catch (err) {
            await client.query("ROLLBACK");
            console.error(err);
            return {
                success: false
            }
        } finally {
            client.release();
        }
    }

}