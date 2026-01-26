import { Pool, QueryResult } from 'pg';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface UploadedFile {
  name: string;
  data: Buffer;
  mimetype: string;
  size: number;
  tempFilePath?: string;
}

interface UploadedFileInfo {
  path: string;
  file_name: string;
  category: string;
  field_name: string;
  sub_id: number | null;
}

interface ImageRecord {
  id: number;
  pm_id: number;
  category: string;
  field_name: string;
  sub_id: number | null;
  file_path: string;
  created_at?: string;
}

/**
 * Upload รูปภาพและคืนค่า path
 */
export async function uploadImage(
  file: UploadedFile,
  siteId: string,
  section: string,
  fieldName: string
): Promise<string | null> {
  
  if (!file.name || !file.data) {
    return null;
  }

  const uploadDir = path.join(__dirname, `../uploads/pm_nodeb/site_${siteId}/${section}/`);
  
  // สร้างโฟลเดอร์ถ้ายังไม่มี
  await fs.mkdir(uploadDir, { recursive: true, mode: 0o777 });

  const ext = path.extname(file.name);
  const newFilename = `${fieldName}_${uuidv4()}_${Date.now()}${ext}`;
  const filePath = path.join(uploadDir, newFilename);

  // ตรวจสอบ file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.mimetype)) {
    return null;
  }

  // ตรวจสอบขนาดไฟล์ (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return null;
  }

  try {
    // เขียนไฟล์
    await fs.writeFile(filePath, file.data);
    return filePath;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

/**
 * Upload รูปภาพหลายไฟล์
 */
export async function uploadMultipleImages(
  files: UploadedFile[],
  siteId: string,
  category: string,
  fieldName: string,
  subId: number | null = null
): Promise<UploadedFileInfo[]> {
  
  const targetDir = path.join(__dirname, `../uploads/${category}/`);
  
  // สร้างโฟลเดอร์ถ้ายังไม่มี
  await fs.mkdir(targetDir, { recursive: true, mode: 0o777 });

  const uploadedFiles: UploadedFileInfo[] = [];

  for (const file of files) {
    if (!file.name || !file.data) {
      continue;
    }

    try {
      const newName = `${Date.now()}_${uuidv4()}_${path.basename(file.name)}`;
      const filePath = path.join(targetDir, newName);

      await fs.writeFile(filePath, file.data);

      uploadedFiles.push({
        path: filePath,
        file_name: newName,
        category: category,
        field_name: fieldName,
        sub_id: subId
      });
    } catch (error) {
      console.error('Error uploading file:', file.name, error);
      continue;
    }
  }

  return uploadedFiles;
}

/**
 * บันทึกข้อมูลรูปภาพหลายไฟล์ลง database
 */
export async function saveMultipleImages(
  pool: Pool,
  pmId: number,
  category: string,
  fieldName: string,
  uploadedFiles: UploadedFileInfo[],
  subId: number | null = null
): Promise<void> {
  
  const sql = `
    INSERT INTO pm_images (pm_id, category, field_name, sub_id, file_path) 
    VALUES ($1, $2, $3, $4, $5)
  `;

  const client = await pool.connect();
  
  try {
    for (const file of uploadedFiles) {
      await client.query(sql, [
        pmId,
        category,
        fieldName,
        subId,
        file.path
      ]);
    }
  } finally {
    client.release();
  }
}

/**
 * ดึงข้อมูลรูปภาพจาก database
 */
export async function getImages(
  pool: Pool,
  pmId: number,
  category: string,
  field: string | null = null,
  subId: number | null = null
): Promise<ImageRecord[]> {
  
  let sql = 'SELECT * FROM pm_images WHERE pm_id = $1 AND category = $2';
  const params: (number | string | null)[] = [pmId, category];
  let paramCount = 2;

  if (field !== null) {
    paramCount++;
    sql += ` AND field_name = $${paramCount}`;
    params.push(field);
  }

  if (subId !== null) {
    paramCount++;
    sql += ` AND sub_id = $${paramCount}`;
    params.push(subId);
  }

  sql += ' ORDER BY id ASC';

  const result: QueryResult<ImageRecord> = await pool.query(sql, params);
  return result.rows;
}

/**
 * ลบรูปทั้งหมดของ pm_id + category + field_name
 * ใช้สำหรับหน้า edit ก่อน upload รูปใหม่
 */
export async function deleteImagesByField(
  pool: Pool,
  pmId: number,
  category: string,
  fieldName: string,
  subId: number | null = null
): Promise<void> {
  
  const client = await pool.connect();
  
  try {
    // 1. Select file paths
    let sql = `
      SELECT file_path FROM pm_images
      WHERE pm_id = $1
        AND category = $2
        AND field_name = $3
    `;
    
    const params: (number | string | null)[] = [pmId, category, fieldName];
    let paramCount = 3;

    if (subId !== null) {
      paramCount++;
      sql += ` AND sub_id = $${paramCount}`;
      params.push(subId);
    }

    const result = await client.query(sql, params);

    // 2. Delete physical files
    for (const row of result.rows) {
      if (row.file_path) {
        try {
          await fs.access(row.file_path); // ตรวจสอบว่าไฟล์มีอยู่
          await fs.unlink(row.file_path); // ลบไฟล์
        } catch (error) {
          console.error('Error deleting file:', row.file_path, error);
        }
      }
    }

    // 3. Delete database records
    let sqlDel = `
      DELETE FROM pm_images
      WHERE pm_id = $1
        AND category = $2
        AND field_name = $3
    `;

    const paramsDel: (number | string | null)[] = [pmId, category, fieldName];
    let paramDelCount = 3;

    if (subId !== null) {
      paramDelCount++;
      sqlDel += ` AND sub_id = $${paramDelCount}`;
      paramsDel.push(subId);
    }

    await client.query(sqlDel, paramsDel);
  } finally {
    client.release();
  }
}

/**
 * ทำความสะอาดข้อมูล Input
 */
export function cleanInput(data: any): any {
  if (Array.isArray(data)) {
    return data.map(item => cleanInput(item));
  }

  if (typeof data === 'string') {
    // trim, remove backslashes, escape HTML
    let cleaned = data.trim();
    cleaned = cleaned.replace(/\\/g, '');
    cleaned = cleaned
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    return cleaned;
  }

  return data;
}

/**
 * แปลงค่าว่างเป็น NULL
 */
export function emptyToNull(value: any): any {
  if (value === '' || value === undefined || value === null) {
    return null;
  }
  return value;
}