from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import uuid
import os
import shutil

from fastapi.middleware.cors import CORSMiddleware
from csv_processor_checksum_ver import process_csv_to_filtered_excel
from progress_store import progress_status


app = FastAPI()

TMP_DIR = "tmp"
OUTPUT_DIR = "output"

os.makedirs(TMP_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # ระหว่าง dev ใช้ * ได้
    allow_credentials=True,
    allow_methods=["*"],          # สำคัญมาก (รวม OPTIONS)
    allow_headers=["*"],          # สำคัญมาก
)

@app.post("/txt-to-excel")
async def txt_to_excel(file: UploadFile = File(...)):
    task_id = str(uuid.uuid4())

    txt_path = f"{TMP_DIR}/{task_id}.txt"

    with open(txt_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    process_csv_to_filtered_excel(
        input_file=txt_path,
        filter_column="SPL_D_SCCD_SA1234_SGMD",
        filter_value="Regional Management 4 (North)",
        output_prefix=f"output_{task_id}",
        enable_verification=True,
        task_id=task_id
    )

    return {
        "task_id": task_id,
        "message": "Processing started"
    }




@app.get("/progress/{task_id}")
def get_progress(task_id: str):
    return progress_status.get(
        task_id,
        {"status": "not_found"}
    )

@app.get("/download/{task_id}")
def download_result(task_id: str):
    task = progress_status.get(task_id)
    
    # 1. ตรวจว่ามี task ไหม
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # 2. ตรวจว่างานเสร็จหรือยัง
    if task["status"] != "done":
        raise HTTPException(
            status_code=400,
            detail="File not ready yet"
        )
    
    print(task)
    output_files = task.get("output_files", [])
    
    if not output_files:
        raise HTTPException(
            status_code=404,
            detail="No output file"
        )
    
    # 3. ตอนนี้เอาไฟล์แรกก่อน (กรณีมีหลาย part)
    file_path = output_files[0]
    
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="File not found on server"
        )
    
    # 4. ส่งไฟล์ (stream จาก disk → browser)
    return FileResponse(
        path=file_path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=os.path.basename(file_path)
    )