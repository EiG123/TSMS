import { Hono } from "hono";
import { AdminManageService } from "../../services/admin/AdminManageService.service.js";
import pool from "../../services/db.js";
import { logService } from "../../services/LOG/log.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";


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


AdminManageRouter.post("/userEdit", authMiddleware, async (c) => {
    const body = await c.req.json();
    try {
        const oldUser = await AdminManageService.getUserById(body.id, pool);

        const res = await AdminManageService.userEdit(body, pool);

        const newUser = await AdminManageService.getUserById(body.id, pool);

        const authUser = c.get('user');

        console.log(body);

        // 2️⃣ สำเร็จแล้วค่อย log
        await logService.createAuditLog({
            user_id: authUser.id,
            username: authUser.username,
            email: authUser.email,

            action: "userEdit",

            method: "PUT",

            detail:
                `Edited user ${body.id}`,
            
            old_data: JSON.stringify(oldUser),

            new_data: JSON.stringify(newUser),

            success: true,
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


AdminManageRouter.post("/deleteUserById", authMiddleware, async (c) => {
    const body = await c.req.json();
    try {
        const res = await AdminManageService.deleteUserById(body, pool);
        const authUser = c.get('user');

        console.log(body);

        // 2️⃣ สำเร็จแล้วค่อย log
        await logService.createAuditLog({
            user_id: authUser.id,
            username: authUser.username,
            email: authUser.email,

            action: "userDelete",

            method: "Delete",

            detail: "Delete User id: " + body,

            success: true,
        });
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


export default AdminManageRouter;
