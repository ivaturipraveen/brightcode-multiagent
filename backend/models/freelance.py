from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime
from database import Base


def _now():
    return datetime.now(timezone.utc)


class FreelancerProfile(Base):
    __tablename__ = "freelancer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    bio = Column(Text, nullable=True)
    skills = Column(Text, nullable=True)           # JSON-encoded list stored as string
    hourly_rate = Column(Float, nullable=True)
    availability = Column(String, nullable=True)   # Full-time / Part-time / Contract
    rating = Column(Float, default=0.0)
    total_jobs = Column(Integer, default=0)
    location = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=_now)


class Job(Base):
    __tablename__ = "freelance_jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    budget_min = Column(Float, nullable=True)
    budget_max = Column(Float, nullable=True)
    budget_type = Column(String, default="fixed")  # fixed / hourly
    skills = Column(Text, nullable=True)           # JSON-encoded list
    status = Column(String, default="open")        # open / closed
    client_name = Column(String, nullable=False)
    client_email = Column(String, nullable=False)
    category = Column(String, nullable=True)
    is_remote = Column(Boolean, default=True)
    duration = Column(String, nullable=True)
    created_at = Column(DateTime, default=_now)


class Proposal(Base):
    __tablename__ = "freelance_proposals"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, nullable=False)
    freelancer_name = Column(String, nullable=False)
    freelancer_email = Column(String, nullable=False)
    cover_letter = Column(Text, nullable=True)
    bid_amount = Column(Float, nullable=True)
    status = Column(String, default="pending")     # pending / accepted / rejected
    created_at = Column(DateTime, default=_now)
