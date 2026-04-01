from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models.lead import Lead
from models.user import User
from security import get_current_user

router = APIRouter(prefix="/leads", tags=["leads"])


class LeadCreate(BaseModel):
    name: str
    email: str
    company: Optional[str] = ''
    value: Optional[int] = 0


class LeadUpdate(BaseModel):
    status: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    company: Optional[str] = None
    value: Optional[int] = None


class LeadResponse(BaseModel):
    id: int
    user_id: int
    name: str
    email: str
    company: str
    status: str
    value: int
    created_at: str

    class Config:
        from_attributes = True


@router.get("", response_model=List[LeadResponse])
def list_leads(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    leads = db.query(Lead).filter(Lead.user_id == user.id).order_by(Lead.created_at.desc()).all()
    return [_serialize(l) for l in leads]


@router.post("", response_model=LeadResponse, status_code=201)
def create_lead(payload: LeadCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    lead = Lead(
        user_id=user.id,
        name=payload.name,
        email=payload.email,
        company=payload.company or '',
        value=payload.value or 0,
        status='New',
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return _serialize(lead)


@router.patch("/{lead_id}", response_model=LeadResponse)
def update_lead(lead_id: int, payload: LeadUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id, Lead.user_id == user.id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    if payload.status is not None:
        lead.status = payload.status
    if payload.name is not None:
        lead.name = payload.name
    if payload.email is not None:
        lead.email = payload.email
    if payload.company is not None:
        lead.company = payload.company
    if payload.value is not None:
        lead.value = payload.value
    db.commit()
    db.refresh(lead)
    return _serialize(lead)


@router.delete("/{lead_id}", status_code=204)
def delete_lead(lead_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id, Lead.user_id == user.id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    db.delete(lead)
    db.commit()


def _serialize(lead: Lead) -> LeadResponse:
    return LeadResponse(
        id=lead.id,
        user_id=lead.user_id,
        name=lead.name,
        email=lead.email,
        company=lead.company,
        status=lead.status,
        value=lead.value,
        created_at=lead.created_at.isoformat() if lead.created_at else "",
    )
