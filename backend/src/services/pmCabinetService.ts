import { success } from "zod";

export const pmCabinetService = {
    async getPmCabinetById(data: any, db: any) {
        const client = await db.connect();
        try {
            const sql = `
            SELECT 
                p.id,

                COALESCE(
                    (
                        SELECT json_agg(
                            json_build_object(
                                'id', cab.id,
                                'cabinet_name', cab.cabinet_name,
                                'cabinet_network', cab.cabinet_network,
                                'rectifier_count', cab.rectifier,

                                -- rectifiers
                                'rectifiers', COALESCE(r.rectifiers, '[]'),

                                -- batteries
                                'batteries', COALESCE(b.batteries, '[]')
                            )
                        )
                        FROM pm_cabinet cab

                        -- 🔹 Rectifier aggregate
                        LEFT JOIN LATERAL (
                            SELECT json_agg(pmr) AS rectifiers
                            FROM pm_rectifier pmr
                            WHERE pmr.cabinet_id = cab.id
                        ) r ON true

                        -- 🔹 Battery aggregate
                        LEFT JOIN LATERAL (
                            SELECT json_agg(pmb) AS batteries
                            FROM pm_battery pmb
                            WHERE pmb.cabinet_id = cab.id
                        ) b ON true

                        WHERE cab.pm_id = p.id
                    ),
                    '[]'
                ) AS cabinets

            FROM pm p
            WHERE p.id = $1;
            `;
            const res = await client.query(sql, [data.id]);
            console.log(res.rows[0]);
            return {
                success: true,
                result: res.rows[0]
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

    async AddCabinet(data: any, db: any) {
        const client = await db.connect();
        console.log(data);
        try {
            await client.query("BEGIN");
            const sql = `
                INSERT INTO pm_cabinet (pm_id, cabinet_name, cabinet_network, rectifier) VALUES ($1, $2, $3, $4)
                RETURNING id;
            `;

            const cabinetResult = await client.query(sql, [
                data.pm_id,
                data.cabinet_name,
                data.cabinet_network,
                data.rectifier_count || 0,
            ]);

            const cabinet_id = cabinetResult.rows[0].id;

            const values = [];
            const params = [];
            let paramIndex = 1;

            if (data.battery.enabled) {
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
            }

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

    async deleteCabinet(data: any, db: any) {
        const client = await db.connect();
        console.log(data);
        try {
            await client.query("BEGIN");
            const delete_sql = `DELETE FROM pm_cabinet WHERE id = $1`;
            await client.query(delete_sql, [data]);
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