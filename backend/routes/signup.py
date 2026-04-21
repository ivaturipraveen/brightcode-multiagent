from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from database import get_db
from models.signup import Signup

router = APIRouter(prefix="/signup", tags=["signup"])


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    company: str = ""
    phone: str = ""


class SignupResponse(BaseModel):
    id: int
    name: str
    email: str
    company: str
    phone: str
    message: str


@router.post("", response_model=SignupResponse, status_code=status.HTTP_201_CREATED)
def create_signup(payload: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(Signup).filter(Signup.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="This email has already signed up.")

    entry = Signup(
        name=payload.name.strip(),
        email=payload.email.lower(),
        company=payload.company.strip(),
        phone=payload.phone.strip(),
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)

    return SignupResponse(
        id=entry.id,
        name=entry.name,
        email=entry.email,
        company=entry.company or "",
        phone=entry.phone or "",
        message="Thanks for signing up! We'll be in touch soon.",
    )
