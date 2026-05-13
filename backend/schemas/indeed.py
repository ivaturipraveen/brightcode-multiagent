"""Pydantic schemas for Indeed-like job portal."""
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr


# ── Job Schemas ──────────────────────────────────────────────────────────────

class JobCreate(BaseModel):
    title: str
    company: str
    location: str
    job_type: str = "Full-Time"
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    description: str
    requirements: Optional[str] = None
    benefits: Optional[str] = None
    category: Optional[str] = None
    logo_url: Optional[str] = None


class JobUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    benefits: Optional[str] = None
    category: Optional[str] = None
    logo_url: Optional[str] = None
    is_active: Optional[str] = None


class JobOut(BaseModel):
    id: int
    title: str
    company: str
    location: str
    job_type: str
    salary_min: Optional[int]
    salary_max: Optional[int]
    description: str
    requirements: Optional[str]
    benefits: Optional[str]
    category: Optional[str]
    logo_url: Optional[str]
    is_active: str
    created_at: datetime
    application_count: Optional[int] = 0

    class Config:
        from_attributes = True


# ── Application Schemas ──────────────────────────────────────────────────────

class ApplicationCreate(BaseModel):
    job_id: int
    applicant_name: str
    applicant_email: str
    applicant_phone: Optional[str] = None
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    years_experience: Optional[int] = None


class ApplicationStatusUpdate(BaseModel):
    status: str  # submitted | under_review | interview | offer | hired | rejected
    reviewer_notes: Optional[str] = None


class ApplicationOut(BaseModel):
    id: int
    job_id: int
    applicant_name: str
    applicant_email: str
    applicant_phone: Optional[str]
    cover_letter: Optional[str]
    resume_url: Optional[str]
    linkedin_url: Optional[str]
    years_experience: Optional[int]
    status: str
    reviewer_notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    job: Optional[JobOut] = None

    class Config:
        from_attributes = True


# ── Search/Filter ─────────────────────────────────────────────────────────────

class JobSearchParams(BaseModel):
    q: Optional[str] = None          # keyword search
    location: Optional[str] = None
    job_type: Optional[str] = None
    category: Optional[str] = None
    salary_min: Optional[int] = None
