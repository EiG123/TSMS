import { serve } from '@hono/node-server'
import { Hono } from 'hono';
import { cors } from 'hono/cors'
import { AuthService } from './services/auth.service.js';
import { Client } from 'pg'; 

const app = new Hono();

// ใส่ไว้บนสุดก่อน Route อื่นๆ
app.use('/api/*', cors({
  origin: 'http://localhost:5173', // URL ของฝั่ง Vue
  allowMethods: ['POST', 'GET', 'OPTIONS'],
}))

// ตั้งค่าเชื่อมต่อ DB
const db = new Client({
  user: 'postgres',           
  host: 'localhost',
  database: 'tsms_db', 
  password: '1234',
  port: 5432,
});
db.connect();

app.post('/api/login', async (c) => {
  const body = await c.req.json();
  console.log("ข้อมูลที่ส่งมา:", body); // ดูใน Terminal ว่าค่ามาไหม
  const { email, password } = body;

  const result = await AuthService.validateLogin(email, password, db);

  if (result.success) {
    return c.json(result);
  } else {
    return c.json(result, 401);
  }
});

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

export default app;