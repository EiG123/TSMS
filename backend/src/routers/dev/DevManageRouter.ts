import { Hono } from "hono";
import { DevManageService } from "../../services/dev/DevManageService.service.js";
import { logService } from "../../services/LOG/log.service.js";
import pool from "../../services/db.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";


const DevManageRouter = new Hono();

DevManageRouter.post("/getLogs", async (c) => {
    const body = await c.req.json();
    try {
        const res = await logService.getLogs(body, pool);
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


DevManageRouter.post("/savePermissions", authMiddleware, async (c) => {
    const body = await c.req.json();
    try {
        const authUser = c.get('user');
        const res = await DevManageService.savePermissions(body, pool);

        await logService.createAuditLog({
            user_id: authUser.id,
            username: authUser.username,
            email: authUser.email,

            action: "UPDATE PERMISSIONS",

            detail: `UPDATE PERMISSIONS ID ${body.id}`,
            method: "UPDATE",

            success: res.success,
        });
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


DevManageRouter.post("/deleteUserById", authMiddleware, async (c) => {
    const body = await c.req.json();
    try {
        const authUser = c.get('user');

        const res = await DevManageService.deleteUserById(body, pool);
        await logService.createAuditLog({
            user_id: authUser.id,
            username: authUser.username,
            email: authUser.email,

            action: "DELETE USER",

            detail: `DELETE USER ID ${body.id}`,

            method: "DELETE",

            success: res.success,
        });
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


DevManageRouter.post("/userEdit", authMiddleware, async (c) => {
    const body = await c.req.json();
    console.log(body);
    try {
        const authUser = c.get('user');

        const old_data = await DevManageService.getUserById(body.id, pool);

        console.log(old_data);

        const new_data = await DevManageService.getUserById(body.id, pool);

        const res = await DevManageService.userEdit(body, pool);


        await logService.createAuditLog({
            user_id: authUser.id,
            username: authUser.username,
            email: authUser.email,

            action: "EDIT USER",

            detail: `EDIT USER ID ${body.id}`,

            old_data: JSON.stringify(old_data),
            new_data: JSON.stringify(new_data),

            method: "EDIT",

            success: res.success,
        });
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

DevManageRouter.post("/addPermission", async (c) => {
    const body = await c.req.json();
    console.log(body);
    try {
        if (body.permissionName === `*`) {
            return c.json({
                success: false,
                message: `ไม่สามารถเพิ่ม Permission นี้ได้`,
            });
        }
        const res = await DevManageService.addPermission(body, pool);
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

DevManageRouter.post("/updatePermission", async (c) => {
    const body = await c.req.json();
    console.log(body);
    try {
        if (body.permissionName === `*` || body.permissionId === 1) {
            return c.json({
                success: false,
                message: `ไม่สามารถแก้ไข Permission นี้ได้`,
            });
        }
        const res = await DevManageService.updatePermission(body, pool);
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


DevManageRouter.post("/deletePermission", async (c) => {
    const body = await c.req.json();
    try {
        if (body === 1) {
            return c.json({
                success: false,
                message: `ไม่สามารถลบ Permission นี้ได้`,
            });
        }
        const res = await DevManageService.deletePermission(body, pool);
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
