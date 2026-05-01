import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models.freelance import FreelancerProfile, Job, Proposal

router = APIRouter(prefix="/freelance", tags=["freelance"])


# ─── Pydantic schemas ────────────────────────────────────────────────────────

class JobCreate(BaseModel):
    title: str
    description: str
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    budget_type: str = "fixed"
    skills: Optional[list[str]] = []
    client_name: str
    client_email: str
    category: Optional[str] = None
    is_remote: bool = True
    duration: Optional[str] = None


class ProposalCreate(BaseModel):
    freelancer_name: str
    freelancer_email: str
    cover_letter: Optional[str] = None
    bid_amount: Optional[float] = None


class FreelancerCreate(BaseModel):
    name: str
    title: str
    bio: Optional[str] = None
    skills: Optional[list[str]] = []
    hourly_rate: Optional[float] = None
    location: Optional[str] = None
    availability: Optional[str] = "Full-time"


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _job_out(j: Job) -> dict:
    return {
        "id": j.id,
        "title": j.title,
        "description": j.description,
        "budget_min": j.budget_min,
        "budget_max": j.budget_max,
        "budget_type": j.budget_type,
        "skills": json.loads(j.skills) if j.skills else [],
        "status": j.status,
        "client_name": j.client_name,
        "client_email": j.client_email,
        "category": j.category,
        "is_remote": j.is_remote,
        "duration": j.duration,
        "created_at": j.created_at.isoformat() if j.created_at else None,
    }


def _freelancer_out(f: FreelancerProfile) -> dict:
    return {
        "id": f.id,
        "name": f.name,
        "title": f.title,
        "bio": f.bio,
        "skills": json.loads(f.skills) if f.skills else [],
        "hourly_rate": f.hourly_rate,
        "availability": f.availability,
        "rating": f.rating,
        "total_jobs": f.total_jobs,
        "location": f.location,
        "avatar_url": f.avatar_url,
        "created_at": f.created_at.isoformat() if f.created_at else None,
    }


# ─── Routes ──────────────────────────────────────────────────────────────────

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    return {
        "total_jobs": db.query(Job).count(),
        "total_freelancers": db.query(FreelancerProfile).count(),
        "total_proposals": db.query(Proposal).count(),
    }


@router.get("/jobs")
def list_jobs(
    category: Optional[str] = Query(None),
    is_remote: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Job).filter(Job.status == "open")
    if category:
        q = q.filter(Job.category == category)
    if is_remote is not None:
        q = q.filter(Job.is_remote == is_remote)
    if search:
        term = f"%{search}%"
        q = q.filter(
            Job.title.ilike(term) | Job.description.ilike(term)
        )
    return [_job_out(j) for j in q.order_by(Job.created_at.desc()).all()]


