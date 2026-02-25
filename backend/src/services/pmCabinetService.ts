import { success } from "zod";

export const pmCabinetService = {
    async AddCabinet(data: any, db: any) {
        const client = await db.connect();
        console.log(data);
        try {
            await client.query("BEGIN");
            const sql = `
                INSERT INTO pm_cabinet (pm_id, cabinet_name, cabinet_network) VALUES ($1, $2, $3)
                RETURNING id;
            `;

            const cabinetResult = await client.query(sql, [
                data.pm_id,
                data.cabinet_name,
                data.cabinet_network
            ]);

            const cabinet_id = cabinetResult.rows[0].id;

            const values = [];
            const params = [];
            let paramIndex = 1;

            for (let i = 0; i < data.battery.count; i++) {
                values.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
                params.push(cabinet_id, i + 1, data.battery.type);
            }

            await client.query(
                `
                INSERT INTO pm_battery (cabinet_id, battery_number, battery_type)
                VALUES ${values.join(",")}
                `,
                params
            );

            await client.query("COMMIT");
            return {
                success: true
            }
        } catch (err) {
            await client.query("ROLLBACK");
            console.error("AddCabinet error:", err);
            return {
                success: false
            }
        } finally {
            client.release();
        }
    },
}