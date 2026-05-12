from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from database import get_db
from models.wow_reservation import WowReservation
from schemas.wow_reservation import ReservationCreate, ReservationOut, ReservationListOut

WOW_CONTACT_EMAIL = os.getenv("WOW_CONTACT_EMAIL", "info@wowfinedining.com")


def _send_smtp(from_addr: str, to_addr: str, subject: str, html: str) -> None:
    """Send an email via SMTP. from_addr is the submitter's email (Reply-To).

    Use SMTP_SSL (implicit TLS) when port is 465 or SMTP_SSL=1 — typical for Aruba.
    Use STARTTLS when port is 587 (Gmail, many others).
    """
    host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    port = int(os.getenv("SMTP_PORT", "587"))
    user = os.getenv("SMTP_USER", "")
    password = os.getenv("SMTP_PASS", "")
    ssl_flag = (os.getenv("SMTP_SSL", "") or "").lower() in ("1", "true", "yes")
    use_ssl = ssl_flag or port == 465

    if not user or not password:
        print("SMTP not configured — skipping email send")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"WoW Fine Dining <{user}>"
    msg["To"] = to_addr
    msg["Reply-To"] = from_addr
    msg.attach(MIMEText(html, "html"))
    payload = msg.as_string()

    if use_ssl:
        with smtplib.SMTP_SSL(host, port) as smtp:
            smtp.login(user, password)
            smtp.sendmail(user, to_addr, payload)
    else:
        with smtplib.SMTP(host, port) as smtp:
            smtp.ehlo()
            smtp.starttls()
            smtp.ehlo()
            smtp.login(user, password)
            smtp.sendmail(user, to_addr, payload)

router = APIRouter(prefix="/wow", tags=["WoW Reservations"])

# Simple admin token for listing/managing reservations
ADMIN_TOKEN = os.getenv("WOW_ADMIN_TOKEN", "wow-admin-2025")


def _require_admin(x_admin_token: str = Header(None)):
    if x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")


# ── PUBLIC: Contact / Private Events enquiry ─────────────────────────────────
class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    enquiry_type: str          # "contact" | "private_events" | "press"
    message: str
    guests: Optional[int] = None
    event_date: Optional[str] = None
    language: Optional[str] = "en"


@router.post("/contact", status_code=200)
def send_contact(payload: ContactRequest):
    type_labels = {
        "contact": "General Enquiry",
        "private_events": "Private Events",
        "press": "Press Enquiry",
    }
    label = type_labels.get(payload.enquiry_type, "Enquiry")

    extra_rows = ""
    if payload.guests:
        extra_rows += f"<tr><td style='padding:6px 12px;color:#7A9480;font-size:13px'>Guests</td><td style='padding:6px 12px;font-size:13px'>{payload.guests}</td></tr>"
    if payload.event_date:
        extra_rows += f"<tr><td style='padding:6px 12px;color:#7A9480;font-size:13px'>Event Date</td><td style='padding:6px 12px;font-size:13px'>{payload.event_date}</td></tr>"
    if payload.phone:
        extra_rows += f"<tr><td style='padding:6px 12px;color:#7A9480;font-size:13px'>Phone</td><td style='padding:6px 12px;font-size:13px'>{payload.phone}</td></tr>"

    html = f"""
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;background:#060A07;padding:40px 0;min-height:100vh">
      <div style="max-width:560px;margin:0 auto;background:#0B1A12;border:1px solid rgba(201,168,76,0.2)">
        <div style="height:3px;background:linear-gradient(to right,#C9A84C,#7A6030)"></div>
        <div style="padding:36px 40px">
          <p style="font-size:11px;letter-spacing:0.4em;text-transform:uppercase;color:#C9A84C;margin:0 0 16px">WoW Fast Fine Dining</p>
          <h1 style="font-family:Georgia,serif;font-size:26px;font-weight:300;color:#F5F0E8;margin:0 0 8px">{label}</h1>
          <p style="font-size:12px;color:#7A9480;margin:0 0 32px">Received via wowfinedining.com</p>
          <table style="width:100%;border-collapse:collapse;background:rgba(245,240,232,0.03);border:1px solid rgba(201,168,76,0.1)">
            <tr style="border-bottom:1px solid rgba(201,168,76,0.07)">
              <td style="padding:10px 12px;color:#7A9480;font-size:13px;width:35%">Name</td>
              <td style="padding:10px 12px;color:#F5F0E8;font-size:13px;font-weight:500">{payload.name}</td>
            </tr>
            <tr style="border-bottom:1px solid rgba(201,168,76,0.07)">
              <td style="padding:6px 12px;color:#7A9480;font-size:13px">Email</td>
              <td style="padding:6px 12px;font-size:13px"><a href="mailto:{payload.email}" style="color:#C9A84C">{payload.email}</a></td>
            </tr>
            {extra_rows}
            <tr>
              <td style="padding:10px 12px;color:#7A9480;font-size:13px;vertical-align:top">Message</td>
              <td style="padding:10px 12px;color:#F5F0E8;font-size:13px;line-height:1.6">{payload.message.replace(chr(10),'<br>')}</td>
            </tr>
          </table>
          <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(201,168,76,0.1)">
            <p style="font-size:11px;color:#7A9480;margin:0">WoW · Via XIV Settembre, 69 · 06122 Perugia PG, Italy</p>
          </div>
        </div>
      </div>
    </div>
    """

    try:
        _send_smtp(
            from_addr=payload.email,
            to_addr=WOW_CONTACT_EMAIL,
            subject=f"[WoW] {label} — {payload.name}",
            html=html,
        )
    except Exception as e:
        print(f"SMTP error: {e}")

    return {"status": "received"}


