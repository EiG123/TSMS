// middleware/validation.middleware.ts
import type { Context } from "hono";
import type { Next } from "hono";
import { z } from 'zod';
import type { ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema) => {
    return async (c: Context, next: Next) => {
        try {
            const body = await c.req.json();
            const validationResult = schema.safeParse(body);

            if (!validationResult.success) {
                return c.json({
                    success: false,
                    message: "ข้อมูลไม่ถูกต้อง",
                    errors: validationResult.error.format()
                }, 400);
            }

            // ⭐ เก็บ validated data ไว้ใน context
            c.set('validatedData', validationResult.data);

            await next();
        } catch (error) {
            return c.json({
                success: false,
                message: "Invalid JSON format"
            }, 400);
        }
    };
};