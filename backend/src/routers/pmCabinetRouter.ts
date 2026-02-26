import { Hono } from "hono";
import { pmCabinetService } from "../services/pmCabinetService.js";
import pool from "../services/db.js";


const pmCabinetRouter = new Hono();

pmCabinetRouter.post("/getPmCabinetById", async (c) => {
    const body = await c.req.json();
    try {
        const res = await pmCabinetService.getPmCabinetById(body, pool);
        return c.json({
            data: res,
            success: true
        })

    } catch (error) {
        return c.json({
            success: false
        })
    } finally {

    }
});

pmCabinetRouter.post("/AddCabinet", async (c) => {
    const body = await c.req.json();
    try {
        const result = await pmCabinetService.AddCabinet(body.data, pool);
        return c.json({
            success: true,
            data: result,
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message: "Failed to fetch PM site list",
            },
            500
        );
    }
});

pmCabinetRouter.delete("/deleteCabinet", async (c) => {
    const body = await c.req.json();
    try {
        const result = await pmCabinetService.deleteCabinet(body.cabinet_id, pool);
        return c.json({
            success: true,
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message: "Failed to fetch PM site list",
            },
            500
        );
    }
});

export default pmCabinetRouter;
