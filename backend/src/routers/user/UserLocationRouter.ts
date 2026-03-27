import { Hono } from "hono";
import {UserLocationService} from "../../services/user/UserLocationService.service.js";
import pool from "../../services/db.js";
import bcrypt from "bcryptjs";


const UserLocationRouter = new Hono();

UserLocationRouter.post("/location", async (c) => {
    const body = await c.req.json();
    console.log(body);
    try {
        const res = await UserLocationService.location(body, pool);
        return c.json({
            data: res.result,
            success: true
        })

    } catch (error) {
        return c.json({
            success: false
        })
    } finally {

    }
});

UserLocationRouter.get("/location", async (c) => {
    try {
        const res = await UserLocationService.getLocation(pool);
        return c.json({
            data: res.result,
            success: true
        })

    } catch (error) {
        return c.json({
            success: false
        })
    } finally {

    }
});


export default UserLocationRouter;
