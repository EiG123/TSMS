import { Hono } from "hono";
import { PmService } from "../services/PmNodeB.service.js";
import { Pool } from "pg";
import pool from "../services/db.js";
import { success } from "zod";

const pmGetPmListRouter = new Hono();

pmGetPmListRouter.get("/pmGetPmList", async (c) => {
    try {
        const res = await PmService.getData(pool);
        return c.json({
            data: res.data,
            success: true
        })

    } catch (error) {
        return c.json({
            success: false
        })
    } finally {

    }
});

export default pmGetPmListRouter;