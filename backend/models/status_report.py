from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base


class StatusReport(Base):
    __tablename__ = "status_reports"

    id = Column(Integer, primary_key=True, index=True)
    submitter_name = Column(String(120), nullable=False)
    submitter_email = Column(String(200), nullable=False)
    department = Column(String(100), nullable=False)
    period = Column(String(50), nullable=False)          # e.g. "2026-W20" or "2026-05"
    period_label = Column(String(100), nullable=False)   # human-readable
    accomplishments = Column(Text, nullable=False)
    blockers = Column(Text, nullable=True, default="")
    next_steps = Column(Text, nullable=True, default="")
    overall_status = Column(String(20), nullable=False, default="on-track")  # on-track | at-risk | blocked
    created_at = Column(DateTime(timezone=True), server_default=func.now())
