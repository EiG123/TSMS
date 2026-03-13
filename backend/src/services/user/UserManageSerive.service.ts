import bcrypt from "bcryptjs";
import { success } from "zod";

export const UserManageService = {
    async getProfileData(data: any, db: any) {
        const client = await db.connect();
        try {
            const sql = `SELECT region FROM users WHERE id = $1`;
            const res = await client.query(sql, [data.userId]);
            return {
                success: true,
                result: res.rows[0]
            }
        } catch (error) {
            return {
                success: false,
                message: "ไม่สามารถดึงข้อมูล User จาก DataBase ได้"
            }
        } finally {
            client.release();
        }

    },

    async updateProfile(data: any, db: any) {
        const client = await db.connect();
        try {
            let sql = "";
            if(data.password !== null){
                sql = `UPDATE users SET
                username = $2,
                password = $3
                WHERE id = $1`;

                await client.query(sql, [data.userId, data.username, data.password]);
            }else{
                sql = `UPDATE users SET username = $2 WHERE WHERE id = $1`
                await client.query(sql, [data.userId, data.username]);
            }

            return {
                success: false
            };

        } catch (error) {
            return {
                success: false,
                message: "ไม่สามารถอัปเดตข้อมูล User ได้"
            };
        } finally {
            client.release();
        }
    }
}