import pandas as pd
from tqdm import tqdm
import xlsxwriter
import os
import json
from typing import Optional

from progress_store import progress_status
output_files = []
def process_csv_to_filtered_excel(
    input_file: str,
    filter_column: str,
    filter_value: str,
    output_prefix: str = "filtered_output",
    chunk_size: int = 100000,
    excel_limit: int = 1048576,
    enable_verification: bool = False,
    task_id: str | None = None
):
    """
    อ่านไฟล์ CSV ขนาดใหญ่ กรองข้อมูลตามเงื่อนไข และบันทึกเป็น Excel หลายไฟล์
    
    Parameters:
    - input_file: ชื่อไฟล์ CSV ต้นฉบับ
    - filter_column: ชื่อคอลัมน์ที่ต้องการกรอง
    - filter_value: ค่าที่ต้องการกรอง
    - output_prefix: prefix ของไฟล์ผลลัพธ์
    - chunk_size: จำนวนแถวที่อ่านในแต่ละรอบ
    - excel_limit: จำนวนแถวสูงสุดต่อไฟล์ Excel
    - enable_verification: เปิดใช้การตรวจสอบความถูกต้อง
    """
    if task_id:
        progress_status[task_id] = {
            "status": "processing",
            "progress": 0,
            "message": "Starting..."
        }
    
    print(f"🚀 เริ่มประมวลผลไฟล์: {input_file}")
    print(f"📋 กรองคอลัมน์: {filter_column} = '{filter_value}'")
    
    # ตัวแปรสำหรับควบคุมการสร้างไฟล์
    part_count = 1
    total_filtered_rows = 0
    current_file_rows = 0
    workbook = None
    worksheet = None
    header_written = False
    
    # ตัวแปรสำหรับ verification
    verification_data = {
        "input_file": input_file,
        "filter_column": filter_column,
        "filter_value": filter_value,
        "output_files": [],
        "total_rows": 0,
        "chunks_processed": 0,
        "errors": []
    }
    
    def create_new_excel_file():
        nonlocal workbook, worksheet, header_written, current_file_rows, part_count

        if workbook:
            workbook.close()

        output_file = f"{output_prefix}_part{part_count}.xlsx"
        print(f"📝 สร้างไฟล์ใหม่: {output_file}")

        workbook = xlsxwriter.Workbook(output_file)
        worksheet = workbook.add_worksheet()
        header_written = False
        current_file_rows = 0
        part_count += 1

        # ✅ เก็บ path ของไฟล์จริง
        output_files.append(output_file)

        if enable_verification:
            verification_data["output_files"].append(output_file)

        return output_file

    
    # เริ่มสร้างไฟล์แรก
    current_output_file = create_new_excel_file()
    
    try:
        # อ่านไฟล์ CSV ทีละ chunk
        csv_reader = pd.read_csv(input_file, chunksize=chunk_size, dtype=str)
        total_chunks = sum(1 for _ in pd.read_csv(input_file, chunksize=chunk_size))

        
        for chunk_num, chunk in enumerate(tqdm(csv_reader, desc="Processing chunks", unit="chunk")):
            if task_id:
                percent = int(((chunk_num + 1) / total_chunks) * 100)
                progress_status[task_id].update({
                    "progress": percent,
                    "message": f"Processing chunk {chunk_num + 1}/{total_chunks}"
                })


            print(f"📊 กำลังประมวลผล chunk {chunk_num + 1} ({len(chunk)} แถว)")
            
            if enable_verification:
                verification_data["chunks_processed"] += 1
            
            # กรองข้อมูลตามเงื่อนไข
            if filter_column not in chunk.columns:
                error_msg = f"ไม่พบคอลัมน์ '{filter_column}' ใน chunk {chunk_num + 1}"
                print(f"❌ {error_msg}")
                if enable_verification:
                    verification_data["errors"].append(error_msg)
                continue
            
            df_filtered = chunk[chunk[filter_column] == filter_value]
            
            if df_filtered.empty:
                print(f"⏭️ ไม่มีข้อมูลที่ตรงเงื่อนไขใน chunk {chunk_num + 1}")
                continue
            
            print(f"✅ พบข้อมูลที่ตรงเงื่อนไข: {len(df_filtered)} แถว")
            
            # เขียน header ถ้ายังไม่เขียน
            if not header_written:
                for col_num, col_name in enumerate(df_filtered.columns):
                    worksheet.write(0, col_num, col_name)
                header_written = True
                current_file_rows = 1  # header = 1 แถว
            
            # เขียนข้อมูลทีละแถว
            for _, row in tqdm(df_filtered.iterrows(), 
                             desc=f"Writing to {os.path.basename(current_output_file)}", 
                             total=len(df_filtered), 
                             unit="row",
                             leave=False):
                
                # เช็คว่าเกิด limit หรือไม่
                if current_file_rows >= excel_limit:
                    print(f"📊 ไฟล์เต็ม ({current_file_rows} แถว) - สร้างไฟล์ใหม่")
                    current_output_file = create_new_excel_file()
                    
                    # เขียน header ในไฟล์ใหม่
                    for col_num, col_name in enumerate(df_filtered.columns):
                        worksheet.write(0, col_num, col_name)
                    header_written = True
                    current_file_rows = 1
                
                # เขียนข้อมูล
                row_data = [str(x) if pd.notna(x) else "" for x in row.values]
                worksheet.write_row(current_file_rows, 0, row_data)
                current_file_rows += 1
                total_filtered_rows += 1
    
    except Exception as e:
        if task_id:
            progress_status[task_id].update({
                "status": "error",
                "message": str(e)
            })
        error_msg = f"เกิดข้อผิดพลาด: {str(e)}"
        print(f"❌ {error_msg}")
        if enable_verification:
            verification_data["errors"].append(error_msg)
        return False
    
    finally:
        # ปิดไฟล์สุดท้าย
        if workbook:
            workbook.close()
        
        # บันทึกข้อมูล verification
        if enable_verification:
            verification_data["total_rows"] = total_filtered_rows
            verification_file = f"{output_prefix}_verification.json"
            with open(verification_file, 'w', encoding='utf-8') as f:
                json.dump(verification_data, f, indent=2, ensure_ascii=False)
            print(f"📋 บันทึกไฟล์ verification: {verification_file}")
    
    # สรุปผลลัพธ์
    print("\n" + "="*50)
    print("🎉 ประมวลผลเสร็จสิ้น!")
    print(f"📊 จำนวนแถวที่กรองได้: {total_filtered_rows:,} แถว")
    print(f"📁 จำนวนไฟล์ที่สร้าง: {part_count - 1} ไฟล์")
    print(f"📝 ไฟล์ผลลัพธ์: {output_prefix}_part*.xlsx")
    print("="*50)

    if task_id:
        progress_status[task_id].update({
            "status": "done",
            "progress": 100,
            "message": "Completed",
            "output_files": output_files
        })


    
    return True

