import dotenv from "dotenv";
dotenv.config();
console.log('🔍 Environment variables loaded:');
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

import { serve } from '@hono/node-server'
import { Hono } from 'hono';
import { cors } from 'hono/cors'
import { AuthService } from './services/auth.service.js';
import { PmService } from './services/PmNodeB.service.js';
import { Pool } from 'pg';
import pmConfigRouter from "./routers/PmConfig.js";

const app = new Hono();

// CORS middleware
app.use('/api/*', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.route("/api/config", pmConfigRouter);

// ตั้งค่าเชื่อมต่อ DB
const db = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'tsms_db',
  password: process.env.DB_PASSWORD || '1234',
  port: Number(process.env.DB_PORT) || 5432,
});

// ทดสอบการเชื่อมต่อ DB
db.connect()
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection error:', err));

// Login endpoint
app.post("/api/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return c.json({ 
        success: false, 
        message: "กรุณากรอกอีเมลและรหัสผ่าน" 
      }, 400);
    }

    const result = await AuthService.validateLogin(email, password, db);

    if (result.success) {
      return c.json(result);
    }
    return c.json(result, 401);

  } catch (error) {
    console.error('Login error:', error);
    return c.json({ 
      success: false, 
      message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" 
    }, 500);
  }
});


// PM NodeB endpoint
app.post('/api/pm_nodeb', async (c) => {
  try {
    const body = await c.req.json();
    const { 
      site_id, 
      node_type, 
      round, 
      cabinet_total, 
      region, 
      datetime, 
      status, 
      planwork, 
      create_by, 
      remark 
    } = body;

    // Validation
    if (!site_id || !node_type || !cabinet_total) {
      return c.json({ 
        success: false, 
        message: "กรุณากรอกข้อมูลที่จำเป็น" 
      }, 400);
    }

    const cabinetTotal = Number(cabinet_total);

    if (isNaN(cabinetTotal)) {
      return c.json({ 
        success: false, 
        message: "cabinet_total ต้องเป็นตัวเลข" 
      }, 400);
    }

    const result = await PmService.InsertPM(
      site_id, 
      node_type, 
      round, 
      cabinetTotal, 
      region, 
      datetime, 
      status, 
      planwork, 
      create_by, 
      remark, 
      db
    );

    if (result.success) {
      return c.json(result);
    } else {
      return c.json(result, 400);
    }

  } catch (error) {
    console.error('PM NodeB error:', error);
    return c.json({ 
      success: false, 
      message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" 
    }, 500);
  }
});

// Health check endpoint
app.get('/api/health', async (c) => {
  try {
    await db.query('SELECT 1');
    return c.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return c.json({ 
      status: 'error', 
      database: 'disconnected' 
    }, 503);
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({ 
    success: false, 
    message: 'ไม่พบ API endpoint นี้' 
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ 
    success: false, 
    message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' 
  }, 500);
});

const port = Number(process.env.PORT) || 3000;

console.log(`🚀 Server is running on port ${port}`);
console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);

serve({
  fetch: app.fetch,
  port
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing database connection...');
  await db.end();
  process.exit(0);
});

export default app;