# ── PUBLIC: Create a reservation ──────────────────────────────────────────────
@router.post("/reservations", response_model=ReservationOut, status_code=201)
def create_reservation(payload: ReservationCreate, db: Session = Depends(get_db)):
    # Check pod availability for same date+service
    if payload.pod:
        conflict = db.query(WowReservation).filter(
            WowReservation.date    == payload.date,
            WowReservation.service == payload.service,
            WowReservation.pod     == payload.pod,
            WowReservation.status  != "cancelled",
        ).first()
        if conflict:
            raise HTTPException(
                status_code=409,
                detail=f"Pod {payload.pod} is already reserved for this date and service."
            )

    reservation = WowReservation(**payload.model_dump())
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation


# ── PUBLIC: Check pod availability for a date+service ────────────────────────
@router.get("/reservations/availability")
def check_availability(
    date:    str,
    service: str,
    db:      Session = Depends(get_db),
):
    booked_pods = db.query(WowReservation.pod).filter(
        WowReservation.date    == date,
        WowReservation.service == service,
        WowReservation.status  != "cancelled",
        WowReservation.pod     != None,
    ).all()
    booked = [r.pod for r in booked_pods]
    all_pods = ["1", "2", "3", "4", "5", "6"]
    available = [p for p in all_pods if p not in booked]
    return {
        "date":      date,
        "service":   service,
        "booked":    booked,
        "available": available,
        "total_pods": 6,
        "available_count": len(available),
    }


# ── ADMIN: List all reservations ─────────────────────────────────────────────
@router.get("/reservations", response_model=ReservationListOut, dependencies=[Depends(_require_admin)])
def list_reservations(
    status: Optional[str] = Query(None),
    date:   Optional[str] = Query(None),
    skip:   int = Query(0, ge=0),
    limit:  int = Query(50, le=200),
    db:     Session = Depends(get_db),
):
    q = db.query(WowReservation)
    if status:
        q = q.filter(WowReservation.status == status)
    if date:
        q = q.filter(WowReservation.date == date)
    total = q.count()
    items = q.order_by(WowReservation.date, WowReservation.service).offset(skip).limit(limit).all()
    return {"total": total, "items": items}


# ── ADMIN: Update reservation status ─────────────────────────────────────────
@router.patch("/reservations/{reservation_id}", response_model=ReservationOut, dependencies=[Depends(_require_admin)])
def update_reservation_status(
    reservation_id: int,
    status: str,
    db: Session = Depends(get_db),
):
    if status not in ("pending", "confirmed", "cancelled"):
        raise HTTPException(status_code=400, detail="Invalid status")
    r = db.query(WowReservation).filter(WowReservation.id == reservation_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Reservation not found")
    r.status = status
    db.commit()
    db.refresh(r)
    return r


# ── ADMIN: Delete reservation ─────────────────────────────────────────────────
@router.delete("/reservations/{reservation_id}", dependencies=[Depends(_require_admin)])
def delete_reservation(reservation_id: int, db: Session = Depends(get_db)):
    r = db.query(WowReservation).filter(WowReservation.id == reservation_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Reservation not found")
    db.delete(r)
    db.commit()
    return {"detail": "Deleted"}
