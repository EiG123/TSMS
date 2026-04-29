import * as XLSX from "xlsx";

export const NetworkAVAService = {
  async UploadSitesAVA(file: File, pool: any) {
    const arrayBuffer = await file.arrayBuffer(); // 👈 สำคัญ

    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const data = XLSX.utils.sheet_to_json(sheet, {
      defval: null,
    });

    return {
      total: data.length,
      preview: data.slice(0, 10),
    };
  }
};