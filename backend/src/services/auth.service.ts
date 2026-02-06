import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "DEV_SECRET_PLEASE_CHANGE_IN_PRODUCTION";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "3h";

// ตรวจสอบว่ามี JWT_SECRET ใน production
if (JWT_SECRET === "DEV_SECRET_PLEASE_CHANGE_IN_PRODUCTION") {
  console.warn("⚠️  WARNING: Using default JWT_SECRET. Please set JWT_SECRET in .env file for production!");
}

export const AuthService = {
  /**
   * ตรวจสอบการเข้าสระบบ
   */
  async validateLogin(email: string, pass: string, db: any) {
    try {
      // Validate input
      if (!email || !pass) {
        return {
          success: false,
          message: "กรุณากรอกอีเมลและรหัสผ่าน"
        };
      }

      // Query user by email
      const query = "SELECT * FROM users WHERE email = $1";
      const result = await db.query(query, [email]);
      const user = result.rows[0];

      // ตรวจสอบว่าพบผู้ใช้หรือไม่
      if (!user) {
        return {
          success: false,
          message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" // ไม่บอกว่าอีเมลไม่มี เพื่อความปลอดภัย
        };
      }

      // เปรียบเทียบรหัสผ่านที่เข้ารหัสด้วย bcrypt
      const isPasswordValid = await bcrypt.compare(pass, user.password);

      if (!isPasswordValid) {
        return {
          success: false,
          message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
        };
      }

      // ลบข้อมูลที่ไม่ควรส่งออกไป
      const { password, ...userWithoutPassword } = user;

      // สร้าง JWT token
      const token = jwt.sign(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES_IN,
        }
      );

      return {
        success: true,
        token,
        user: userWithoutPassword,
      };

    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ"
      };
    }
  },

  /**
   * สร้าง hash password สำหรับ user ใหม่
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  },

  /**
   * ตรวจสอบ JWT token
   */
  verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET, {
      });
    } catch (error) {
      return null;
    }
  },
};