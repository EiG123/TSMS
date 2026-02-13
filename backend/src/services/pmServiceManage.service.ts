import { success } from "zod";

export const pmServiceManage = {
    async getData(
        db: any
    ) {
        const client = await db.connect();

        try {
            const sql = `SELECT * FROM pm`

            const res = await client.query(sql);
            return {
                data: res.rows,
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

    async deletPmById(id: number, db: any) {
        const client = await db.connect();
        try {
            const sql = `DELETE FROM pm WHERE id = $1`

            const values = [
                id
            ];
            const res = await client.query(sql, values);
            return {
                data: res,
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

    async getPmDataById(id: number, db: any) {
        const client = await db.connect();
        try {
            const sql = `SELECT 
                    p.*,

                    -- generator
                    COALESCE(
                        (
                            SELECT json_agg(g)
                            FROM pm_generator g
                            WHERE g.pm_id = p.id
                        ),
                        '[]'
                    ) AS generators,

                    -- transformer
                    COALESCE(
                        (
                            SELECT json_agg(t)
                            FROM pm_transformer t
                            WHERE t.pm_id = p.id
                        ),
                        '[]'
                    ) AS transformers,

                    -- kwh meter
                    COALESCE(
                        (
                            SELECT json_agg(k)
                            FROM pm_kwh_meter k
                            WHERE k.pm_id = p.id
                        ),
                        '[]'
                    ) AS kwh_meters,

                    -- solar cell
                    COALESCE(
                        (
                            SELECT json_agg(s)
                            FROM pm_solar_cell s
                            WHERE s.pm_id = p.id
                        ),
                        '[]'
                    ) AS solar_cells,

                    -- mowing
                    COALESCE(
                        (
                            SELECT json_agg(m)
                            FROM pm_mowing m
                            WHERE m.pm_id = p.id
                        ),
                        '[]'
                    ) AS mowings

                FROM pm p
                WHERE p.id = $1;
                `

            const value = [
                id
            ];
            const res = await client.query(sql, value);
            return {
                success: true,
                data: res.rows[0]
            }
        } catch (err) {
            return {
                success: false
            }
        } finally {
            client.release();
        }
    }
};
