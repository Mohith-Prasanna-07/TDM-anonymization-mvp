from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import uuid
import os
import pandas as pd
import json

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
RULES_DIR = os.path.join(DATA_DIR, "rules")
RULES_FILE = os.path.join(RULES_DIR, "admin_locked_rules.json")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(GENERATED_DIR, exist_ok=True)
os.makedirs(RULES_DIR, exist_ok=True)

jobs = {}
datasets = {}

BACKEND_SESSION_ID = str(uuid.uuid4())

class LoginRequest(BaseModel):
    email: str
    password: str

class RunJobRequest(BaseModel):
    dataset_id: str
    masking_rules: dict
    user_role: str = "developer"

class UpdateLockedRuleRequest(BaseModel):
    column: str
    rule: str
    reason: str = ""
    developer_can_override: bool = False
    enabled: bool = True
    user_role: str = "developer"

class GenerateTestDataRequest(BaseModel):
    template: str
    row_count: int


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
        "ai_suggested_rule": suggested_rule,
        "rule": suggested_rule,
        "override_allowed": True,
    })

    return detected_columns

def apply_admin_locked_rules(dataset, masking_rules, user_role):
    final_rules = dict(masking_rules)
    enforced_rules = []

    if user_role == "admin":
        return final_rules, enforced_rules

    dataset_name = dataset.get("filename", "").lower()
    admin_locked_rules = load_admin_locked_rules()

    for locked_rule in admin_locked_rules:
        if not locked_rule.get("enabled", True):
            continue

        if locked_rule.get("developer_can_override", False):
            continue

        locked_column_name = locked_rule["column"].lower()
        table_contains = locked_rule.get("table_contains")

        table_match = table_contains is None or table_contains in dataset_name

        matching_column_key = None

        for rule_column in final_rules.keys():
            if rule_column.lower() == locked_column_name:
                matching_column_key = rule_column
                break

        if table_match and matching_column_key:
            original_rule = final_rules.get(matching_column_key)
            final_rules[matching_column_key] = locked_rule["rule"]

            enforced_rules.append({
                "column": matching_column_key,
                "original_rule": original_rule,
                "enforced_rule": locked_rule["rule"],
                "locked_by": locked_rule["locked_by"],
                "reason": locked_rule["reason"],
            })

    return final_rules, enforced_rules


@app.get("/")
def health_check():
    return {
        "message": "TDM Anonymization Backend is running",
        "status": "healthy",
        "mode": "multi-dataset-test-data-generation-chatbot",
        "backend_session_id": BACKEND_SESSION_ID,
    }

@app.get("/admin-locked-rules")
def get_admin_locked_rules():
    return {
        "status": "SUCCESS",
        "rules": load_admin_locked_rules(),
    }


@app.put("/admin-locked-rules")
def update_admin_locked_rule(request: UpdateLockedRuleRequest):
    if request.user_role != "admin":
        return {
            "status": "FAILED",
            "message": "Only Admin users can create or update locked rules.",
        }

    rules = load_admin_locked_rules()

    updated = False

    for rule in rules:
        if rule["column"].lower() == request.column.lower():
            rule["rule"] = request.rule
            rule["reason"] = request.reason
            rule["developer_can_override"] = request.developer_can_override
            rule["enabled"] = request.enabled
            rule["locked_by"] = "TDM Admin"
            updated = True

    if not updated:
        rules.append({
            "table_contains": None,
            "column": request.column.lower(),
            "rule": request.rule,
            "locked_by": "TDM Admin",
            "reason": request.reason,
            "developer_can_override": request.developer_can_override,
            "enabled": request.enabled,
        })

    save_admin_locked_rules(rules)

    return {
        "status": "SUCCESS",
        "message": "Admin locked rule updated successfully.",
        "rules": rules,
    }


