from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import uuid
import os
import pandas as pd

from masking_engine import run_local_anonymization
from test_data_generator import generate_test_data


app = FastAPI(title="TDM Anonymization MVP Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
UPLOAD_DIR = os.path.join(DATA_DIR, "uploads")
OUTPUT_DIR = os.path.join(DATA_DIR, "outputs")
GENERATED_DIR = os.path.join(DATA_DIR, "generated")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(GENERATED_DIR, exist_ok=True)

jobs = {}
datasets = {}


class RunJobRequest(BaseModel):
    dataset_id: str
    masking_rules: dict


class GenerateTestDataRequest(BaseModel):
    template: str
    row_count: int


class ChatRequest(BaseModel):
    message: str


def suggest_rule_for_column(column_name):
    col = column_name.lower().strip()

    if col in [
        "name",
        "full_name",
        "firstname",
        "first_name",
        "lastname",
        "last_name",
        "employee_name",
        "patient_name",
    ]:
        return "Fake Value"

    if "email" in col:
        return "Fake Value"

    if col in ["phone", "phone_number", "mobile", "mobile_number", "contact_number"]:
        return "Fake Value"

    if col in ["ssn", "social_security_number", "social_security"]:
        return "Partial Masking"

    if col in ["dob", "date_of_birth", "birth_date"]:
        return "Date Shift"

    if col.endswith("_id") or col in [
        "id",
        "customer_id",
        "account_id",
        "member_id",
        "employee_id",
        "claim_id",
    ]:
        return "Hash"

    if "address" in col:
        return "Fake Value"

    return "No Masking"


def detect_columns_from_csv(file_path):
    df_preview = pd.read_csv(file_path, nrows=5)

    detected_columns = []

    for column in df_preview.columns:
        suggested_rule = suggest_rule_for_column(column)

        detected_columns.append({
            "name": column,
            "type": str(df_preview[column].dtype),
            "pii": suggested_rule != "No Masking",
            "rule": suggested_rule,
        })

    return detected_columns


@app.get("/")
def health_check():
    return {
        "message": "TDM Anonymization Backend is running",
        "status": "healthy",
        "mode": "multi-dataset-test-data-generation-chatbot",
    }


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        return {
            "status": "FAILED",
            "message": "Only CSV files are supported for this MVP.",
        }

    dataset_id = str(uuid.uuid4())
    safe_filename = file.filename.replace(" ", "_")

    input_path = os.path.join(UPLOAD_DIR, f"{dataset_id}_{safe_filename}")
    output_path = os.path.join(OUTPUT_DIR, f"masked_{dataset_id}_{safe_filename}")

    with open(input_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    try:
        detected_columns = detect_columns_from_csv(input_path)
    except Exception as e:
        return {
            "status": "FAILED",
            "message": f"File uploaded but schema detection failed: {str(e)}",
        }

    datasets[dataset_id] = {
        "dataset_id": dataset_id,
        "filename": safe_filename,
        "source_type": "uploaded_csv",
        "input_path": input_path,
        "output_path": output_path,
        "uploaded_at": datetime.now().isoformat(),
        "columns": detected_columns,
    }

    return {
        "status": "SUCCESS",
        "message": "File uploaded successfully",
        "dataset_id": dataset_id,
        "filename": safe_filename,
        "saved_path": input_path,
        "columns": detected_columns,
    }


@app.post("/generate-test-data")
def generate_test_dataset(request: GenerateTestDataRequest):
    try:
        dataset_id = str(uuid.uuid4())
        template = request.template.lower().strip()
        row_count = request.row_count

        generated_df = generate_test_data(template, row_count)

        filename = f"generated_{template}_{row_count}_rows.csv"
        input_path = os.path.join(GENERATED_DIR, f"{dataset_id}_{filename}")
        output_path = os.path.join(OUTPUT_DIR, f"masked_{dataset_id}_{filename}")

        generated_df.to_csv(input_path, index=False)

        detected_columns = detect_columns_from_csv(input_path)

        datasets[dataset_id] = {
            "dataset_id": dataset_id,
            "filename": filename,
            "source_type": "generated_test_data",
            "template": template,
            "row_count": row_count,
            "input_path": input_path,
            "output_path": output_path,
            "uploaded_at": datetime.now().isoformat(),
            "columns": detected_columns,
        }

        return {
            "status": "SUCCESS",
            "message": "Test data generated successfully",
            "dataset_id": dataset_id,
            "filename": filename,
            "source_type": "generated_test_data",
            "template": template,
            "row_count": row_count,
            "columns": detected_columns,
        }

    except Exception as e:
        return {
            "status": "FAILED",
            "message": str(e),
        }


@app.get("/datasets")
def get_datasets():
    dataset_list = list(datasets.values())

    dataset_list = sorted(
        dataset_list,
        key=lambda dataset: dataset["uploaded_at"],
        reverse=True,
    )

    return {
        "count": len(dataset_list),
        "datasets": dataset_list,
    }


@app.post("/jobs/run")
def run_job(request: RunJobRequest):
    if request.dataset_id not in datasets:
        return {
            "status": "FAILED",
            "message": "Dataset ID not found. Please upload, generate, or select a dataset first.",
        }

    dataset = datasets[request.dataset_id]
    job_id = str(uuid.uuid4())

    preview, audit = run_local_anonymization(
        dataset["input_path"],
        dataset["output_path"],
        request.masking_rules,
    )

    jobs[job_id] = {
        "job_id": job_id,
        "dataset_id": request.dataset_id,
        "dataset_name": dataset["filename"],
        "source_type": dataset.get("source_type", "unknown"),
        "status": "COMPLETED",
        "created_at": datetime.now().isoformat(),
        "rows_processed": audit["total_rows_processed"],
        "tables_processed": audit["tables_processed"],
        "columns_masked": audit["pii_columns_masked"],
        "execution_mode": audit["execution_mode"],
        "output_target": audit["output_target"],
        "preview": preview,
        "audit": audit,
    }

    return {
        "message": "Anonymization job completed successfully",
        "job_id": job_id,
        "dataset_id": request.dataset_id,
        "dataset_name": dataset["filename"],
        "status": "COMPLETED",
    }


@app.get("/jobs/{job_id}/status")
def get_job_status(job_id: str):
    if job_id not in jobs:
        return {
            "job_id": job_id,
            "status": "NOT_FOUND",
            "message": "Job ID not found",
        }

    job = jobs[job_id]

    return {
        "job_id": job["job_id"],
        "dataset_id": job.get("dataset_id"),
        "dataset_name": job.get("dataset_name"),
        "source_type": job.get("source_type"),
        "status": job["status"],
        "created_at": job["created_at"],
        "rows_processed": job["rows_processed"],
        "tables_processed": job["tables_processed"],
        "columns_masked": job["columns_masked"],
        "execution_mode": job["execution_mode"],
        "output_target": job["output_target"],
    }


@app.get("/jobs/{job_id}/preview")
def get_job_preview(job_id: str):
    if job_id not in jobs:
        return {
            "job_id": job_id,
            "status": "NOT_FOUND",
            "message": "Job ID not found",
        }

    return {
        "job_id": job_id,
        "before": jobs[job_id]["preview"]["before"],
        "after": jobs[job_id]["preview"]["after"],
    }


@app.get("/jobs/{job_id}/audit")
def get_job_audit(job_id: str):
    if job_id not in jobs:
        return {
            "job_id": job_id,
            "status": "NOT_FOUND",
            "message": "Job ID not found",
        }

    return {
        "job_id": job_id,
        "audit": jobs[job_id]["audit"],
    }


@app.get("/jobs/history")
def get_job_history():
    history = []

    for job_id, job in jobs.items():
        history.append({
            "job_id": job["job_id"],
            "dataset_id": job.get("dataset_id"),
            "dataset_name": job.get("dataset_name"),
            "source_type": job.get("source_type"),
            "status": job["status"],
            "created_at": job["created_at"],
            "rows_processed": job["rows_processed"],
            "tables_processed": job["tables_processed"],
            "columns_masked": job["columns_masked"],
            "execution_mode": job["execution_mode"],
            "output_target": job["output_target"],
        })

    history = sorted(history, key=lambda job: job["created_at"], reverse=True)

    return {
        "count": len(history),
        "jobs": history,
    }


@app.get("/download/masked-output/{job_id}")
def download_masked_output(job_id: str):
    if job_id not in jobs:
        return {
            "status": "NOT_FOUND",
            "message": "Job ID not found.",
        }

    output_path = jobs[job_id]["output_target"]

    if not os.path.exists(output_path):
        return {
            "status": "NOT_FOUND",
            "message": "Masked output file not found. Please run an anonymization job first.",
        }

    dataset_name = jobs[job_id].get("dataset_name", "output.csv")

    return FileResponse(
        path=output_path,
        filename=f"masked_{dataset_name}",
        media_type="text/csv",
    )


@app.post("/chat")
def chat_with_assistant(request: ChatRequest):
    user_message = request.message.lower().strip()

    if len(datasets) == 0 and len(jobs) == 0:
        return {
            "response": "No datasets or jobs are available yet. Please upload a CSV file or generate test data first."
        }

    latest_dataset = None
    latest_job = None

    if datasets:
        latest_dataset = sorted(
            datasets.values(),
            key=lambda dataset: dataset["uploaded_at"],
            reverse=True
        )[0]

    if jobs:
        latest_job = sorted(
            jobs.values(),
            key=lambda job: job["created_at"],
            reverse=True
        )[0]

    if "column" in user_message or "schema" in user_message:
        if not latest_dataset:
            return {
                "response": "No dataset is available yet. Upload or generate a dataset first."
            }

        columns = latest_dataset.get("columns", [])
        column_summary = ", ".join([column["name"] for column in columns])

        return {
            "response": f"The latest dataset is {latest_dataset['filename']}. Detected columns are: {column_summary}."
        }

    if "pii" in user_message or "sensitive" in user_message:
        if not latest_dataset:
            return {
                "response": "No dataset is available yet. Upload or generate a dataset first."
            }

        pii_columns = [
            column["name"]
            for column in latest_dataset.get("columns", [])
            if column.get("pii")
        ]

        if not pii_columns:
            return {
                "response": "I did not detect any PII columns in the latest dataset using the current rule-based detection."
            }

        return {
            "response": f"The detected PII columns are: {', '.join(pii_columns)}."
        }

    if "rule" in user_message or "mask" in user_message:
        if not latest_dataset:
            return {
                "response": "No dataset is available yet. Upload or generate a dataset first."
            }

        rules = [
            f"{column['name']} → {column.get('rule', 'No Masking')}"
            for column in latest_dataset.get("columns", [])
        ]

        return {
            "response": "Suggested masking rules are: " + "; ".join(rules)
        }

    if "job" in user_message or "status" in user_message or "run" in user_message:
        if not latest_job:
            return {
                "response": "No anonymization job has been run yet."
            }

        return {
            "response": (
                f"The latest job status is {latest_job['status']}. "
                f"It processed {latest_job['rows_processed']} rows, masked "
                f"{latest_job['columns_masked']} columns, and used {latest_job['execution_mode']}."
            )
        }

    if "audit" in user_message:
        if not latest_job:
            return {
                "response": "No audit summary is available yet because no job has been run."
            }

        audit = latest_job.get("audit", {})

        return {
            "response": (
                f"Audit summary: {audit.get('total_rows_processed', 0)} rows processed, "
                f"{audit.get('pii_columns_masked', 0)} columns masked, "
                f"rules applied: {', '.join(audit.get('rules_applied', []))}."
            )
        }

    if "download" in user_message or "output" in user_message:
        if not latest_job:
            return {
                "response": "No masked output is available yet. Please run an anonymization job first."
            }

        return {
            "response": (
                "The masked output is available after the job completes. "
                "Go to the Review step and click Download Masked CSV."
            )
        }

    if "databricks" in user_message or "spark" in user_message or "scale" in user_message:
        return {
            "response": (
                "This MVP currently uses a local Pandas masking engine. "
                "For enterprise scale, the FastAPI backend can be upgraded to trigger Databricks Jobs "
                "and run the anonymization logic using PySpark on scalable clusters."
            )
        }

    return {
        "response": (
            "I can help with dataset columns, PII detection, masking rules, job status, audit summary, "
            "download output, and future Databricks/Spark scaling. Try asking: 'What PII columns were detected?'"
        )
    }