import { Hono } from "hono";
import { pmCheckInOutService } from "../services/pmCheckInOutService.service.js";
import pool from "../services/db.js";


const pmCheckInOutManage = new Hono();

pmCheckInOutManage.post("/checkIn", async (c) => {
    const body = await c.req.json();
    try {
        const result = await pmCheckInOutService.checkIn(body.pmId, body.userId, pool);
        console.log(result);
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

pmCheckInOutManage.post("/checkOut", async (c) => {
    const body = await c.req.json();
    try {
        const result = await pmCheckInOutService.checkOut(body.pmId, body.userId, pool);
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


pmCheckInOutManage.post("/updateProgressStatus", async (c) => {
    const body = await c.req.json();
    try {
        const result = await pmCheckInOutService.updateProgressStatus(body.data , pool);
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

export default pmCheckInOutManage;
