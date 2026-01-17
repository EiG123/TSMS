export const AuthService = {
  async validateLogin(email: string, pass: string, db: any) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    const user = result.rows[0];

    if (!user) {
      return { success: false, message: 'ไม่พบผู้ใช้งานนี้' };
    }

    if (user.password === pass) {
      const { password, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    }

    return { success: false, message: 'รหัสผ่านไม่ถูกต้อง' };
  }
};