import { Context, Next } from 'hono';
import { AuthService } from '../services/auth.service.js';

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