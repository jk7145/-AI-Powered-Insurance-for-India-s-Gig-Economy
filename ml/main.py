from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from premium_predictor import predict_premium
from claim_verifier import verify_claim

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class WorkerInput(BaseModel):
    disruptions_month: int
    avg_weekly_earnings: float
    aqi_avg: float
    weather_severity: float
    traffic_score: float
    worker_tenure_weeks: int
    hex_zone_risk: float

class ClaimInput(BaseModel):
    claim_id: str
    worker_id: str
    gps_match: int
    activity_drop_pct: float
    zone_match: int
    disruption_event_logged: int
    parametric_threshold_met: int
    worker_history_fraud_flag: int
    time_since_disruption_hrs: float
    zone_disruption_severity: float

@app.post("/predict/premium")
def premium_endpoint(data: WorkerInput):
    return predict_premium(data.dict())

@app.post("/verify/claim")
def claim_endpoint(data: ClaimInput):
    return verify_claim(data.dict())