from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr


class StatusReportCreate(BaseModel):
    submitter_name: str
    submitter_email: EmailStr
    department: str
    period: str
    period_label: str
    accomplishments: str
    blockers: Optional[str] = ""
    next_steps: Optional[str] = ""
    overall_status: str = "on-track"


class StatusReportOut(BaseModel):
    id: int
    submitter_name: str
    submitter_email: str
    department: str
    period: str
    period_label: str
    accomplishments: str
    blockers: Optional[str]
    next_steps: Optional[str]
    overall_status: str
    created_at: datetime

    class Config:
        from_attributes = True


class StatusReportSummary(BaseModel):
    period: str
    period_label: str
    total: int
    on_track: int
    at_risk: int
    blocked: int
    departments: List[str]
    reports: List[StatusReportOut]
