import { Hono } from "hono";
import { rectifierFieldConfig } from "../config/rectifier.config.js";

const pmConfigRouter = new Hono();

// GET /api/config/rectifier
pmConfigRouter.get("/rectifier", (c) => {
  return c.json({
    module: "rectifier",
    fields: rectifierFieldConfig
  });
});

export default pmConfigRouter;
