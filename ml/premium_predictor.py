"""
premium_predictor.py
────────────────────
Model 1: Weekly Premium Prediction for Gig Workers
Inputs:  past disruptions, earnings history, risk features
Output:  weekly premium (₹), risk score (0–100), confidence
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import json

# ─── 1. Synthetic Training Data ───────────────────────────────────────────────
# In production, replace with your real DB records.
np.random.seed(42)

def generate_training_data(n=2000):
    records = []
    for _ in range(n):
        disruptions_month = np.random.randint(0, 12)
        avg_weekly_earnings = np.random.uniform(5000, 40000)
        aqi_avg = np.random.uniform(50, 300)
        weather_severity = np.random.uniform(0, 100)
        traffic_score = np.random.uniform(0, 100)
        worker_tenure_weeks = np.random.randint(1, 200)
        hex_zone_risk = np.random.uniform(0, 1)

        # Ground-truth premium formula (domain logic)
        base = 80
        income_factor = max(0, (30000 - avg_weekly_earnings) / 30000) * 70
        disruption_factor = disruptions_month * 11
        env_factor = (aqi_avg / 300) * 25 + (weather_severity / 100) * 20
        traffic_factor = (traffic_score / 100) * 15
        tenure_discount = min(20, worker_tenure_weeks * 0.1)
        noise = np.random.normal(0, 5)

        premium = base + income_factor + disruption_factor + env_factor + traffic_factor - tenure_discount + noise
        premium = max(60, min(300, premium))

        records.append({
            "disruptions_month": disruptions_month,
            "avg_weekly_earnings": avg_weekly_earnings,
            "aqi_avg": aqi_avg,
            "weather_severity": weather_severity,
            "traffic_score": traffic_score,
            "worker_tenure_weeks": worker_tenure_weeks,
            "hex_zone_risk": hex_zone_risk,
            "weekly_premium": round(premium, 2),
        })
    return pd.DataFrame(records)


# ─── 2. Feature Engineering ───────────────────────────────────────────────────
FEATURES = [
    "disruptions_month",
    "avg_weekly_earnings",
    "aqi_avg",
    "weather_severity",
    "traffic_score",
    "worker_tenure_weeks",
    "hex_zone_risk",
]

TARGET = "weekly_premium"


def compute_risk_score(row: dict) -> int:
    """
    Derive a 0–100 risk score from raw features.
    Higher = riskier worker/zone (higher premium warranted).
    """
    score = 0
    score += min(40, row.get("disruptions_month", 0) * 4)
    score += min(20, max(0, (30000 - row.get("avg_weekly_earnings", 20000)) / 30000 * 20))
    score += min(15, (row.get("aqi_avg", 100) / 300) * 15)
    score += min(15, (row.get("weather_severity", 0) / 100) * 15)
    score += min(10, (row.get("traffic_score", 0) / 100) * 10)
    return min(99, int(score))


# ─── 3. Train & Evaluate ─────────────────────────────────────────────────────
def train_model(save_path="premium_model.pkl"):
    df = generate_training_data(n=3000)

    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_sc = scaler.fit_transform(X_train)
    X_test_sc = scaler.transform(X_test)

    model = GradientBoostingRegressor(
        n_estimators=200,
        max_depth=4,
        learning_rate=0.08,
        subsample=0.85,
        random_state=42,
    )
    model.fit(X_train_sc, y_train)

    preds = model.predict(X_test_sc)
    mae = mean_absolute_error(y_test, preds)
    r2 = r2_score(y_test, preds)
    print(f"[PremiumModel] MAE: ₹{mae:.2f} | R²: {r2:.4f}")

    # Save artefacts
    joblib.dump({"model": model, "scaler": scaler, "features": FEATURES}, save_path)
    print(f"[PremiumModel] Saved to {save_path}")
    return model, scaler


# ─── 4. Inference ─────────────────────────────────────────────────────────────
def load_model(path="premium_model.pkl"):
    bundle = joblib.load(path)
    return bundle["model"], bundle["scaler"], bundle["features"]


def predict_premium(worker_data: dict, model_path="premium_model.pkl") -> dict:
    """
    Predict the weekly premium for a single worker.

    Parameters
    ----------
    worker_data : dict
        Keys must include all FEATURES:
        {
            "disruptions_month": 3,
            "avg_weekly_earnings": 18500,
            "aqi_avg": 180,
            "weather_severity": 55,
            "traffic_score": 70,
            "worker_tenure_weeks": 24,
            "hex_zone_risk": 0.62,
        }

    Returns
    -------
    dict
        {
            "weekly_premium": 134,
            "risk_score": 61,
            "confidence_pct": 89,
        }
    """
    model, scaler, features = load_model(model_path)

    row = pd.DataFrame([{f: worker_data.get(f, 0) for f in features}])
    row_sc = scaler.transform(row)

    premium = float(model.predict(row_sc)[0])
    premium = max(60, min(300, premium))

    risk = compute_risk_score(worker_data)

    # Confidence: higher when risk features are in a "seen" range
    staging_score = model.staged_predict(row_sc)
    staged_list = list(staging_score)
    variance = float(np.std([p[0] for p in staged_list[-20:]]))
    confidence = max(55, min(99, int(100 - variance * 1.5)))

    return {
        "weekly_premium": round(premium),
        "risk_score": risk,
        "confidence_pct": confidence,
    }


# ─── 5. FastAPI endpoint wrapper ─────────────────────────────────────────────
# Drop this into your main.py:
#
# from premium_predictor import predict_premium, train_model
# from fastapi import FastAPI
# from pydantic import BaseModel
#
# class WorkerInput(BaseModel):
#     disruptions_month: int
#     avg_weekly_earnings: float
#     aqi_avg: float
#     weather_severity: float
#     traffic_score: float
#     worker_tenure_weeks: int
#     hex_zone_risk: float
#
# @app.post("/predict/premium")
# def premium_endpoint(data: WorkerInput):
#     return predict_premium(data.dict())


# ─── CLI ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys

    if "--train" in sys.argv:
        train_model()
    else:
        # Quick demo prediction
        try:
            result = predict_premium({
                "disruptions_month": 4,
                "avg_weekly_earnings": 16000,
                "aqi_avg": 210,
                "weather_severity": 65,
                "traffic_score": 75,
                "worker_tenure_weeks": 18,
                "hex_zone_risk": 0.7,
            })
        except FileNotFoundError:
            print("[!] Model not trained yet. Run: python premium_predictor.py --train")
            print("[!] Running demo with untrained model...")
            train_model()
            result = predict_premium({
                "disruptions_month": 4,
                "avg_weekly_earnings": 16000,
                "aqi_avg": 210,
                "weather_severity": 65,
                "traffic_score": 75,
                "worker_tenure_weeks": 18,
                "hex_zone_risk": 0.7,
            })

        print(json.dumps(result, indent=2))