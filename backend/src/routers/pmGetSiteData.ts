import { Hono } from "hono";
import { PmGetDataSite } from "../services/PmGetDataSite.js";

const pmSiteDateRouter = new Hono();

pmSiteDateRouter.post("/getPmSiteData", async (c) => {
  try {
    const body = await c.req.json();
    const {
      pmId
    } = body;
    const result = await PmGetDataSite.pmData(pmId);
    return c.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("getPmSiteData error:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch PM site list",
      },
      500
    );
  }
});

export default pmSiteDateRouter;
