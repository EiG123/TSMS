import { Hono } from "hono";
import { PmService } from "../services/PmNodeB.service.js";
import { Pool } from "pg";
import { validateRequest } from "../middlewares/pm_validation.middleware.js";
import { pmNodeBSchema } from "../validation/pmNode.schema.js";

const pmInsertRouter = new Hono();

// ตั้งค่าเชื่อมต่อ DB
const db = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'tsms_db',
    password: process.env.DB_PASSWORD || '1234',
    port: Number(process.env.DB_PORT) || 5432,
});

// ⭐ API สำหรับบันทึก PM หลัก (ต้อง return pm_id)
pmInsertRouter.post("/pm_nodeb", async (c) => {
    try {
        const body = await c.req.json();
        console.log(body);

        const result = await PmService.InsertPM(
            body,
            db
        );

        if (result.success) {
            // ⭐ ต้อง return pm_id กลับไปด้วย
            return c.json({
                success: true,
                message: "บันทึกข้อมูล PM สำเร็จ",
                data: {
                    pm_id: result.pm_id,  // ⭐ สำคัญมาก!
                }
            });
        } else {
            return c.json(result, 401);
        }

    } catch (error) {
        console.error('PM NodeB error:', error);
        return c.json({
            success: false,
            message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        }, 500);
    }
});

// // ⭐ API สำหรับบันทึก Site Information
// pmInsertRouter.post("/pm_site_information", async (c) => {
//     try {
//         const body = await c.req.json();
//         const { pm_id, ...siteData } = body;

//         if (!pm_id) {
//             return c.json({
//                 success: false,
//                 message: "ไม่พบ pm_id"
//             }, 400);
//         }

//         const result = await PmService.InsertSiteInformation(pm_id, siteData, db);

//         return c.json(result);

//     } catch (error) {
//         console.error('Site Information error:', error);
//         return c.json({
//             success: false,
//             message: "เกิดข้อผิดพลาดในการบันทึก Site Information"
//         }, 500);
//     }
// });

// ⭐ API สำหรับบันทึก KWH Meter
// pmInsertRouter.post("/pm_kwh_meter", async (c) => {
//     try {
//         const body = await c.req.json();
//         const { pm_id, ...kwhData } = body;

//         if (!pm_id) {
//             return c.json({
//                 success: false,
//                 message: "ไม่พบ pm_id"
//             }, 400);
//         }

//         const result = await PmService.InsertKwhMeter(pm_id, kwhData, db);

//         return c.json(result);

//     } catch (error) {
//         console.error('KWH Meter error:', error);
//         return c.json({
//             success: false,
//             message: "เกิดข้อผิดพลาดในการบันทึก KWH Meter"
//         }, 500);
//     }
// });

// ⭐ API สำหรับบันทึก Batteries (Array)
// pmInsertRouter.post("/pm_batteries", async (c) => {
//     try {
//         const body = await c.req.json();
//         const { pm_id, batteries } = body;

//         if (!pm_id) {
//             return c.json({
//                 success: false,
//                 message: "ไม่พบ pm_id"
//             }, 400);
//         }

//         if (!Array.isArray(batteries) || batteries.length === 0) {
//             return c.json({
//                 success: false,
//                 message: "ข้อมูล batteries ไม่ถูกต้อง"
//             }, 400);
//         }

//         const result = await PmService.InsertBatteries(pm_id, batteries, db);

//         return c.json(result);

//     } catch (error) {
//         console.error('Batteries error:', error);
//         return c.json({
//             success: false,
//             message: "เกิดข้อผิดพลาดในการบันทึก Batteries"
//         }, 500);
//     }
// });

// ⭐ เพิ่ม endpoints อื่นๆ ตามนี้...
// pm_transformer, pm_generator, pm_site_facility, etc.

export default pmInsertRouter;