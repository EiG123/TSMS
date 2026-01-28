import { z } from "zod";

/**
 * Schema นี้คือ "กฎความจริง"
 * frontend ผิดได้ แต่ backend ผิดไม่ได้
 */
export const rectifierSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  module_model: z.string().optional(),

  power_module: z.number().optional(),
  no_module: z.number().optional(),

  // required = true
  load_current: z.number(),

  voltage: z.number().optional(),
  current_limit: z.number().optional(),
  llvd_voltage: z.number().optional(),
  blvd_voltage: z.number().optional(),
  battery_low_voltage: z.number().optional(),
  fuse_battery_sizing: z.number().optional()
});

// 👉 ใช้ type นี้ต่อกับ service / db ได้
export type RectifierInput = z.infer<typeof rectifierSchema>;
