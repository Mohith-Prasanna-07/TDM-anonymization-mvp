from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import uuid
import os
import pandas as pd
import json
import zipfile

from masking_engine import run_local_anonymization
from test_data_generator import generate_test_data


app = FastAPI(title="TDM Anonymization MVP Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
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

class SourceTableSelection(BaseModel):
    table_name: str
    selected_columns: list[str]
    row_count: int = 100


class GenerateFromSourceRequest(BaseModel):
    source: str
    database: str
    tables: list[SourceTableSelection]

class MultiDatasetRunItem(BaseModel):
    dataset_id: str
    masking_rules: dict


class RunMultipleJobsRequest(BaseModel):
    datasets: list[MultiDatasetRunItem]
    user_role: str = "developer"

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

MOCK_DATABRICKS_METADATA = {
    "healthcare_catalog.patient_schema": {
        "patient_records": [
            {"name": "patient_id", "type": "string"},
            {"name": "first_name", "type": "string"},
            {"name": "last_name", "type": "string"},
            {"name": "date_of_birth", "type": "date"},
            {"name": "ssn", "type": "string"},
            {"name": "email", "type": "string"},
            {"name": "phone_number", "type": "string"},
            {"name": "address", "type": "string"},
            {"name": "diagnosis_code", "type": "string"},
            {"name": "doctor_id", "type": "string"},
            {"name": "insurance_id", "type": "string"},
            {"name": "created_at", "type": "timestamp"},
        ],
        "appointments": [
            {"name": "appointment_id", "type": "string"},
            {"name": "patient_id", "type": "string"},
            {"name": "doctor_id", "type": "string"},
            {"name": "appointment_date", "type": "date"},
            {"name": "department", "type": "string"},
            {"name": "visit_reason", "type": "string"},
            {"name": "status", "type": "string"},
        ],
        "insurance_claims": [
            {"name": "claim_id", "type": "string"},
            {"name": "patient_id", "type": "string"},
            {"name": "insurance_id", "type": "string"},
            {"name": "claim_amount", "type": "decimal"},
            {"name": "claim_status", "type": "string"},
            {"name": "claim_date", "type": "date"},
            {"name": "diagnosis_code", "type": "string"},
        ],
    }
}

def generate_value_for_column(column_name, index):
    col = column_name.lower()

    first_names = ["Aarav", "Maya", "Rohan", "Anika", "Vikram", "Sara", "David", "Priya"]
    last_names = ["Sharma", "Patel", "Kumar", "Reddy", "Singh", "Thomas", "Mehta", "Brown"]
    departments = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General Medicine"]
    visit_reasons = ["Routine Checkup", "Follow-up", "Consultation", "Lab Review", "Annual Physical"]
    statuses = ["Scheduled", "Completed", "Cancelled", "Pending"]
    claim_statuses = ["Approved", "Pending", "Denied", "Under Review"]
    diagnosis_codes = ["E11.9", "I10", "J45.909", "M54.5", "R51.9", "K21.9"]

    if col in ["patient_id"]:
        return f"PAT{100000 + index}"

    if col in ["appointment_id"]:
        return f"APT{200000 + index}"

    if col in ["claim_id"]:
        return f"CLM{300000 + index}"

    if col in ["doctor_id"]:
        return f"DOC{500 + (index % 25)}"

    if col in ["insurance_id"]:
        return f"INS{800000 + index}"

    if col in ["first_name", "firstname"]:
        return first_names[index % len(first_names)]

    if col in ["last_name", "lastname"]:
        return last_names[index % len(last_names)]

    if col in ["full_name", "name", "patient_name", "employee_name"]:
        return f"{first_names[index % len(first_names)]} {last_names[index % len(last_names)]}"

    if "email" in col:
        return f"user{index}@example.com"

    if col in ["ssn", "social_security_number", "social_security"]:
        return f"{100 + (index % 899)}-{10 + (index % 89)}-{1000 + (index % 8999)}"

    if "phone" in col or "mobile" in col:
        return f"555-01{index % 100:02d}"

    if "address" in col:
        return f"{100 + index} Main Street"

    if col in ["date_of_birth", "dob", "birth_date"]:
        year = 1970 + (index % 35)
        month = 1 + (index % 12)
        day = 1 + (index % 28)
        return f"{year}-{month:02d}-{day:02d}"

    if "date" in col or col.endswith("_at"):
        month = 1 + (index % 12)
        day = 1 + (index % 28)
        return f"2025-{month:02d}-{day:02d}"

    if col == "department":
        return departments[index % len(departments)]

    if col == "visit_reason":
        return visit_reasons[index % len(visit_reasons)]

    if col == "status":
        return statuses[index % len(statuses)]

    if col == "claim_status":
        return claim_statuses[index % len(claim_statuses)]

    if col == "diagnosis_code":
        return diagnosis_codes[index % len(diagnosis_codes)]

    if "amount" in col or "balance" in col:
        return round(100 + (index * 37.45), 2)

    if col.endswith("_id") or col == "id":
        return f"ID{10000 + index}"

    return f"{column_name}_{index}"


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

@app.post("/generate-test-data-from-source")
def generate_test_data_from_source(request: GenerateFromSourceRequest):
    try:
        if request.source.lower() != "databricks":
            return {
                "status": "FAILED",
                "message": "Only Databricks mock source is supported in this MVP.",
            }

        if request.database not in MOCK_DATABRICKS_METADATA:
            return {
                "status": "FAILED",
                "message": "Selected database not found.",
            }

        generated_datasets = []

        for table_selection in request.tables:
            table_name = table_selection.table_name
            selected_columns = table_selection.selected_columns

            if table_name not in MOCK_DATABRICKS_METADATA[request.database]:
                return {
                    "status": "FAILED",
                    "message": f"Table not found: {table_name}",
                }

            if not selected_columns:
                return {
                    "status": "FAILED",
                    "message": f"No columns selected for table: {table_name}",
                }

            source_columns = MOCK_DATABRICKS_METADATA[request.database][table_name]
            valid_column_names = [column["name"] for column in source_columns]

            invalid_columns = [
                column for column in selected_columns
                if column not in valid_column_names
            ]

            if invalid_columns:
                return {
                    "status": "FAILED",
                    "message": f"Invalid columns for {table_name}: {invalid_columns}",
                }

            generated_rows = []

            table_row_count = table_selection.row_count

            for index in range(1, table_row_count + 1):
                row = {}

                for column in selected_columns:
                    row[column] = generate_value_for_column(column, index)

                generated_rows.append(row)

            generated_df = pd.DataFrame(generated_rows)

            dataset_id = str(uuid.uuid4())
            filename = f"generated_{table_name}_{table_row_count}_rows.csv"
            input_path = os.path.join(GENERATED_DIR, f"{dataset_id}_{filename}")
            output_path = os.path.join(OUTPUT_DIR, f"masked_{dataset_id}_{filename}")

            generated_df.to_csv(input_path, index=False)

            detected_columns = detect_columns_from_csv(input_path)

            datasets[dataset_id] = {
                "dataset_id": dataset_id,
                "filename": filename,
                "source_type": "databricks_schema_generated",
                "database": request.database,
                "table_name": table_name,
                "row_count": table_row_count,
                "input_path": input_path,
                "output_path": output_path,
                "uploaded_at": datetime.now().isoformat(),
                "columns": detected_columns,
            }

            generated_datasets.append({
                "dataset_id": dataset_id,
                "filename": filename,
                "source_type": "databricks_schema_generated",
                "database": request.database,
                "table_name": table_name,
                "row_count": table_row_count,
                "columns": detected_columns,
            })

        return {
            "status": "SUCCESS",
            "message": f"Generated test data for {len(generated_datasets)} table(s).",
            "datasets": generated_datasets,
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

@app.get("/source-metadata/databricks/databases")
def get_databricks_databases():
    return {
        "status": "SUCCESS",
        "databases": list(MOCK_DATABRICKS_METADATA.keys()),
    }


@app.get("/source-metadata/databricks/tables")
def get_databricks_tables(database: str):
    if database not in MOCK_DATABRICKS_METADATA:
        return {
            "status": "FAILED",
            "message": "Database not found.",
            "tables": [],
        }

    return {
        "status": "SUCCESS",
        "database": database,
        "tables": list(MOCK_DATABRICKS_METADATA[database].keys()),
    }


@app.get("/source-metadata/databricks/columns")
def get_databricks_columns(database: str, table: str):
    if database not in MOCK_DATABRICKS_METADATA:
        return {
            "status": "FAILED",
            "message": "Database not found.",
            "columns": [],
        }

    if table not in MOCK_DATABRICKS_METADATA[database]:
        return {
            "status": "FAILED",
            "message": "Table not found.",
            "columns": [],
        }

    return {
        "status": "SUCCESS",
        "database": database,
        "table": table,
        "columns": MOCK_DATABRICKS_METADATA[database][table],
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

@app.post("/jobs/run-multiple")
def run_multiple_jobs(request: RunMultipleJobsRequest):
    if not request.datasets:
        return {
            "status": "FAILED",
            "message": "No datasets provided for multi-table run.",
        }

    job_id = str(uuid.uuid4())
    job_started_at = datetime.now()

    child_jobs = []
    combined_before_preview = []
    combined_after_preview = []
    total_rows_processed = 0
    total_columns_masked = 0
    all_rules_applied = []
    all_enforced_rules = []
    output_files = []

    for item in request.datasets:
        if item.dataset_id not in datasets:
            return {
                "status": "FAILED",
                "message": f"Dataset ID not found: {item.dataset_id}",
            }

        dataset = datasets[item.dataset_id]

        final_masking_rules, enforced_rules = apply_admin_locked_rules(
            dataset,
            item.masking_rules,
            request.user_role,
        )

        preview, audit = run_local_anonymization(
            dataset["input_path"],
            dataset["output_path"],
            final_masking_rules,
        )

        table_name = dataset.get("table_name") or dataset.get("filename")

        before_rows = preview.get("before", [])
        after_rows = preview.get("after", [])

        for row in before_rows:
            combined_before_preview.append({
                "_table": table_name,
                **row,
            })

        for row in after_rows:
            combined_after_preview.append({
                "_table": table_name,
                **row,
            })

        total_rows_processed += audit["total_rows_processed"]
        total_columns_masked += audit["pii_columns_masked"]
        all_rules_applied.extend(audit.get("rules_applied", []))
        all_enforced_rules.extend(enforced_rules)
        output_files.append(dataset["output_path"])

        child_jobs.append({
            "dataset_id": item.dataset_id,
            "dataset_name": dataset["filename"],
            "table_name": table_name,
            "source_type": dataset.get("source_type", "unknown"),
            "rows_processed": audit["total_rows_processed"],
            "columns_masked": audit["pii_columns_masked"],
            "output_target": dataset["output_path"],
            "admin_locked_rules_enforced": enforced_rules,
        })

    job_ended_at = datetime.now()
    duration_seconds = round((job_ended_at - job_started_at).total_seconds(), 2)

    jobs[job_id] = {
        "job_id": job_id,
        "dataset_id": "MULTI_TABLE",
        "dataset_name": f"{len(child_jobs)} tables",
        "source_type": "multi_table_databricks_schema_generated",
        "user_role": request.user_role,
        "admin_locked_rules_enforced": all_enforced_rules,
        "status": "COMPLETED",
        "created_at": job_started_at.isoformat(),
        "job_started_at": job_started_at.isoformat(),
        "job_ended_at": job_ended_at.isoformat(),
        "duration_seconds": duration_seconds,
        "rows_processed": total_rows_processed,
        "tables_processed": len(child_jobs),
        "columns_masked": total_columns_masked,
        "execution_mode": "Databricks Jobs API orchestration",
        "output_target": "MULTI_TABLE_OUTPUT",
        "output_files": output_files,
        "child_jobs": child_jobs,
        "preview": {
            "before": combined_before_preview[:20],
            "after": combined_after_preview[:20],
        },
        "audit": {
            "total_rows_processed": total_rows_processed,
            "tables_processed": len(child_jobs),
            "pii_columns_masked": total_columns_masked,
            "rules_applied": sorted(list(set(all_rules_applied))),
            "output_target": "MULTI_TABLE_OUTPUT",
            "run_status": "Success",
            "execution_mode": "Databricks Jobs API orchestration",
            "admin_locked_rules_enforced": all_enforced_rules,
            "child_jobs": child_jobs,
        },
    }

    return {
        "status": "COMPLETED",
        "message": "Multi-table anonymization job completed successfully",
        "job_id": job_id,
        "tables_processed": len(child_jobs),
        "rows_processed": total_rows_processed,
        "columns_masked": total_columns_masked,
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

    job = jobs[job_id]

    if job.get("output_files"):
        zip_path = os.path.join(OUTPUT_DIR, f"masked_outputs_{job_id}.zip")

        with zipfile.ZipFile(zip_path, "w") as zip_file:
            for output_file in job["output_files"]:
                if os.path.exists(output_file):
                    zip_file.write(output_file, arcname=os.path.basename(output_file))

        return FileResponse(
            path=zip_path,
            filename=f"masked_outputs_{job_id}.zip",
            media_type="application/zip",
        )

    output_path = job["output_target"]

    if not os.path.exists(output_path):
        return {
            "status": "NOT_FOUND",
            "message": "Masked output file not found. Please run an anonymization job first.",
        }

    dataset_name = job.get("dataset_name", "output.csv")

    return FileResponse(
        path=output_path,
        filename=f"masked_{dataset_name}",
        media_type="text/csv",
    )

