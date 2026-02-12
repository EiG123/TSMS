import { Hono } from "hono";
import { pmServiceManage } from "../services/pmServiceManage.service.js";
import pool from "../services/db.js";
import { success } from "zod";


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

pmRouterManage.post("/getPmDataById", async (c) => {
    const body = await c.req.json();
    try {
        const res = await pmServiceManage.getPmDataById(body.id, pool);
        return c.json({
            success: true,
            data: res
        })
    } catch (err) {
        return c.json({
            success: false
        })
    }
});

pmRouterManage.get("/pmGetPmList", async (c) => {
    try {
        const res = await pmServiceManage.getData(pool);
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

export default pmRouterManage;
