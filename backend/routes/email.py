import os
import resend
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.email import EmailLog
from models.user import User
from security import get_current_user

router = APIRouter(prefix="/email", tags=["email"])

FROM_EMAIL = "hello@brightcone.ai"
CC_EMAIL = "tulasi.chintha@gmail.com"


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


class OutreachReportResponse(BaseModel):
    total_sent: int
    total_failed: int
    unique_recipients: int
    logs: List[EmailLogResponse]


@router.post("/send", response_model=EmailResponse)
def send_email(
    payload: EmailRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    api_key = os.getenv("RESEND_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Email service not configured")

    resend.api_key = api_key

    try:
        result = resend.Emails.send({
            "from": FROM_EMAIL,
            "to": payload.to,
            "cc": [CC_EMAIL],
            "subject": payload.subject,
            "html": payload.html,
        })

        log = EmailLog(
            user_id=user.id,
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
        try:
            log = EmailLog(
                user_id=user.id,
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
def get_email_logs(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    logs = (
        db.query(EmailLog)
        .filter(EmailLog.user_id == user.id)
        .order_by(EmailLog.sent_at.desc())
        .all()
    )
    return [_serialize_log(log) for log in logs]


@router.get("/report", response_model=OutreachReportResponse)
def get_outreach_report(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    logs = (
        db.query(EmailLog)
        .filter(EmailLog.user_id == user.id)
        .order_by(EmailLog.sent_at.desc())
        .all()
    )
    total_sent = sum(1 for l in logs if l.status == "sent")
    total_failed = sum(1 for l in logs if l.status == "failed")
    unique_recipients = len({l.to_email for l in logs})
    return OutreachReportResponse(
        total_sent=total_sent,
        total_failed=total_failed,
        unique_recipients=unique_recipients,
        logs=[_serialize_log(l) for l in logs],
    )


def _serialize_log(log: EmailLog) -> EmailLogResponse:
    return EmailLogResponse(
        id=log.id,
        resend_id=log.resend_id,
        to_email=log.to_email,
        subject=log.subject,
        body=log.body,
        status=log.status,
        sent_at=log.sent_at.isoformat() if log.sent_at else "",
    )
