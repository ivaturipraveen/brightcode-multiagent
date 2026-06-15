"""WFM What-If Scenario API routes."""
import math
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from models.wfm import WFMScenario, ScenarioStatus

router = APIRouter(prefix="/wfm", tags=["wfm"])


# ── Erlang C helper ──────────────────────────────────────────────────────────
def erlang_c(agents: int, traffic_intensity: float) -> float:
    """Return probability that a call has to wait (Erlang C formula)."""
    if agents <= traffic_intensity:
        return 1.0
    erlang_b_inv = 1.0
    for i in range(1, agents + 1):
        erlang_b_inv = 1.0 + erlang_b_inv * i / traffic_intensity
    ec = (1.0 / erlang_b_inv) / (1.0 - traffic_intensity / agents * (1.0 - 1.0 / erlang_b_inv))
    return min(ec, 1.0)


def compute_metrics(s: "ScenarioIn | WFMScenario"):
    """Return (required_agents, utilization_pct, gap, est_service_level)."""
    productive_hours = s.shift_hours * (1 - s.shrinkage_pct / 100)
    productive_seconds = productive_hours * 3600

    # Traffic intensity (Erlangs)
    traffic = (s.projected_volume * s.aht_seconds) / productive_seconds if productive_seconds > 0 else 0
    # Minimum agents needed (ceiling of traffic)
    min_agents = max(1, math.ceil(traffic))

    # Find N where service level >= target
    required = min_agents
    est_sl = 0.0
    for n in range(min_agents, min_agents + 200):
        ec = erlang_c(n, traffic)
        rho = traffic / n
        if rho >= 1:
            continue
        sl = 1 - ec * math.exp(-(n - traffic) * s.service_level_seconds / s.aht_seconds)
        if sl >= s.service_level_target / 100:
            required = n
            est_sl = round(sl * 100, 1)
            break
    else:
        required = min_agents + 200
        est_sl = 0.0

    utilization = round((traffic / required) * 100, 1) if required > 0 else 0.0
    gap = required - s.current_headcount
    return required, utilization, gap, est_sl


# ── Schemas ──────────────────────────────────────────────────────────────────
class ScenarioIn(BaseModel):
    name: str
    description: Optional[str] = ""
    status: Optional[ScenarioStatus] = ScenarioStatus.draft
    current_headcount: int = 50
    projected_volume: float = 500.0
    aht_seconds: float = 300.0
    shrinkage_pct: float = 20.0
    service_level_target: float = 80.0
    service_level_seconds: int = 20
    shift_hours: float = 8.0


class ScenarioOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    status: ScenarioStatus
    current_headcount: int
    projected_volume: float
    aht_seconds: float
    shrinkage_pct: float
    service_level_target: float
    service_level_seconds: int
    shift_hours: float
    required_agents: Optional[float]
    utilization_pct: Optional[float]
    gap: Optional[int]
    est_service_level: Optional[float]
    created_at: Optional[str]

    class Config:
        from_attributes = True


class ComputeIn(BaseModel):
    current_headcount: int = 50
    projected_volume: float = 500.0
    aht_seconds: float = 300.0
    shrinkage_pct: float = 20.0
    service_level_target: float = 80.0
    service_level_seconds: int = 20
    shift_hours: float = 8.0


class ComputeOut(BaseModel):
    required_agents: int
    utilization_pct: float
    gap: int
    est_service_level: float
    traffic_intensity: float


# ── Routes ───────────────────────────────────────────────────────────────────
@router.post("/compute", response_model=ComputeOut)
def compute_scenario(body: ComputeIn):
    """Live compute without saving — used for the interactive slider."""
    productive_seconds = body.shift_hours * 3600 * (1 - body.shrinkage_pct / 100)
    traffic = (body.projected_volume * body.aht_seconds) / productive_seconds if productive_seconds else 0
    req, util, gap, sl = compute_metrics(body)
    return {
        "required_agents": int(req),
        "utilization_pct": util,
        "gap": gap,
        "est_service_level": sl,
        "traffic_intensity": round(traffic, 2),
    }


@router.get("/scenarios", response_model=List[ScenarioOut])
def list_scenarios(db: Session = Depends(get_db)):
    rows = db.query(WFMScenario).order_by(WFMScenario.created_at.desc()).all()
    return rows


@router.post("/scenarios", response_model=ScenarioOut)
def create_scenario(body: ScenarioIn, db: Session = Depends(get_db)):
    req, util, gap, sl = compute_metrics(body)
    row = WFMScenario(
        **body.model_dump(),
        required_agents=req,
        utilization_pct=util,
        gap=gap,
        est_service_level=sl,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.get("/scenarios/{scenario_id}", response_model=ScenarioOut)
def get_scenario(scenario_id: int, db: Session = Depends(get_db)):
    row = db.query(WFMScenario).filter(WFMScenario.id == scenario_id).first()
    if not row:
        raise HTTPException(404, "Scenario not found")
    return row


@router.put("/scenarios/{scenario_id}", response_model=ScenarioOut)
def update_scenario(scenario_id: int, body: ScenarioIn, db: Session = Depends(get_db)):
    row = db.query(WFMScenario).filter(WFMScenario.id == scenario_id).first()
    if not row:
        raise HTTPException(404, "Scenario not found")
    req, util, gap, sl = compute_metrics(body)
    for k, v in body.model_dump().items():
        setattr(row, k, v)
    row.required_agents = req
    row.utilization_pct = util
    row.gap = gap
    row.est_service_level = sl
    db.commit()
    db.refresh(row)
    return row


@router.delete("/scenarios/{scenario_id}")
def delete_scenario(scenario_id: int, db: Session = Depends(get_db)):
    row = db.query(WFMScenario).filter(WFMScenario.id == scenario_id).first()
    if not row:
        raise HTTPException(404, "Scenario not found")
    db.delete(row)
    db.commit()
    return {"ok": True}
