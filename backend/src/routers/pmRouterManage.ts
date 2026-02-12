import { Hono } from "hono";
import { pmServiceManage } from "../services/pmServiceManage.service.js";
import pool from "../services/db.js";


const pmRouterManage = new Hono();

pmRouterManage.post("/deletePmById", async (c) => {
    const body = await c.req.json();
    try {
        const result = await pmServiceManage.deletPmById(body.id, pool);
        return c.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("pmSiteList error:", error);
        return c.json(
            {
                success: false,
                message: "Failed to fetch PM site list",
            },
            500
        );
    }
});

export default pmRouterManage;
