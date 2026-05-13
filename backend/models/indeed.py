"""Indeed-like job portal models."""
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from database import Base


class IndeedJob(Base):
    __tablename__ = "indeed_jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    company = Column(String(200), nullable=False)
    location = Column(String(200), nullable=False)
    job_type = Column(String(50), nullable=False, default="Full-Time")  # Full-Time, Part-Time, Contract, Remote
    salary_min = Column(Integer, nullable=True)
    salary_max = Column(Integer, nullable=True)
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=True)
    benefits = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)  # Engineering, Design, Marketing, etc.
    logo_url = Column(String(500), nullable=True)
    is_active = Column(String(10), default="active")  # active, closed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    applications = relationship("IndeedApplication", back_populates="job", cascade="all, delete-orphan")


class IndeedApplication(Base):
    __tablename__ = "indeed_applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("indeed_jobs.id"), nullable=False)
    applicant_name = Column(String(200), nullable=False)
    applicant_email = Column(String(200), nullable=False)
    applicant_phone = Column(String(50), nullable=True)
    cover_letter = Column(Text, nullable=True)
    resume_url = Column(String(500), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    years_experience = Column(Integer, nullable=True)
    # Status flow: submitted → under_review → interview → offer → hired / rejected
    status = Column(String(50), default="submitted")
    reviewer_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    job = relationship("IndeedJob", back_populates="applications")
