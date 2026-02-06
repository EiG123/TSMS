import { Hono } from "hono";
import { txt_to_excelService } from "../services/Txt_to_Excel.service.js";
import FormData from "form-data";

const txt_to_excelRouter = new Hono();

txt_to_excelRouter.post("/txt_to_excel_service", async (c) => {
  // 1️⃣ รับ FormData จาก frontend
  const formData = await c.req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return c.json({ success: false, message: "No file uploaded" }, 400);
  }

  // 2️⃣ แปลงเป็น FormData ของ Node เพื่อส่งต่อไป Python
  const forwardForm = new FormData();
  const buffer = Buffer.from(await file.arrayBuffer());

  forwardForm.append("file", buffer, file.name);

  // 3️⃣ เรียก Python service
  const pythonRes = await txt_to_excelService.txt_to_excel(forwardForm);

  // 4️⃣ ส่งไฟล์ Excel กลับ frontend
  c.header(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  c.header(
    "Content-Disposition",
    "attachment; filename=result.xlsx"
  );

  return c.body(Buffer.from(pythonRes.data));
});

export default txt_to_excelRouter;
