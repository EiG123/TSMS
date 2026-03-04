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
            `;

            const res = await client.query(sql);
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
            const sql = `UPDATE 
            u.email = $2,
            u.username = $3,
            u.phone = $4,
            u.region = $5,
            u.company = $6,
            u.status = $7,
            FROM users u 
            WHERE u.id = $1
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

            return {
                success: true
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

}