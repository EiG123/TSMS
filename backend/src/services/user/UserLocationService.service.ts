import bcrypt from "bcryptjs";
import { success } from "zod";

export const UserLocationService = {
    async location(data: any, db: any) {
        const client = await db.connect();
        if (data.userId === undefined) {
            return {
                success: false
            }
        }
        try {
            const sql = `
                INSERT INTO user_locations (user_id, latitude, longitude, status, job, updated_at)
                VALUES ($1, $2, $3, $4, $5, NOW())
                ON CONFLICT (user_id)
                DO UPDATE SET
                latitude = EXCLUDED.latitude,
                longitude = EXCLUDED.longitude,
                status = EXCLUDED.status,
                job = EXCLUDED.job,
                updated_at = NOW()
                WHERE
                user_locations.latitude IS DISTINCT FROM EXCLUDED.latitude
                OR user_locations.longitude IS DISTINCT FROM EXCLUDED.longitude;
            `;
            await client.query(sql, [data.userId, data.lat, data.lng, data.status, data.job])
            return {
                success: true,
                result: "good"
            }
        } catch (err) {
            console.log(err);
            return {
                success: false,
            }
        }
        finally {
            client.release();
        }

    },

    async getLocation(db: any) {
        const client = await db.connect();
        try {
            const sql = `SELECT * FROM user_locations WHERE status = 'active'`;
            const result = await client.query(sql);
            return {
                success: true,
                result: result.rows
            };
        } catch (err) {
            console.log(err);
            return {
                success: false,
                result: []
            };
        } finally {
            client.release();
        }
    }
}