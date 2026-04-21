from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from database import get_db
from models.career import JobApplication

router = APIRouter(prefix="/careers", tags=["careers"])


class ApplicationRequest(BaseModel):
    job_title: str
    name: str
    email: EmailStr
    phone: str = ""
    linkedin: str = ""
    cover_letter: str = ""


class ApplicationResponse(BaseModel):
    id: int
    job_title: str
    name: str
    email: str
    message: str


@router.post("/apply", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply(payload: ApplicationRequest, db: Session = Depends(get_db)):
    existing = (
        db.query(JobApplication)
        .filter(
            JobApplication.email == payload.email.lower(),
            JobApplication.job_title == payload.job_title,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail="You have already applied for this position.",
        )

    app = JobApplication(
        job_title=payload.job_title.strip(),
        name=payload.name.strip(),
        email=payload.email.lower(),
        phone=payload.phone.strip(),
        linkedin=payload.linkedin.strip(),
        cover_letter=payload.cover_letter.strip(),
    )
    db.add(app)
    db.commit()
    db.refresh(app)

    return ApplicationResponse(
        id=app.id,
        job_title=app.job_title,
        name=app.name,
        email=app.email,
        message="Application received! We'll review it and get back to you soon.",
    )