@router.post("/jobs", status_code=201)
def create_job(payload: JobCreate, db: Session = Depends(get_db)):
    job = Job(
        title=payload.title,
        description=payload.description,
        budget_min=payload.budget_min,
        budget_max=payload.budget_max,
        budget_type=payload.budget_type,
        skills=json.dumps(payload.skills or []),
        client_name=payload.client_name,
        client_email=payload.client_email,
        category=payload.category,
        is_remote=payload.is_remote,
        duration=payload.duration,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return _job_out(job)


@router.get("/jobs/{job_id}")
def get_job(job_id: int, db: Session = Depends(get_db)):
    j = db.query(Job).filter(Job.id == job_id).first()
    if not j:
        raise HTTPException(status_code=404, detail="Job not found")
    return _job_out(j)


@router.post("/jobs/{job_id}/proposals", status_code=201)
def submit_proposal(job_id: int, payload: ProposalCreate, db: Session = Depends(get_db)):
    j = db.query(Job).filter(Job.id == job_id, Job.status == "open").first()
    if not j:
        raise HTTPException(status_code=404, detail="Job not found or closed")
    proposal = Proposal(
        job_id=job_id,
        freelancer_name=payload.freelancer_name,
        freelancer_email=payload.freelancer_email,
        cover_letter=payload.cover_letter,
        bid_amount=payload.bid_amount,
    )
    db.add(proposal)
    db.commit()
    db.refresh(proposal)
    return {"id": proposal.id, "status": proposal.status, "message": "Proposal submitted successfully!"}


@router.get("/freelancers")
def list_freelancers(
    min_rate: Optional[float] = Query(None),
    max_rate: Optional[float] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(FreelancerProfile)
    if min_rate is not None:
        q = q.filter(FreelancerProfile.hourly_rate >= min_rate)
    if max_rate is not None:
        q = q.filter(FreelancerProfile.hourly_rate <= max_rate)
    if search:
        term = f"%{search}%"
        q = q.filter(
            FreelancerProfile.name.ilike(term) |
            FreelancerProfile.title.ilike(term) |
            FreelancerProfile.bio.ilike(term)
        )
    return [_freelancer_out(f) for f in q.order_by(FreelancerProfile.created_at.desc()).all()]


@router.post("/freelancers", status_code=201)
def create_freelancer(payload: FreelancerCreate, db: Session = Depends(get_db)):
    f = FreelancerProfile(
        name=payload.name,
        title=payload.title,
        bio=payload.bio,
        skills=json.dumps(payload.skills or []),
        hourly_rate=payload.hourly_rate,
        availability=payload.availability,
        location=payload.location,
    )
    db.add(f)
    db.commit()
    db.refresh(f)
    return _freelancer_out(f)


@router.post("/seed")
def seed_data(db: Session = Depends(get_db)):
    if db.query(Job).count() > 0 or db.query(FreelancerProfile).count() > 0:
        return {"message": "Already seeded"}

    sample_freelancers = [
        FreelancerProfile(name="Aisha Patel", title="Full-Stack Developer", bio="10+ years building scalable web apps with React and Python. Passionate about clean code and great UX.", skills=json.dumps(["React", "Python", "TypeScript", "FastAPI", "PostgreSQL"]), hourly_rate=95, availability="Full-time", rating=4.9, total_jobs=87, location="Mumbai, India"),
        FreelancerProfile(name="Marcus Chen", title="UI/UX Designer", bio="Award-winning designer specializing in SaaS products, design systems, and mobile-first experiences.", skills=json.dumps(["Figma", "Design Systems", "Prototyping", "User Research", "Tailwind"]), hourly_rate=80, availability="Part-time", rating=4.8, total_jobs=64, location="Singapore"),
        FreelancerProfile(name="Sofia Rossi", title="Content & Copywriter", bio="Crafting compelling narratives for tech brands, startups, and Fortune 500s. SEO-savvy with a data-driven approach.", skills=json.dumps(["Copywriting", "SEO", "Content Strategy", "Blog Writing", "Email Marketing"]), hourly_rate=55, availability="Contract", rating=4.7, total_jobs=120, location="Milan, Italy"),
        FreelancerProfile(name="David Okonkwo", title="Data Scientist", bio="ML engineer and data analyst specializing in NLP, predictive modeling, and business intelligence dashboards.", skills=json.dumps(["Python", "Machine Learning", "TensorFlow", "SQL", "Tableau"]), hourly_rate=110, availability="Full-time", rating=4.9, total_jobs=43, location="Lagos, Nigeria"),
        FreelancerProfile(name="Emma Larsson", title="Digital Marketing Specialist", bio="Growth hacker helping startups scale. Expert in paid ads, email funnels, and conversion rate optimization.", skills=json.dumps(["Google Ads", "Meta Ads", "Email Marketing", "Analytics", "A/B Testing"]), hourly_rate=70, availability="Full-time", rating=4.6, total_jobs=95, location="Stockholm, Sweden"),
    ]
    db.add_all(sample_freelancers)

    sample_jobs = [
        Job(title="Build a React Dashboard for SaaS Analytics", description="We need an experienced React developer to build a modern analytics dashboard with charts, filters, and real-time data. Must be TypeScript-first and mobile responsive.", budget_min=2000, budget_max=5000, budget_type="fixed", skills=json.dumps(["React", "TypeScript", "Chart.js", "Tailwind CSS"]), client_name="TechVentures Ltd", client_email="hire@techventures.io", category="Development", is_remote=True, duration="1 Month"),
        Job(title="UX Redesign for E-Commerce Mobile App", description="Our iOS/Android e-commerce app needs a full UX overhaul. We want a seamless checkout flow, improved navigation, and a fresh visual identity.", budget_min=3000, budget_max=8000, budget_type="fixed", skills=json.dumps(["Figma", "Mobile UX", "Prototyping", "iOS Design"]), client_name="ShopNow Inc", client_email="product@shopnow.com", category="Design & Creative", is_remote=True, duration="3 Months"),
        Job(title="SEO-Optimized Blog Content (10 articles/month)", description="Looking for a skilled writer to produce 10 long-form blog articles per month on SaaS, productivity, and AI. Must be SEO-optimized with keyword research included.", budget_min=500, budget_max=1200, budget_type="fixed", skills=json.dumps(["SEO Writing", "SaaS", "Content Strategy", "WordPress"]), client_name="GrowthLab Agency", client_email="content@growthlab.co", category="Writing", is_remote=True, duration="Ongoing"),
        Job(title="Python ML Model for Customer Churn Prediction", description="We need a data scientist to build and deploy a machine learning model to predict customer churn using our existing dataset (50k+ records). Must include a FastAPI wrapper.", budget_min=4000, budget_max=9000, budget_type="fixed", skills=json.dumps(["Python", "Scikit-learn", "FastAPI", "Pandas", "Data Analysis"]), client_name="RetainAI", client_email="engineering@retainai.com", category="Data Science", is_remote=True, duration="6 Months"),
        Job(title="Google & Meta Paid Ads Campaign Management", description="Manage and optimize our monthly paid ads budget ($20k/month) across Google Search, Display, and Meta platforms. Focus on lead generation for B2B SaaS product.", budget_min=60, budget_max=90, budget_type="hourly", skills=json.dumps(["Google Ads", "Meta Ads", "B2B Marketing", "Analytics", "CRO"]), client_name="CloudBase Solutions", client_email="marketing@cloudbase.io", category="Marketing", is_remote=True, duration="Ongoing"),
    ]
    db.add_all(sample_jobs)
    db.commit()
    return {"message": "Seeded 5 freelancers and 5 jobs successfully"}
