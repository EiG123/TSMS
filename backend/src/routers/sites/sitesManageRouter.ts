import { Hono } from "hono";
import pool from "../../services/db.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { logService } from "../../services/LOG/log.service.js";
import { sitesManageService } from "../../services/sites/sitesManageService.service.js";


const sitesManageRouter = new Hono();

// 👇 ใช้ middleware ของ multer
sitesManageRouter.get("/getAllSite", async (c) => {
  try {

    const res = await sitesManageService.getAllSite(pool);

    return c.json({
      data: res,
      success: true,
    });

  } catch (error: any) {
    console.error("Upload error:", error);

    return c.json({
      success: false,
      message: error.message,
    }, 500);
  }
});

export default sitesManageRouter;