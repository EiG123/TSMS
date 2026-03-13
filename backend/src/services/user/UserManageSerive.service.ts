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
}