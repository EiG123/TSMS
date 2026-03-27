import bcrypt from "bcryptjs";
import { success } from "zod";

export const UserLocationService = {
    async location(data: any, db: any) {
        const client = await db.connect();
        try {
            const sql = `
                INSERT INTO user_locations (user_id, latitude, longitude, updated_at)
                VALUES ($1, $2, $3, NOW())
                ON CONFLICT (user_id)
                DO UPDATE SET
                latitude = EXCLUDED.latitude,
                longitude = EXCLUDED.longitude,
                updated_at = NOW();
            `;
            await client.query(sql, [data.userId, data.lat, data.lng])
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
}