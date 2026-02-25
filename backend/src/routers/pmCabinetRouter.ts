import { Hono } from "hono";
import {pmCabinetService} from "../services/pmCabinetService.js";
import pool from "../services/db.js";


const pmCabinetRouter = new Hono();

pmCabinetRouter.post("/AddCabinet", async (c) => {
    const body = await c.req.json();
    console.log(body.data);
    try {
        const result = await pmCabinetService.AddCabinet(body.data, pool);
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

export default pmCabinetRouter;
