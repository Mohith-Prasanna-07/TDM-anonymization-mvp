from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import uuid
import os

from masking_engine import run_local_anonymization


app = FastAPI(title="TDM Anonymization MVP Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_PATH = os.path.join(BASE_DIR, "data", "sample_input.csv")
OUTPUT_PATH = os.path.join(BASE_DIR, "data", "masked_output.csv")

jobs = {}


class RunJobRequest(BaseModel):
    masking_rules: dict


@app.get("/")
def health_check():
    return {
        "message": "TDM Anonymization Backend is running",
        "status": "healthy",
        "mode": "dynamic-local-anonymization"
    }
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        return {
            "status": "FAILED",
            "message": "Only CSV files are supported for this MVP."
        }

    os.makedirs(os.path.dirname(INPUT_PATH), exist_ok=True)

    with open(INPUT_PATH, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    return {
        "status": "SUCCESS",
        "message": "File uploaded successfully",
        "filename": file.filename,
        "saved_path": INPUT_PATH
    }

@app.post("/jobs/run")
def run_job(request: RunJobRequest):
    job_id = str(uuid.uuid4())

    preview, audit = run_local_anonymization(
        INPUT_PATH,
        OUTPUT_PATH,
        request.masking_rules
    )

    jobs[job_id] = {
        "job_id": job_id,
        "status": "COMPLETED",
        "created_at": datetime.now().isoformat(),
        "rows_processed": audit["total_rows_processed"],
        "tables_processed": audit["tables_processed"],
        "columns_masked": audit["pii_columns_masked"],
        "execution_mode": audit["execution_mode"],
        "output_target": audit["output_target"],
        "preview": preview,
        "audit": audit
    }

    return {
        "message": "Anonymization job completed successfully",
        "job_id": job_id,
        "status": "COMPLETED"
    }


@app.get("/jobs/{job_id}/status")
def get_job_status(job_id: str):
    if job_id not in jobs:
        return {
            "job_id": job_id,
            "status": "NOT_FOUND",
            "message": "Job ID not found"
        }

    job = jobs[job_id]

    return {
        "job_id": job["job_id"],
        "status": job["status"],
        "created_at": job["created_at"],
        "rows_processed": job["rows_processed"],
        "tables_processed": job["tables_processed"],
        "columns_masked": job["columns_masked"],
        "execution_mode": job["execution_mode"],
        "output_target": job["output_target"]
    }


@app.get("/jobs/{job_id}/preview")
def get_job_preview(job_id: str):
    if job_id not in jobs:
        return {
            "job_id": job_id,
            "status": "NOT_FOUND",
            "message": "Job ID not found"
        }

    return {
        "job_id": job_id,
        "before": jobs[job_id]["preview"]["before"],
        "after": jobs[job_id]["preview"]["after"]
    }


@app.get("/jobs/{job_id}/audit")
def get_job_audit(job_id: str):
    if job_id not in jobs:
        return {
            "job_id": job_id,
            "status": "NOT_FOUND",
            "message": "Job ID not found"
        }

    return {
        "job_id": job_id,
        "audit": jobs[job_id]["audit"]
    }

@app.get("/jobs/history")
def get_job_history():
    history = []

    for job_id, job in jobs.items():
        history.append({
            "job_id": job["job_id"],
            "status": job["status"],
            "created_at": job["created_at"],
            "rows_processed": job["rows_processed"],
            "tables_processed": job["tables_processed"],
            "columns_masked": job["columns_masked"],
            "execution_mode": job["execution_mode"],
            "output_target": job["output_target"]
        })

    history = sorted(history, key=lambda job: job["created_at"], reverse=True)

    return {
        "count": len(history),
        "jobs": history
    }

@app.get("/download/masked-output")
def download_masked_output():
    if not os.path.exists(OUTPUT_PATH):
        return {
            "status": "NOT_FOUND",
            "message": "Masked output file not found. Please run an anonymization job first."
        }

    return FileResponse(
        path=OUTPUT_PATH,
        filename="masked_output.csv",
        media_type="text/csv"
    )