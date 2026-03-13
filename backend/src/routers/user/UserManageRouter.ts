import { Hono } from "hono";
import { UserManageService } from "../../services/user/UserManageSerive.service.js";
import pool from "../../services/db.js";
import bcrypt from "bcryptjs";


const UserManageRouter = new Hono();

UserManageRouter.post("/getProfileData", async (c) => {
    const body = await c.req.json();
    try {
        const res = await UserManageService.getProfileData(body, pool);
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

UserManageRouter.post("/updateProfile", async (c) => {
    const body = await c.req.json();
    const hashPassword = await bcrypt.hash(body.password, 12);
    body.password = hashPassword;
    try {
        const res = await UserManageService.updateProfile(body, pool);
        return c.json({
            success: true
        })

    } catch (error) {
        return c.json({
            success: false
        })
    } finally {

    }
});

export default UserManageRouter;
