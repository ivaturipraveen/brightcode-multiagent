"""Seed WFM what-if scenarios."""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal
from models.wfm import WFMScenario, ScenarioStatus
from routes.wfm import compute_metrics


SEED = [
    dict(
        name="Baseline — Current State",
        description="Current staffing vs today's inbound volume. Use as baseline comparison.",
        status=ScenarioStatus.active,
        current_headcount=60,
        projected_volume=800,
        aht_seconds=280,
        shrinkage_pct=18,
        service_level_target=80,
        service_level_seconds=20,
        shift_hours=8,
    ),
    dict(
        name="Black Friday Peak (+40% volume)",
        description="Black Friday surge scenario. Volume spikes 40% over baseline.",
        status=ScenarioStatus.draft,
        current_headcount=60,
        projected_volume=1120,
        aht_seconds=280,
        shrinkage_pct=18,
        service_level_target=80,
        service_level_seconds=20,
        shift_hours=8,
    ),
    dict(
        name="Reduce AHT to 240s (coaching initiative)",
        description="Impact of a coaching programme targeting 240s AHT. Same volume and headcount.",
        status=ScenarioStatus.draft,
        current_headcount=60,
        projected_volume=800,
        aht_seconds=240,
        shrinkage_pct=18,
        service_level_target=80,
        service_level_seconds=20,
        shift_hours=8,
    ),
    dict(
        name="SL Target Upgrade 80→90%",
        description="What staffing is needed if we raise the SL target to 90%?",
        status=ScenarioStatus.draft,
        current_headcount=60,
        projected_volume=800,
        aht_seconds=280,
        shrinkage_pct=18,
        service_level_target=90,
        service_level_seconds=20,
        shift_hours=8,
    ),
    dict(
        name="Shrinkage rises to 28%",
        description="High PTO season impact — shrinkage rises from 18% to 28%.",
        status=ScenarioStatus.draft,
        current_headcount=60,
        projected_volume=800,
        aht_seconds=280,
        shrinkage_pct=28,
        service_level_target=80,
        service_level_seconds=20,
        shift_hours=8,
    ),
    dict(
        name="Lean Team — 45 agents",
        description="Headcount reduction scenario. What happens if we cut to 45 agents?",
        status=ScenarioStatus.archived,
        current_headcount=45,
        projected_volume=800,
        aht_seconds=280,
        shrinkage_pct=18,
        service_level_target=80,
        service_level_seconds=20,
        shift_hours=8,
    ),
]


def run():
    db = SessionLocal()
    try:
        existing = db.query(WFMScenario).count()
        if existing >= len(SEED):
            print(f"[seed_wfm] Already seeded ({existing} rows). Skipping.")
            return
        for s in SEED:
            class _Obj:
                pass
            obj = _Obj()
            for k, v in s.items():
                setattr(obj, k, v)
            req, util, gap, sl = compute_metrics(obj)
            row = WFMScenario(
                **s,
                required_agents=req,
                utilization_pct=util,
                gap=gap,
                est_service_level=sl,
            )
            db.add(row)
        db.commit()
        print(f"[seed_wfm] Seeded {len(SEED)} WFM scenarios.")
    finally:
        db.close()


if __name__ == "__main__":
    from database import Base, engine
    from models import wfm as _wfm  # noqa
    Base.metadata.create_all(bind=engine)
    run()
