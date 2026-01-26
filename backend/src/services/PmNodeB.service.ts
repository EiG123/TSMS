import { Pool, QueryResult } from 'pg';
import { cleanInput, uploadImage } from '../utils/utils';

interface PmNodeBData {
  site_id: string;
  node_type: string;
  round: string;
  cabinet_total: string;
  region: string;
  pm_date: string;
  status: string;
  planwork: string;
  created_by: string;
  remark: string;
  img_photo_preview?: string;
}

interface FormData {
  site_id: string;
  node_type: string;
  round: string;
  cabinet_total: string;
  region: string;
  datetime: string;
  status: string;
  planwork: string;
  created_by: string;
  remark: string;
}

interface UploadedFile {
  name: string;
  data: Buffer;
  mimetype: string;
  size: number;
}

class PmNodeBService {
  
  async create(pool: Pool, formData: FormData, file?: UploadedFile): Promise<number> {
    return this.process(pool, formData, file, null, 'insert');
  }

  async update(pool: Pool, formData: FormData, file: UploadedFile | undefined, pmId: number): Promise<number> {
    return this.process(pool, formData, file, pmId, 'update');
  }

  private async process(
    pool: Pool,
    formData: FormData,
    file: UploadedFile | undefined,
    pmId: number | null,
    mode: 'insert' | 'update'
  ): Promise<number> {
    
    // รับค่าจาก form และทำ clean input
    const siteId = cleanInput(formData.site_id);
    const nodeType = cleanInput(formData.node_type);
    const round = cleanInput(formData.round);
    const cabinetTotal = cleanInput(formData.cabinet_total);
    const region = cleanInput(formData.region);
    const datetime = cleanInput(formData.datetime);
    const status = cleanInput(formData.status);
    const planwork = cleanInput(formData.planwork);
    const createdBy = cleanInput(formData.created_by);
    const remark = cleanInput(formData.remark);

    let imgPhotoPreview: string | undefined;

    // Upload รูป preview
    if (file && file.name) {
      imgPhotoPreview = await uploadImage(file, siteId, 'preview', 'photo_preview');
    } else if (mode === 'update' && pmId) {
      // ดึงรูปเดิมมาใช้
      const result = await pool.query(
        'SELECT img_photo_preview FROM pm_nodeb WHERE id = $1',
        [pmId]
      );
      imgPhotoPreview = result.rows[0]?.img_photo_preview;
    }

    if (mode === 'insert') {
      // Insert - PostgreSQL ใช้ RETURNING เพื่อดึง id ที่สร้างใหม่
      const sql = `
        INSERT INTO pm_nodeb 
        (site_id, node_type, round, cabinet_total, region, pm_date, status, planwork, created_by, remark, img_photo_preview) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
      `;

      const result = await pool.query(sql, [
        siteId,
        nodeType,
        round,
        cabinetTotal,
        region,
        datetime,
        status,
        planwork,
        createdBy,
        remark,
        imgPhotoPreview
      ]);

      return result.rows[0].id;

    } else if (mode === 'update') {
      const sql = `
        UPDATE pm_nodeb SET
          site_id = $1, 
          node_type = $2, 
          round = $3, 
          cabinet_total = $4, 
          region = $5, 
          pm_date = $6, 
          status = $7, 
          planwork = $8, 
          created_by = $9, 
          remark = $10, 
          img_photo_preview = $11
        WHERE id = $12
      `;

      const result = await pool.query(sql, [
        siteId,
        nodeType,
        round,
        cabinetTotal,
        region,
        datetime,
        status,
        planwork,
        createdBy,
        remark,
        imgPhotoPreview,
        pmId
      ]);

      if (result.rowCount === 0) {
        throw new Error(`Error update PM NodeB: No rows affected for id ${pmId}`);
      }

      return pmId!;
    }

    throw new Error('Invalid mode');
  }
}

export default PmNodeBService;