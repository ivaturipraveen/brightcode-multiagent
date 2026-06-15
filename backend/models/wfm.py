"""WFM (Workforce Management) What-If Scenario models."""
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Enum as SAEnum
from sqlalchemy.sql import func
from database import Base
import enum


class ScenarioStatus(str, enum.Enum):
    draft = "draft"
    active = "active"
    archived = "archived"


class WFMScenario(Base):
    __tablename__ = "wfm_scenarios"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, default="")
    status = Column(SAEnum(ScenarioStatus), default=ScenarioStatus.draft)

    # Inputs
    current_headcount = Column(Integer, default=0)
    projected_volume = Column(Float, default=0.0)   # calls/tasks per day
    aht_seconds = Column(Float, default=300.0)       # avg handle time
    shrinkage_pct = Column(Float, default=20.0)      # shrinkage %
    service_level_target = Column(Float, default=80.0)  # % answered in threshold
    service_level_seconds = Column(Integer, default=20)  # SL threshold (seconds)
    shift_hours = Column(Float, default=8.0)

    # Computed outputs (cached)
    required_agents = Column(Float, nullable=True)
    utilization_pct = Column(Float, nullable=True)
    gap = Column(Integer, nullable=True)             # required - current
    est_service_level = Column(Float, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
