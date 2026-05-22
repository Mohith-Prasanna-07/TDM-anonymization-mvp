import hashlib
import random
from datetime import datetime, timedelta

import pandas as pd
from faker import Faker


fake = Faker()


def hash_value(value):
    if pd.isna(value):
        return value

    return hashlib.sha256(str(value).encode()).hexdigest()[:8]


def partial_mask(value):
    if pd.isna(value):
        return value

    value = str(value)

    if len(value) <= 4:
        return "*" * len(value)

    return value[:2] + "*" * (len(value) - 4) + value[-2:]


def shift_date(value):
    if pd.isna(value):
        return value

    try:
        original_date = datetime.strptime(str(value), "%Y-%m-%d")
        shift_days = random.randint(30, 180)
        shifted_date = original_date + timedelta(days=shift_days)
        return shifted_date.strftime("%Y-%m-%d")
    except Exception:
        return value


def fake_value(value):
    if pd.isna(value):
        return value

    value = str(value)

    # Email-like values
    if "@" in value:
        return fake.email()

    # SSN-like values
    if len(value.replace("-", "")) == 9 and value.replace("-", "").isdigit():
        return fake.ssn()

    # Phone-like values
    if value.replace("-", "").replace(" ", "").replace("(", "").replace(")", "").isdigit():
        return fake.phone_number()

    # Date-like values should be handled by Date Shift, but fallback safely
    try:
        datetime.strptime(value, "%Y-%m-%d")
        return shift_date(value)
    except Exception:
        pass

    # Default fake value
    return fake.name()


def apply_rule(value, rule):
    if rule == "Hash":
        return hash_value(value)

    if rule == "Fake Value":
        return fake_value(value)

    if rule == "Partial Masking":
        return partial_mask(value)

    if rule == "Date Shift":
        return shift_date(value)

    return value


def apply_masking_rules(df, masking_rules):
    masked_df = df.copy()
    applied_rules = {}

    for column_name, rule in masking_rules.items():
        if column_name in masked_df.columns and rule != "No Masking":
            masked_df[column_name] = masked_df[column_name].apply(
                lambda value: apply_rule(value, rule)
            )
            applied_rules[column_name] = rule

    return masked_df, applied_rules


def run_local_anonymization(input_path, output_path, masking_rules):
    source_df = pd.read_csv(input_path)

    masked_df, applied_rules = apply_masking_rules(source_df, masking_rules)

    masked_df.to_csv(output_path, index=False)

    audit = {
        "total_rows_processed": len(source_df),
        "tables_processed": 1,
        "pii_columns_masked": len(applied_rules),
        "rules_applied": [f"{column}: {rule}" for column, rule in applied_rules.items()],
        "output_target": output_path,
        "run_status": "Success",
        "execution_mode": "Local Pandas masking engine with dynamic rules",
    }

    preview = {
        "before": source_df.head(5).to_dict(orient="records"),
        "after": masked_df.head(5).to_dict(orient="records"),
    }

    return preview, audit