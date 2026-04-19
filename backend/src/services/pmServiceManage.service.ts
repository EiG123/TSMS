import { success } from "zod";

export const pmServiceManage = {
    async pmGetPmList(
        data: any, db: any
    ) {
        const client = await db.connect();
        try {
            if (data.region === null) {
                const sql = `
                SELECT
                    p.id, 
                    p.site_id,
                    p.type,
                    p.date,
                    p.planwork,
                    p.service_status,
                    p.progress_status,
                    p.vendor,
                    p.created_by,
                    p.created_at,
                    p.updated_by,
                    p.updated_at,
                    s.region,
                    s.site_name,
                    -- ใช้ COALESCE ครอบผลลัพธ์จาก Subquery โดยตรง
                    COALESCE(c.cabinets, '[]'::json) AS cabinets,
                    COALESCE(m.mowing, '[]'::json) AS mowing,
                    COALESCE(sc.solar_cell, '[]'::json) AS solar_cell
                FROM pm p
                -- ดึงข้อมูล Site
                LEFT JOIN sites s ON s.id = p.site_id

                -- ดึงข้อมูล Cabinets
                LEFT JOIN LATERAL (
                    SELECT json_agg(
                        json_build_object(
                            'id', pmc.id,
                            'cabinet_name', pmc.cabinet_name,
                            'cabinet_network', pmc.cabinet_network
                        )
                    ) AS cabinets
                    FROM pm_cabinet pmc
                    WHERE pmc.pm_id = p.id
                ) c ON true

                -- ดึงข้อมูล Mowing
                LEFT JOIN LATERAL (
                    SELECT json_agg(
                        json_build_object(
                            'round', pmm.round,
                            'status', pmm.status
                        )
                    ) AS mowing
                    FROM pm_mowing pmm
                    WHERE pmm.pm_id = p.id 
                ) m ON true

                -- ดึงข้อมูล Solar Cell
                LEFT JOIN LATERAL (
                    SELECT json_agg(
                        json_build_object(
                            'solar_cell', pmsc.number,
                            'status', pmsc.status
                        )
                    ) AS solar_cell
                    FROM pm_solar_cell pmsc
                    WHERE pmsc.pm_id = p.id 
                ) sc ON true

                WHERE p.type = $1;
                `;

                const res = await client.query(sql, [data.type]);

                return {
                    data: res.rows,
                    success: true
                }
            }else{
                const sql = `
                SELECT
                    p.id, 
                    p.site_id,
                    p.type,
                    p.date,
                    p.planwork,
                    p.service_status,
                    p.progress_status,
                    p.vendor,
                    p.created_by,
                    p.created_at,
                    p.updated_by,
                    p.updated_at,
                    s.region,
                    s.site_name,
                    -- ใช้ COALESCE ครอบผลลัพธ์จาก Subquery โดยตรง
                    COALESCE(c.cabinets, '[]'::json) AS cabinets,
                    COALESCE(m.mowing, '[]'::json) AS mowing,
                    COALESCE(sc.solar_cell, '[]'::json) AS solar_cell
                FROM pm p
                -- ดึงข้อมูล Site
                LEFT JOIN sites s ON s.id = p.site_id

                -- ดึงข้อมูล Cabinets
                LEFT JOIN LATERAL (
                    SELECT json_agg(
                        json_build_object(
                            'id', pmc.id,
                            'cabinet_name', pmc.cabinet_name,
                            'cabinet_network', pmc.cabinet_network
                        )
                    ) AS cabinets
                    FROM pm_cabinet pmc
                    WHERE pmc.pm_id = p.id
                ) c ON true

                -- ดึงข้อมูล Mowing
                LEFT JOIN LATERAL (
                    SELECT json_agg(
                        json_build_object(
                            'round', pmm.round,
                            'status', pmm.status
                        )
                    ) AS mowing
                    FROM pm_mowing pmm
                    WHERE pmm.pm_id = p.id 
                ) m ON true

                -- ดึงข้อมูล Solar Cell
                LEFT JOIN LATERAL (
                    SELECT json_agg(
                        json_build_object(
                            'solar_cell', pmsc.number,
                            'status', pmsc.status
                        )
                    ) AS solar_cell
                    FROM pm_solar_cell pmsc
                    WHERE pmsc.pm_id = p.id 
                ) sc ON true

                WHERE p.type = $1 AND s.region = $2;
                `;

                const res = await client.query(sql, [data.type, data.region]);

                return {
                    data: res.rows,
                    success: true
                }
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
    },




    // async valuePmByIdTitleIdTitleChildId(data: any, pool: any) {
    //     const client = await pool.connect();

    //     try {
    //         // ===== Validate input =====
    //         if (!Array.isArray(data.title_child_value_list)) {
    //             throw new Error("title_child_value_list must be an array");
    //         }

    //         if (data.title_child_value_list.length === 0) {
    //             return {
    //                 success: true,
    //                 data: []
    //             };
    //         }

    //         // แปลงเป็น number และกรองค่าที่ไม่ใช่ตัวเลข
    //         const idList = data.title_child_value_list
    //             .map(Number)
    //             .filter(n => Number.isInteger(n));

    //         if (idList.length === 0) {
    //             throw new Error("Invalid id list");
    //         }

    //         const sql = `
    //             SELECT *
    //             FROM pm_details
    //             WHERE pm_id = $1
    //             AND title_child_value_id = ANY($2::int[]);
    //         `;

    //         const result = await client.query(sql, [
    //             data.pmId,
    //             idList
    //         ]);

    //         return {
    //             success: true,
    //             data: result.rows
    //         };

    //     } catch (error: any) {

    //         console.error("valuePmByIdTitleIdTitleChildId error:", error);

    //         return {
    //             success: false,
    //             message: error.message
    //         };

    //     } finally {
    //         client.release();
    //     }
    // }
};
