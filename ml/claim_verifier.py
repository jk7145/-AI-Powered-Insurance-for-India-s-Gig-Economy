"""
claim_verifier.py
─────────────────
Model 2: Parametric Claim Verification for Gig Workers
Inputs:  GPS match, activity drop, H3 zone match, disruption log, threshold
Output:  approve / reject + confidence score (0–100)
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import joblib
import json

# ─── 1. Synthetic Training Data ───────────────────────────────────────────────
np.random.seed(7)

def generate_claim_data(n=3000):
    records = []
    for _ in range(n):
        # Raw signal features
        gps_match = np.random.choice([0, 1], p=[0.25, 0.75])
        activity_drop_pct = np.random.uniform(0, 100)  # % drop in gig activity
        zone_match = np.random.choice([0, 1], p=[0.3, 0.7])
        disruption_event_logged = np.random.choice([0, 1], p=[0.35, 0.65])
        parametric_threshold_met = np.random.choice([0, 1], p=[0.4, 0.6])
        worker_history_fraud_flag = np.random.choice([0, 1], p=[0.9, 0.1])
        time_since_disruption_hrs = np.random.uniform(0, 72)
        zone_disruption_severity = np.random.uniform(0, 100)

        # Ground-truth label
        checks_passed = sum([
            gps_match,
            activity_drop_pct > 40,
            zone_match,
            disruption_event_logged,
            parametric_threshold_met,
        ])
        fraud_penalty = worker_history_fraud_flag * 2
        label = 1 if (checks_passed - fraud_penalty >= 3) else 0

        records.append({
            "gps_match": gps_match,
            "activity_drop_pct": activity_drop_pct,
            "zone_match": zone_match,
            "disruption_event_logged": disruption_event_logged,
            "parametric_threshold_met": parametric_threshold_met,
            "worker_history_fraud_flag": worker_history_fraud_flag,
            "time_since_disruption_hrs": time_since_disruption_hrs,
            "zone_disruption_severity": zone_disruption_severity,
            "approved": label,
        })
    return pd.DataFrame(records)


# ─── 2. Features ─────────────────────────────────────────────────────────────
FEATURES = [
    "gps_match",
    "activity_drop_pct",
    "zone_match",
    "disruption_event_logged",
    "parametric_threshold_met",
    "worker_history_fraud_flag",
    "time_since_disruption_hrs",
    "zone_disruption_severity",
]

TARGET = "approved"


# ─── 3. 5-Point Rule Engine (Parametric Layer) ───────────────────────────────
def parametric_verify(claim: dict) -> dict:
    """
    Hard-coded parametric rules that run BEFORE the ML model.
    If all 5 pass  → auto-approve (bypass model).
    If ≤1 passes   → auto-reject (bypass model).
    Otherwise      → forward to ML model for nuanced decision.
    """
    checks = {
        "gps_in_disrupted_zone": bool(claim.get("gps_match")),
        "activity_drop_significant": claim.get("activity_drop_pct", 0) > 40,
        "h3_zone_matched": bool(claim.get("zone_match")),
        "disruption_event_logged": bool(claim.get("disruption_event_logged")),
        "parametric_threshold_met": bool(claim.get("parametric_threshold_met")),
    }
    passed = sum(checks.values())
    return {"checks": checks, "passed": passed}


# ─── 4. Train & Evaluate ─────────────────────────────────────────────────────
def train_model(save_path="claim_model.pkl"):
    df = generate_claim_data(n=4000)

    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_sc = scaler.fit_transform(X_train)
    X_test_sc = scaler.transform(X_test)

    model = RandomForestClassifier(
        n_estimators=150,
        max_depth=8,
        min_samples_leaf=5,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train_sc, y_train)

    preds = model.predict(X_test_sc)
    print("[ClaimModel] Classification Report:")
    print(classification_report(y_test, preds, target_names=["Rejected", "Approved"]))
    print("[ClaimModel] Confusion Matrix:")
    print(confusion_matrix(y_test, preds))

    joblib.dump({"model": model, "scaler": scaler, "features": FEATURES}, save_path)
    print(f"[ClaimModel] Saved to {save_path}")
    return model, scaler


# ─── 5. Inference ─────────────────────────────────────────────────────────────
def load_model(path="claim_model.pkl"):
    bundle = joblib.load(path)
    return bundle["model"], bundle["scaler"], bundle["features"]


def verify_claim(claim_data: dict, model_path="claim_model.pkl") -> dict:
    """
    Verify a gig worker's disruption claim.

    Parameters
    ----------
    claim_data : dict
        {
            "claim_id": "CLM-4821",
            "worker_id": "WKR-992",
            "gps_match": 1,
            "activity_drop_pct": 67.4,
            "zone_match": 1,
            "disruption_event_logged": 1,
            "parametric_threshold_met": 1,
            "worker_history_fraud_flag": 0,
            "time_since_disruption_hrs": 3.5,
            "zone_disruption_severity": 82.0,
        }

    Returns
    -------
    dict
        {
            "claim_id": "CLM-4821",
            "verdict": "approved",
            "confidence_pct": 93,
            "checks": { ... },
            "checks_passed": 5,
            "reason": "All 5 parametric checks passed — auto-approved",
        }
    """
    claim_id = claim_data.get("claim_id", "UNKNOWN")

    # Step 1: Parametric rule engine
    param_result = parametric_verify(claim_data)
    checks = param_result["checks"]
    passed = param_result["passed"]

    # Auto-approve: all 5 checks pass
    if passed == 5:
        return {
            "claim_id": claim_id,
            "verdict": "approved",
            "confidence_pct": 98,
            "checks": checks,
            "checks_passed": passed,
            "reason": "All 5 parametric checks passed — auto-approved",
        }

    # Auto-reject: ≤1 check passes
    if passed <= 1:
        return {
            "claim_id": claim_id,
            "verdict": "rejected",
            "confidence_pct": 96,
            "checks": checks,
            "checks_passed": passed,
            "reason": "Too few checks passed — insufficient evidence",
        }

    # Step 2: ML model for borderline cases (2–4 checks passing)
    model, scaler, features = load_model(model_path)

    row = pd.DataFrame([{f: claim_data.get(f, 0) for f in features}])
    row_sc = scaler.transform(row)

    proba = model.predict_proba(row_sc)[0]
    approve_prob = proba[1]
    verdict = "approved" if approve_prob >= 0.5 else "rejected"
    confidence = int(max(approve_prob, 1 - approve_prob) * 100)

    return {
        "claim_id": claim_id,
        "verdict": verdict,
        "confidence_pct": confidence,
        "checks": checks,
        "checks_passed": passed,
        "reason": f"ML model decision ({passed}/5 checks passed, approve_prob={approve_prob:.2f})",
    }


# ─── 6. Batch Processing ─────────────────────────────────────────────────────
def batch_verify(claims: list, model_path="claim_model.pkl") -> list:
    """Verify multiple claims at once. Returns list of result dicts."""
    return [verify_claim(c, model_path) for c in claims]


# ─── 7. FastAPI endpoint wrapper ─────────────────────────────────────────────
# Drop this into your main.py:
#
# from claim_verifier import verify_claim, train_model
# from fastapi import FastAPI
# from pydantic import BaseModel
#
# class ClaimInput(BaseModel):
#     claim_id: str
#     worker_id: str
#     gps_match: int
#     activity_drop_pct: float
#     zone_match: int
#     disruption_event_logged: int
#     parametric_threshold_met: int
#     worker_history_fraud_flag: int
#     time_since_disruption_hrs: float
#     zone_disruption_severity: float
#
# @app.post("/verify/claim")
# def claim_endpoint(data: ClaimInput):
#     return verify_claim(data.dict())


# ─── CLI ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys

    if "--train" in sys.argv:
        train_model()
    else:
        sample_claim = {
            "claim_id": "CLM-4821",
            "worker_id": "WKR-992",
            "gps_match": 1,
            "activity_drop_pct": 67.4,
            "zone_match": 1,
            "disruption_event_logged": 1,
            "parametric_threshold_met": 1,
            "worker_history_fraud_flag": 0,
            "time_since_disruption_hrs": 3.5,
            "zone_disruption_severity": 82.0,
        }

        try:
            result = verify_claim(sample_claim)
        except FileNotFoundError:
            print("[!] Model not trained. Running: python claim_verifier.py --train")
            train_model()
            result = verify_claim(sample_claim)

        print(json.dumps(result, indent=2))