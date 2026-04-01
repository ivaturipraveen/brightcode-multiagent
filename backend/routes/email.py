import os
import resend
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/email", tags=["email"])

FROM_EMAIL = "hello@brightcone.ai"


class EmailRequest(BaseModel):
    to: EmailStr
    subject: str
    html: str


class EmailResponse(BaseModel):
    id: str
    message: str


@router.post("/send", response_model=EmailResponse)
def send_email(payload: EmailRequest):
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
        return EmailResponse(id=result["id"], message="Email sent successfully")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to send email: {str(e)}")
