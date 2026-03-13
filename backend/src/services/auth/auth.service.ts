import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "DEV_SECRET_PLEASE_CHANGE_IN_PRODUCTION";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "3h";

// ตรวจสอบว่ามี JWT_SECRET ใน production
if (JWT_SECRET === "DEV_SECRET_PLEASE_CHANGE_IN_PRODUCTION") {
  console.warn("⚠️  WARNING: Using default JWT_SECRET. Please set JWT_SECRET in .env file for production!");
}

async function getUserPermissions(userId: number, db: any): Promise<string[]> {
  const query = `
    SELECT DISTINCT p.name
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    JOIN role_permissions rp ON rp.role_id = r.id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = $1
  `;

  const result = await db.query(query, [userId]);
  console.log(result.rows);
  return result.rows.map((row: any) => row.name);
}

export const AuthService = {
  /**
   * ตรวจสอบการเข้าสระบบ
   */
  async validateLogin(email: string, pass: string, db: any) {
    // console.log(await bcrypt.hash('devdevdev123', 10));
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
      if (user.status !== 'active') {
        return {
          success: false,
          message: "บัญชีของคุณยังไม่ได้รับการอนุมัติจากผู้ดูแลระบบ"
        };
      }

      // ลบข้อมูลที่ไม่ควรส่งออกไป
      const { password, ...userWithoutPassword } = user;

      // 🔥 ดึง permissions จาก DB
      const permissions = await getUserPermissions(user.id, db);

      // สร้าง JWT token
      const token = jwt.sign(
        {
          sub: user.id,
          email: user.email,
          permissions, // ใส่ permission ลง token
        },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES_IN,
        }
      );

      return {
        success: true,
        token,
        user: {
          ...userWithoutPassword,
          permissions, // ส่งให้ frontend ด้วย
        },
      };

    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ"
      };
    }
  },

  async validateRegister(data: any, db: any) {
    const client = await db.connect();

    try {
      const {
        email,
        password,
        confirmPassword,
        username,
        phone,
        region,
        company
      } = data;

      // 1️⃣ Validate input
      if (!email || !password || !confirmPassword || !username) {
        return {
          success: false,
          message: "ข้อมูลไม่ครบถ้วน"
        };
      }

      if (password !== confirmPassword) {
        return {
          success: false,
          message: "รหัสผ่านไม่ตรงกัน"
        };
      }

      // 2️⃣ Check email duplicate
      const existing = await client.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );

      if (existing.rowCount > 0) {
        return {
          success: false,
          message: "อีเมลนี้ถูกใช้งานแล้ว"
        };
      }

      await client.query("BEGIN");

      // 3️⃣ Hash password
      const hashedPassword = await this.hashPassword(password);

      // 4️⃣ Insert user (status = pending)
      const insertUserSql = `
      INSERT INTO users (
        email,
        password,
        username,
        phone,
        region,
        company,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,'pending')
      RETURNING id
    `;

      const userRes = await client.query(insertUserSql, [
        email,
        hashedPassword,
        username,
        phone,
        region,
        company
      ]);

      const userId = userRes.rows[0].id;

      // 5️⃣ Assign role (optional: assign now or wait approve)
      await client.query(
        `
      INSERT INTO user_roles (user_id, role_id)
      SELECT $1, id
      FROM roles
      WHERE name = 'user'
      `,
        [userId]
      );

      await client.query("COMMIT");

      return {
        success: true,
        message: "สมัครสมาชิกสำเร็จ กรุณารอผู้ดูแลระบบอนุมัติ"
      };

    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Register error:", error);

      return {
        success: false,
        message: "เกิดข้อผิดพลาดในการสมัครสมาชิก"
      };
    } finally {
      client.release();
    }
  },

  /**
   * สร้าง hash password สำหรับ user ใหม่
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
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