@app.delete("/admin-locked-rules/{column_name}")
def delete_admin_locked_rule(column_name: str, user_role: str = "developer"):
    if user_role != "admin":
        return {
            "status": "FAILED",
            "message": "Only Admin users can delete locked rules.",
        }

    rules = load_admin_locked_rules()

    updated_rules = [
        rule for rule in rules
        if rule["column"].lower() != column_name.lower()
    ]

    if len(updated_rules) == len(rules):
        return {
            "status": "FAILED",
            "message": f"No locked rule found for column: {column_name}",
            "rules": rules,
        }

    save_admin_locked_rules(updated_rules)

    return {
        "status": "SUCCESS",
        "message": f"Locked rule for column '{column_name}' deleted successfully.",
        "rules": updated_rules,
    }



DEMO_USERS = {
    "admin@tdm.com": {
        "password": "Admin@123",
        "name": "TDM Admin",
        "role": "admin",
        "permissions": [
            "dashboard",
            "data_inventory",
            "source_connections",
            "data_classification",
            "masking_rules",
            "subsetting_rules",
            "create_pipeline",
            "existing_pipelines",
            "job_monitor",
            "data_preview",
            "user_access",
            "configuration",
            "help",
        ],
    },
    "developer@tdm.com": {
        "password": "Dev@123",
        "name": "TDM Developer",
        "role": "developer",
        "permissions": [
            "dashboard",
            "data_inventory",
            "data_classification",
            "masking_rules",
            "create_pipeline",
            "job_monitor",
            "data_preview",
            "help",
        ],
    },
}

DEFAULT_ADMIN_LOCKED_RULES = [
    {
        "table_contains": None,
        "column": "ssn",
        "rule": "Partial Masking",
        "locked_by": "TDM Admin",
        "reason": "",
        "developer_can_override": False,
        "enabled": True,
    }
]


def load_admin_locked_rules():
    if not os.path.exists(RULES_FILE):
        save_admin_locked_rules(DEFAULT_ADMIN_LOCKED_RULES)
        return DEFAULT_ADMIN_LOCKED_RULES

    with open(RULES_FILE, "r") as file:
        return json.load(file)


def save_admin_locked_rules(rules):
    with open(RULES_FILE, "w") as file:
        json.dump(rules, file, indent=2)

@app.post("/auth/login")
def login(request: LoginRequest):
    user = DEMO_USERS.get(request.email)

    if not user or user["password"] != request.password:
        return {
            "status": "FAILED",
            "message": "Invalid email or password.",
        }

    return {
        "status": "SUCCESS",
        "message": "Login successful.",
        "user": {
            "email": request.email,
            "name": user["name"],
            "role": user["role"],
            "permissions": user["permissions"],
        },
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
    job_started_at = datetime.now()

    final_masking_rules, enforced_rules = apply_admin_locked_rules(
        dataset,
        request.masking_rules,
        request.user_role,
    )

    preview, audit = run_local_anonymization(
        dataset["input_path"],
        dataset["output_path"],
        final_masking_rules,
    )

    job_ended_at = datetime.now()
    duration_seconds = round((job_ended_at - job_started_at).total_seconds(), 2)

    audit["admin_locked_rules_enforced"] = enforced_rules

    jobs[job_id] = {
        "job_id": job_id,
        "dataset_id": request.dataset_id,
        "dataset_name": dataset["filename"],
        "source_type": dataset.get("source_type", "unknown"),
        "user_role": request.user_role,
        "admin_locked_rules_enforced": enforced_rules,
        "status": "COMPLETED",
        "created_at": datetime.now().isoformat(),
        "job_started_at": job_started_at.isoformat(),
        "job_ended_at": job_ended_at.isoformat(),
        "duration_seconds": duration_seconds,
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
        "admin_locked_rules_enforced": enforced_rules,
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
        "job_started_at": job.get("job_started_at"),
        "job_ended_at": job.get("job_ended_at"),
        "duration_seconds": job.get("duration_seconds"),
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


