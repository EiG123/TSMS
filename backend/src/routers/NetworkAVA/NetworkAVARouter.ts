import { Hono } from "hono";
import pool from "../../services/db.js";
import { NetworkAVAService } from "../../services/NetworkAVA/NetworkAVAService.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { logService } from "../../services/LOG/log.service.js";


const NetworkAVARouter = new Hono();

// 👇 ใช้ middleware ของ multer
NetworkAVARouter.post("/UploadSitesAVA", authMiddleware, async (c) => {
  try {
    const body = await c.req.parseBody(); // 👈 สำคัญ

    //LOG CHECK
    console.log(body);

    const file = body["file"]; // 👈 key ต้องตรงกับ frontend

    if (!file || !(file instanceof File)) {
      return c.json({
        success: false,
        message: "No file uploaded",
      }, 400);
    }

    console.log("File received:", file.name, file.size);

    const res = await NetworkAVAService.UploadSitesAVA(file, pool);

    const authUser = c.get('user');

    // 2️⃣ สำเร็จแล้วค่อย log
    await logService.createAuditLog({
      user_id: authUser.id,
      username: authUser.username,
      email: authUser.email,

      action: "UploadSitesAVA",

      method: "NetworkAVA",

      detail: file.name,

      success: res.success,
    });

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


// 👇 ใช้ middleware ของ multer
NetworkAVARouter.post("/UploadIncidentTT", authMiddleware, async (c) => {
  try {
    const body = await c.req.parseBody();

    const authUser = c.get('user');

    console.log("AUTH USER:", authUser);
    //LOG CHECK
    console.log(body);

    const file = body["file"]; // 👈 key ต้องตรงกับ frontend

    if (!file || !(file instanceof File)) {
      return c.json({
        success: false,
        message: "No file uploaded",
      }, 400);
    }

    console.log("File received:", file.name, file.size);

    const res = await NetworkAVAService.UploadIncidentTT(file, pool);

    // 2️⃣ สำเร็จแล้วค่อย log
    await logService.createAuditLog({
      user_id: authUser.id,
      username: authUser.username,
      email: authUser.email,

      action: "UPLOAD_INCIDENT_TT",

      method: "NetworkAVA",

      detail: file.name,

      success: res.success,
    });

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

NetworkAVARouter.post("/AVAChart", async (c) => {
  try {
    const body = await c.req.json(); // 👈 สำคัญ

    const res = await NetworkAVAService.AVAChart(body, pool);

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

NetworkAVARouter.post("/AVAChartALL", async (c) => {
  try {
    const body = await c.req.json(); // 👈 สำคัญ
    const res = await NetworkAVAService.AVAChartALL(body, pool);

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

NetworkAVARouter.post("/AVAChartALL_graph", async (c) => {
  try {
    const body = await c.req.json(); // 👈 สำคัญ
    const res = await NetworkAVAService.AVAChartALL_graph(body, pool);

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

NetworkAVARouter.post("/AVAChartALL_incident", async (c) => {
  try {
    const body = await c.req.json(); // 👈 สำคัญ
    const res = await NetworkAVAService.AVAChartALL_incident(body, pool);

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

export default NetworkAVARouter;