def verify_output_integrity(verification_file: str):
    """
    ตรวจสอบความถูกต้องของไฟล์ผลลัพธ์
    
    Parameters:
    - verification_file: ชื่อไฟล์ verification JSON
    """
    try:
        with open(verification_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print("\n" + "🔍 ตรวจสอบความถูกต้อง")
        print("="*30)
        print(f"📁 ไฟล์ต้นฉบับ: {data['input_file']}")
        print(f"🔧 เงื่อนไขกรอง: {data['filter_column']} = '{data['filter_value']}'")
        print(f"📊 จำนวน chunks ที่ประมวลผล: {data['chunks_processed']}")
        print(f"📈 จำนวนแถวรวม: {data['total_rows']:,}")
        print(f"📄 ไฟล์ผลลัพธ์ที่สร้าง: {len(data['output_files'])} ไฟล์")
        
        # แสดงรายการไฟล์
        for i, file in enumerate(data['output_files'], 1):
            if os.path.exists(file):
                file_size = os.path.getsize(file)
                print(f"  {i}. {file} ({file_size:,} bytes)")
            else:
                print(f"  {i}. {file} ❌ ไฟล์หายไป!")
        
        # แสดงข้อผิดพลาด (ถ้ามี)
        if data['errors']:
            print("\n⚠️ ข้อผิดพลาดที่พบ:")
            for error in data['errors']:
                print(f"  - {error}")
        else:
            print("\n✅ ไม่พบข้อผิดพลาด")
        
        print("="*30)
        
    except Exception as e:
        print(f"❌ ไม่สามารถตรวจสอบไฟล์ verification ได้: {str(e)}")

# ตัวอย่างการใช้งาน
if __name__ == "__main__":
    # กำหนดพารามิเตอร์
    input_csv = "SCCD_ALL_CI_TEAM_MBL_SPLIT_D_SA1234_V1.txt"
    filter_col = "SPL_D_SCCD_SA1234_SGMD"
    filter_val = "Regional Management 4 (North)"
    output_name = "regional_management4_north_filtered"
    
    # เรียกใช้งาน function
    success = process_csv_to_filtered_excel(
        input_file=input_csv,
        filter_column=filter_col,
        filter_value=filter_val,
        output_prefix=output_name,
        chunk_size=100000,  # ปรับได้ตาม RAM
        excel_limit=1048576,  # Excel row limit
        enable_verification=True  # เปิดใช้การตรวจสอบ
    )
    
    if success:
        print("✅ ทุกอย่างเสร็จสมบูรณ์!")
        
        # ตรวจสอบความถูกต้องเพิ่มเติม
        verification_file = f"{output_name}_verification.json"
        if os.path.exists(verification_file):
            verify_output_integrity(verification_file)
    else:
        print("❌ เกิดข้อผิดพลาดในการประมวลผล")
        print("💡 ตรวจสอบไฟล์ verification เพื่อดูรายละเอียดข้อผิดพลาด")