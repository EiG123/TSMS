import { Hono } from "hono";
import { rectifierSchema } from "../validation/rectifier.schema.js";

const pmRectifierRouter = new Hono();

// POST /api/pm/rectifier
pmRectifierRouter.post("/rectifier", async (c) => {
  const body = await c.req.json();

  const parsed = rectifierSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      {
        message: "Validation error",
        errors: parsed.error.format()
      },
      400
    );
  }

  return c.json({
    success: true,
    data: parsed.data
  });
});

export default pmRectifierRouter;
