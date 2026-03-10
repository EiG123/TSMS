import { success } from "zod";

export const AdminManageService = {
    async getAllUser(db: any) {
        const client = await db.connect();
        try {
            const sql = `SELECT 
            u.id,
            u.email,
            u.username,
            u.phone,
            u.region,
            u.company,
            u.status,
            r.name as role
            FROM users u
            LEFT JOIN user_roles ur ON ur.user_id = u.id
            LEFT JOIN roles r ON r.id = ur.role_id
            WHERE u.email != $1
            `;

            const res = await client.query(sql, ['dev@gmail.com']);
            return {
                success: true,
                result: res.rows
            }
        } catch (err) {
            console.log(err);
            return {
                success: false
            }
        } finally {
            client.release();
        }
    },

    async getUserById(data: any, db: any) {
        const client = await db.connect();
        try {
            const sql = `SELECT 
            u.id,
            u.email,
            u.username,
            u.phone,
            u.region,
            u.company,
            u.status,
            r.id as role_id,
            r.name as role
            FROM users u 
            LEFT JOIN user_roles ur ON ur.user_id = u.id
            LEFT JOIN roles r ON r.id = ur.role_id
            WHERE u.id = $1
            `;

            const res = await client.query(sql, [data]);
            return {
                success: true,
                result: res.rows
            }
        } catch (err) {
            console.log(err);
            return {
                success: false
            }
        } finally {
            client.release();
        }
    },


    async userEdit(data: any, db: any) {
        const client = await db.connect();
        try {
            if(data.email === `dev@gmail.com`){
                return {
                    success: false
                }
            }
            const sql = `
            UPDATE users u
            SET 
                email = $2,
                username = $3,
                phone = $4,
                region = $5,
                company = $6,
                status = $7
            WHERE u.id = $1
            RETURNING u.id;
            `;

            const res = await client.query(sql, [
                data.id,
                data.email,
                data.username,
                data.phone,
                data.region,
                data.company,
                data.status
            ]);

            const userId = res.rows[0].id;
            // console.log(userId);

            const sql_role = `UPDATE user_roles
            SET
                role_id = $2
            WHERE user_id = $1`;

            await client.query(sql_role, [
                userId,
                data.roleId
            ])
            return {
                success: true,
                result: res.rows[0] ?? null
            };

        } catch (err) {
            console.error("userEdit error:", err);
            return { success: false };
        } finally {
            client.release();
        }
    },


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
            WHERE r.name != $1
            GROUP BY r.id
            ORDER BY r.id
            `;
            const res = await client.query(sql, ['dev']);

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

    
    async deleteUserById(data:any, db: any) {
        const client = await db.connect();
        try {
            const sql = `DELETE FROM users WHERE id = $1`;
            const res = await client.query(sql, [data]);
            return {
                success: true,
            }
        } catch (err) {
            return {
                success: false
            }
        } finally {
            client.release();
        }
    },
}