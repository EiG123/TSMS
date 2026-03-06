import { Hono } from "hono";
import { DevManageService } from "../../services/dev/DevManageService.service.js";
import pool from "../../services/db.js";


const DevManageRouter = new Hono();

DevManageRouter.get("/getAllRole", async (c) => {
    try {
        const res = await DevManageService.getAllRole(pool);
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



DevManageRouter.get("/getAllPermission", async (c) => {
    try {
        const res = await DevManageService.getAllPermission(pool);
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


DevManageRouter.get("/getAllRoleWithPermission", async (c) => {
    try {
        const res = await DevManageService.getAllRoleWithPermission(pool);
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


DevManageRouter.post("/savePermissions", async (c) => {
    const body = await c.req.json();
    try {
        const res = await DevManageService.savePermissions(body,pool);
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

export default DevManageRouter;
