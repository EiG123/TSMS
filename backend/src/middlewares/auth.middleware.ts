import type { Context, Next } from 'hono';
import { AuthService } from "../services/auth/auth.service.js"; 

export const authMiddleware = async (
  c: Context,
  next: Next
) => {

  try {

    const authHeader = c.req.header("Authorization");

    console.log(authHeader);
    if (!authHeader) {
      return c.json(
        {
          success: false,
          message: "No token provided",
        },
        401
      );
    }

    // Bearer xxxxx
    const token = authHeader.split(" ")[1];

    if (!token) {
      return c.json(
        {
          success: false,
          message: "Invalid token format",
        },
        401
      );
    }

    const decoded: any = AuthService.verifyToken(token);

    if (!decoded) {
      return c.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        401
      );
    }

    // inject user เข้า context
    c.set("user", {
      id: decoded.sub,
      email: decoded.email,
      username: decoded.username,
      role: decoded.role,
      permissions: decoded.permissions || [],
    });

    await next();

  } catch (error) {
    console.error("Auth middleware error:", error);

    return c.json(
      {
        success: false,
        message: "Unauthorized",
      },
      401
    );
  }
};