import os
import resend
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.email import EmailLog

router = APIRouter(prefix="/email", tags=["email"])

FROM_EMAIL = "hello@brightcone.ai"


class EmailRequest(BaseModel):
    to: EmailStr
    subject: str
    html: str


class EmailResponse(BaseModel):
    id: str
    message: str


class EmailLogResponse(BaseModel):
    id: int
    resend_id: str
    to_email: str
    subject: str
    body: str
    status: str
    sent_at: str

    class Config:
        from_attributes = True


@router.post("/send", response_model=EmailResponse)
def send_email(payload: EmailRequest, db: Session = Depends(get_db)):
    api_key = os.getenv("RESEND_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Email service not configured")

    resend.api_key = api_key

    try:
        result = resend.Emails.send({
            "from": FROM_EMAIL,
            "to": payload.to,
            "subject": payload.subject,
            "html": payload.html,
        })

        # Log the sent email to DB
        log = EmailLog(
            resend_id=result["id"],
            to_email=payload.to,
            subject=payload.subject,
            body=payload.html,
            status="sent",
        )
        db.add(log)
        db.commit()

        return EmailResponse(id=result["id"], message="Email sent successfully")

    except Exception as e:
        # Log failed attempt too
        try:
            log = EmailLog(
                resend_id="failed",
                to_email=payload.to,
                subject=payload.subject,
                body=payload.html,
                status="failed",
            )
            db.add(log)
            db.commit()
        except Exception:
            pass
        raise HTTPException(status_code=502, detail=f"Failed to send email: {str(e)}")


@router.get("/logs", response_model=List[EmailLogResponse])
def get_email_logs(db: Session = Depends(get_db)):
    logs = db.query(EmailLog).order_by(EmailLog.sent_at.desc()).all()
    return [
        EmailLogResponse(
            id=log.id,
            resend_id=log.resend_id,
            to_email=log.to_email,
            subject=log.subject,
            body=log.body,
            status=log.status,
            sent_at=log.sent_at.isoformat() if log.sent_at else "",
        )
        for log in logs
    ]
