import { Hono } from "hono";
import { pmTitleService } from "../services/PmTitle.service.js";
import pool from "../services/db.js";

const pmTitleRouter = new Hono();

pmTitleRouter.post("/AddPmTitle", async (c) => {
    try {
        const body = await c.req.json();
        const {
            pm_name,
            pm_description,
            pm_key,
            pm_type,
            pm_status,
            pm_rank
        } = body;

        const result = await pmTitleService.InsertTitle(
            pm_name,
            pm_description,
            pm_key,
            pm_type,
            pm_status,
            pm_rank,
            pool
        );

        if (result.success) {
            // ⭐ ต้อง return pm_id กลับไปด้วย
            return c.json({
                success: true,
                message: "บันทึกข้อมูล PM Title สำเร็จ",
            });
        } else {
            return c.json(result, 401);
        }

    } catch (error) {
        console.error('PM Title error Router:', error);
        return c.json({
            success: false,
            message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        }, 500);
    }
});

pmTitleRouter.get("/getAllPmTitle", async (c) => {
    const data = await pmTitleService.getAllPmTitle(pool);
    if (data.success) {
        return c.json({
            data: data,
            success: true
        });
    } else {
        return c.json({
            success: false
        });
    }
});

pmTitleRouter.post("/getPmTitleById", async (c) => {
    const body = await c.req.json();
    const { id } = body;
    const data = await pmTitleService.getPmTitleById(pool, id);
    if (data.success) {
        return c.json({
            data: data,
            success: true
        });
    } else {
        return c.json({
            success: false
        });
    }
});

pmTitleRouter.post("/getAllPmTitleChild", async (c) => {
    const body = await c.req.json();
    const { id } = body;
    const data = await pmTitleService.getAllPmTitleChild(pool, id);
    if (data.success) {
        return c.json({
            data: data,
            success: true
        });
    } else {
        return c.json({
            success: false
        });
    }
});

pmTitleRouter.post("/AddPmTitleChild", async (c) => {
    const body = await c.req.json();
    const data = await pmTitleService.InsertTitleChild(
        body,
        pool
    );
    if (data.success) {
        return c.json({
            data: data,
            success: true
        });
    } else {
        return c.json({
            success: false
        });
    }
});

export default pmTitleRouter;
