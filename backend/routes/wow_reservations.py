from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy.orm import Session
from typing import Optional
import os

from database import get_db
from models.wow_reservation import WowReservation
from schemas.wow_reservation import ReservationCreate, ReservationOut, ReservationListOut

router = APIRouter(prefix="/wow", tags=["WoW Reservations"])

# Simple admin token for listing/managing reservations
ADMIN_TOKEN = os.getenv("WOW_ADMIN_TOKEN", "wow-admin-2025")


def _require_admin(x_admin_token: str = Header(None)):
    if x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")


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
