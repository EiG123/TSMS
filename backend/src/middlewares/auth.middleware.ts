import { Context, Next } from 'hono';
import { AuthService } from '../services/auth/auth.service.js';
interface JwtPayload {
  sub: number;
  email: string;
  permissions: string[];
  exp: number;
}
export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        success: false,
        message: 'ไม่พบ token'
      }, 401);
    }

    const token = authHeader.substring(7);
    const decoded = AuthService.verifyToken(token);

    if (!decoded) {
      return c.json({
        success: false,
        message: 'Token ไม่ถูกต้อง'
      }, 401);
    }

    // เก็บข้อมูล user ไว้ใน context
    c.set('user', decoded);


    await next();
  } catch (error) {
    return c.json({
      success: false,
      message: 'การยืนยันตัวตนล้มเหลว'
    }, 401);
  }
};

export const authorize = (requiredPermission: string) => {
  return async (c: Context, next: Next) => {

    const user = c.get('user');

    if (!user || !user.permissions) {
      return c.json({
        success: false,
        message: 'ไม่ได้รับสิทธิ์'
      }, 403);
    }

    if (!user.permissions.includes(requiredPermission)) {
      return c.json({
        success: false,
        message: 'Forbidden'
      }, 403);
    }

    await next();
  };
};