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
        const res = await DevManageService.savePermissions(body, pool);
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


DevManageRouter.get("/getAllUser", async (c) => {
    try {
        const res = await DevManageService.getAllUser(pool);
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


DevManageRouter.post("/deleteUserById", async (c) => {
    const body = await c.req.json();
    try {
        const res = await DevManageService.deleteUserById(body, pool);
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

DevManageRouter.post("/getUserById", async (c) => {
    const body = await c.req.json();
    try {
        const res = await DevManageService.getUserById(body, pool);
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


DevManageRouter.post("/userEdit", async (c) => {
    const body = await c.req.json();
    try {
        const res = await DevManageService.userEdit(body, pool);
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


DevManageRouter.post("/deleteRole", async (c) => {
    const body = await c.req.json();
    console.log(body);
    try {
        if (body.roleName === `dev`) {
            return c.json({
                success: false,
                message: `ไม่สามารถลบ Role ที่เป็น dev ได้`,
            });
        }
        const res = await DevManageService.deleteRole(body, pool);
        console.log(res.message);
        return c.json({
            message: res.message,
            success: true
        })

    } catch (error) {
        return c.json({
            success: false,
            message: error
        })
    } finally {

    }
});


DevManageRouter.post("/AddRole", async (c) => {
    const body = await c.req.json();
    console.log(body);
    try {
        if (body.roleName.toLowerCase() === `dev` || body.roleName.toLowerCase() === 'Dev' || body.roleName.toLowerCase() === "DEV") {
            return c.json({
                success: false,
                message: `ไม่สามารถเพิ่ม Role ที่เป็น dev ได้`,
            });
        }
        const res = await DevManageService.AddRole(body, pool);
        return c.json({
            message: res.message,
            success: true
        })

    } catch (error) {
        return c.json({
            success: false,
            message: error
        })
    } finally {

    }
});

export default DevManageRouter;
