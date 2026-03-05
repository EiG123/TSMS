import { Hono } from "hono";
import { AdminManageService } from "../../services/admin/AdminManageService.service.js";
import pool from "../../services/db.js";


const AdminManageRouter = new Hono();

AdminManageRouter.get("/getAllUser", async (c) => {
    try {
        const res = await AdminManageService.getAllUser(pool);
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

AdminManageRouter.post("/getUserById", async (c) => {
    const body = await c.req.json();
    try {
        const res = await AdminManageService.getUserById(body, pool);
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


AdminManageRouter.post("/userEdit", async (c) => {
    const body = await c.req.json();
    try {
        const res = await AdminManageService.userEdit(body, pool);
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


AdminManageRouter.get("/getAllRole", async (c) => {
    try {
        const res = await AdminManageService.getAllRole(pool);
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

export default AdminManageRouter;
