import { Hono } from "hono";
import { PmServiceList } from "../services/PmNodeBList.service.js";

const pmSiteListRouter = new Hono();

pmSiteListRouter.get("/pmSiteList", async (c) => {
  try {
    const result = await PmServiceList.pmList();
    return c.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("pmSiteList error:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch PM site list",
      },
      500
    );
  }
});

export default pmSiteListRouter;
