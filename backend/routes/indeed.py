"""Indeed-like job portal API routes."""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models.indeed import IndeedApplication, IndeedJob
from schemas.indeed import (
    ApplicationCreate,
    ApplicationOut,
    ApplicationStatusUpdate,
    JobCreate,
    JobOut,
    JobUpdate,
)

router = APIRouter(prefix="/api/indeed", tags=["indeed"])


# ─────────────────────────────────────────────────────────────────────────────
# JOBS
# ─────────────────────────────────────────────────────────────────────────────


@router.get("/jobs", response_model=List[JobOut])
def list_jobs(
    q: Optional[str] = Query(None, description="Keyword search in title/company/description"),
    location: Optional[str] = Query(None),
    job_type: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    salary_min: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(IndeedJob).filter(IndeedJob.is_active == "active")

    if q:
        like = f"%{q}%"
        query = query.filter(
            IndeedJob.title.ilike(like)
            | IndeedJob.company.ilike(like)
            | IndeedJob.description.ilike(like)
        )
    if location:
        query = query.filter(IndeedJob.location.ilike(f"%{location}%"))
    if job_type:
        query = query.filter(IndeedJob.job_type == job_type)
    if category:
        query = query.filter(IndeedJob.category == category)
    if salary_min is not None:
        query = query.filter(IndeedJob.salary_min >= salary_min)

    jobs = query.order_by(IndeedJob.created_at.desc()).offset(skip).limit(limit).all()

    result = []
    for job in jobs:
        job_data = JobOut.model_validate(job)
        job_data.application_count = len(job.applications)
        result.append(job_data)
    return result


@router.post("/jobs", response_model=JobOut, status_code=201)
def create_job(payload: JobCreate, db: Session = Depends(get_db)):
    job = IndeedJob(**payload.model_dump())
    db.add(job)
    db.commit()
    db.refresh(job)
    job_data = JobOut.model_validate(job)
    job_data.application_count = 0
    return job_data


@router.get("/jobs/{job_id}", response_model=JobOut)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(IndeedJob).filter(IndeedJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    job_data = JobOut.model_validate(job)
    job_data.application_count = len(job.applications)
    return job_data


@router.put("/jobs/{job_id}", response_model=JobOut)
def update_job(job_id: int, payload: JobUpdate, db: Session = Depends(get_db)):
    job = db.query(IndeedJob).filter(IndeedJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(job, field, value)
    db.commit()
    db.refresh(job)
    job_data = JobOut.model_validate(job)
    job_data.application_count = len(job.applications)
    return job_data


@router.delete("/jobs/{job_id}", status_code=204)
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(IndeedJob).filter(IndeedJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()


# ─────────────────────────────────────────────────────────────────────────────
# APPLICATIONS
# ─────────────────────────────────────────────────────────────────────────────


@router.post("/apply", response_model=ApplicationOut, status_code=201)
def apply_for_job(payload: ApplicationCreate, db: Session = Depends(get_db)):
    # Validate job exists
    job = db.query(IndeedJob).filter(
        IndeedJob.id == payload.job_id, IndeedJob.is_active == "active"
    ).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found or no longer active")

    # Prevent duplicate applications from same email
    existing = db.query(IndeedApplication).filter(
        IndeedApplication.job_id == payload.job_id,
        IndeedApplication.applicant_email == payload.applicant_email,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="You have already applied for this job")

    application = IndeedApplication(**payload.model_dump())
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


@router.get("/applications/track", response_model=List[ApplicationOut])
def track_applications(email: str = Query(..., description="Applicant email"), db: Session = Depends(get_db)):
    """Public endpoint: job seekers can track their own applications by email."""
    applications = (
        db.query(IndeedApplication)
        .filter(IndeedApplication.applicant_email == email)
        .order_by(IndeedApplication.created_at.desc())
        .all()
    )
    return applications


@router.get("/applications/{application_id}", response_model=ApplicationOut)
def get_application(application_id: int, db: Session = Depends(get_db)):
    app = db.query(IndeedApplication).filter(IndeedApplication.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app


@router.get("/jobs/{job_id}/applications", response_model=List[ApplicationOut])
def list_applications_for_job(
    job_id: int,
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """Admin: list all applications for a specific job."""
    job = db.query(IndeedJob).filter(IndeedJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    query = db.query(IndeedApplication).filter(IndeedApplication.job_id == job_id)
    if status:
        query = query.filter(IndeedApplication.status == status)
    return query.order_by(IndeedApplication.created_at.desc()).all()


@router.patch("/applications/{application_id}/status", response_model=ApplicationOut)
def update_application_status(
    application_id: int,
    payload: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
):
    """Admin: update the status of an application."""
    valid_statuses = {"submitted", "under_review", "interview", "offer", "hired", "rejected"}
    if payload.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}",
        )

    app = db.query(IndeedApplication).filter(IndeedApplication.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    app.status = payload.status
    if payload.reviewer_notes is not None:
        app.reviewer_notes = payload.reviewer_notes
    db.commit()
    db.refresh(app)
    return app


# ─────────────────────────────────────────────────────────────────────────────
# STATS
# ─────────────────────────────────────────────────────────────────────────────


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total_jobs = db.query(IndeedJob).filter(IndeedJob.is_active == "active").count()
    total_applications = db.query(IndeedApplication).count()
    total_companies = db.query(IndeedJob.company).distinct().count()
    return {
        "total_jobs": total_jobs,
        "total_applications": total_applications,
        "total_companies": total_companies,
    }
