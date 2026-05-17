from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models.status_report import StatusReport
from schemas.status_report import StatusReportCreate, StatusReportOut, StatusReportSummary

router = APIRouter(prefix="/status-reports", tags=["Status Reports"])


@router.post("", response_model=StatusReportOut, status_code=201)
def submit_report(payload: StatusReportCreate, db: Session = Depends(get_db)):
    """Submit a status report (public — no auth required so any team member can submit)."""
    report = StatusReport(**payload.model_dump())
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("", response_model=List[StatusReportOut])
def list_reports(
    period: Optional[str] = Query(None, description="Filter by period key e.g. 2026-W20"),
    department: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """List all reports, optionally filtered (executive view)."""
    q = db.query(StatusReport)
    if period:
        q = q.filter(StatusReport.period == period)
    if department:
        q = q.filter(StatusReport.department == department)
    return q.order_by(StatusReport.created_at.desc()).all()


@router.get("/periods", response_model=List[str])
def list_periods(db: Session = Depends(get_db)):
    """Return distinct period keys available."""
    rows = db.query(StatusReport.period).distinct().order_by(StatusReport.period.desc()).all()
    return [r[0] for r in rows]


@router.get("/summary/{period}", response_model=StatusReportSummary)
def get_summary(period: str, db: Session = Depends(get_db)):
    """Consolidated executive summary for a given period."""
    reports = (
        db.query(StatusReport)
        .filter(StatusReport.period == period)
        .order_by(StatusReport.created_at.asc())
        .all()
    )
    if not reports:
        raise HTTPException(status_code=404, detail="No reports found for this period")

    departments = sorted(set(r.department for r in reports))
    return StatusReportSummary(
        period=period,
        period_label=reports[0].period_label,
        total=len(reports),
        on_track=sum(1 for r in reports if r.overall_status == "on-track"),
        at_risk=sum(1 for r in reports if r.overall_status == "at-risk"),
        blocked=sum(1 for r in reports if r.overall_status == "blocked"),
        departments=departments,
        reports=[StatusReportOut.model_validate(r) for r in reports],
    )


@router.delete("/{report_id}", status_code=204)
def delete_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(StatusReport).filter(StatusReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    db.delete(report)
    db.commit()
