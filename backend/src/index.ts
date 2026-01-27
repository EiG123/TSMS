import { serve } from '@hono/node-server'
import { Hono } from 'hono';
import { cors } from 'hono/cors'
import { AuthService } from './services/auth.service.js';
import { PmService } from './services/PmNodeB.service.js';
import { Pool } from 'pg';

const app = new Hono();

// ใส่ไว้บนสุดก่อน Route อื่นๆ
app.use('/api/*', cors({
  origin: 'http://localhost:5173', // URL ของฝั่ง Vue
  allowMethods: ['POST', 'GET', 'OPTIONS'],
}))

// ตั้งค่าเชื่อมต่อ DB
const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tsms_db',
  password: '1234',
  port: 5432,
});


app.post('/api/login', async (c) => {
  const body = await c.req.json();
  const { email, password } = body;

  const result = await AuthService.validateLogin(email, password, db);

  if (result.success) {
    return c.json(result);
  } else {
    return c.json(result, 401);
  }
});

app.post('/api/pm_nodeb', async (c) => {
  const body = await c.req.json();
  const {site_id, node_type, round, cabinet_total, region, datetime, status, planwork, create_by, remark} = body;

  const cabinetTotal = Number(cabinet_total);

  const result = await PmService.InsertPM(site_id, node_type, round, cabinetTotal, region, datetime, status, planwork, create_by, remark, db);

  if(result.success) {
    return c.json(result);
  }else{
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