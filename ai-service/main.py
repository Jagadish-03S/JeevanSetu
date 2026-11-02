"""
JEEVANSETU - AI Coordination & Prioritization Microservice (Python FastAPI)

IMPORTANT MEDICAL DISCLAIMER:
This AI service assists with operational logistics, request prioritization,
and anomaly screening ONLY. It NEVER provides clinical diagnosis, determines
transfusion compatibility, or replaces authorized healthcare professionals.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import math

app = FastAPI(
    title="JEEVANSETU AI Prioritization Service",
    description="Operational queue prioritization and duplicate anomaly detection for blood coordination",
    version="1.0.0"
)

# Standard Informational Red Cell Compatibility Chart
COMPATIBILITY = {
    "A+": ["A+", "A-", "O+", "O-"],
    "A-": ["A-", "O-"],
    "B+": ["B+", "B-", "O+", "O-"],
    "B-": ["B-", "O-"],
    "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    "AB-": ["AB-", "A-", "B-", "O-"],
    "O+": ["O+", "O-"],
    "O-": ["O-"],
    "Bombay (hh)": ["Bombay (hh)"]
}

COMPONENT_FACTORS = {
    "Single Donor Platelet (SDP)": 1.5,
    "Platelet Concentrate (PRP)": 1.4,
    "Fresh Frozen Plasma (FFP)": 1.1,
    "Cryoprecipitate": 1.1,
    "Packed Red Blood Cells (PRBC)": 1.2,
    "Whole Blood": 1.0
}

class PrioritizationRequest(BaseModel):
    blood_group: str
    component: str = "Packed Red Blood Cells (PRBC)"
    urgency_tier: str
    units_requested: int = Field(ge=1, le=20)
    is_verified: bool = False

class DonorCandidate(BaseModel):
    donor_id: str
    blood_group: str
    district: str
    lat: float
    lng: float
    days_since_last_donation: int
    is_available: bool

class MatchingQuery(BaseModel):
    patient_blood_group: str
    hospital_district: str
    hospital_lat: float
    hospital_lng: float
    candidates: List[DonorCandidate]

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

@app.get("/")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "JEEVANSETU AI Prioritization Engine",
        "advisory": "Informational coordination tool only. Medical clearance strictly governed by NBTC."
    }

@app.post("/api/ai/prioritize")
def calculate_priority(req: PrioritizationRequest):
    score = 50.0

    if "< 4 hrs" in req.urgency_tier or "Critical" in req.urgency_tier:
        score += 35.0
    elif "< 12 hrs" in req.urgency_tier or "Urgent" in req.urgency_tier:
        score += 20.0
    else:
        score += 5.0

    multiplier = COMPONENT_FACTORS.get(req.component, 1.0)
    score = score * multiplier

    if req.blood_group in ["O-", "Bombay (hh)", "AB-"]:
        score += 10.0

    final_score = min(100, int(score))

    return {
        "priority_score": final_score,
        "urgency_tier": req.urgency_tier,
        "component": req.component,
        "recommendation": "High queue placement for hospital verification" if final_score >= 80 else "Standard coordination queue"
    }

@app.post("/api/ai/screen-donors")
def screen_donors(query: MatchingQuery):
    compatible_groups = COMPATIBILITY.get(query.patient_blood_group, [query.patient_blood_group])
    screened = []

    for d in query.candidates:
        if not d.is_available:
            continue
        if d.blood_group not in compatible_groups:
            continue

        dist = haversine_km(query.hospital_lat, query.hospital_lng, d.lat, d.lng)
        if dist > 35.0 and d.district.lower() != query.hospital_district.lower():
            continue

        score = 0
        score += 40 if d.blood_group == query.patient_blood_group else 25
        score += 40 if dist <= 5 else 30 if dist <= 15 else 20
        score += 20 if d.days_since_last_donation >= 90 else 0

        screened.append({
            "donor_id": d.donor_id,
            "blood_group": d.blood_group,
            "distance_km": dist,
            "match_rank_score": score,
            "eligible_interval": d.days_since_last_donation >= 90
        })

    screened.sort(key=lambda x: x["match_rank_score"], reverse=True)

    return {
        "patient_blood_group": query.patient_blood_group,
        "screened_count": len(screened),
        "candidates": screened,
        "notice": "Donor contact details are protected and require explicit consent prior to disclosure."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

