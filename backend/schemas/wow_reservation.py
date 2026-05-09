from pydantic import BaseModel, EmailStr, field_validator
from datetime import date
from typing import Optional
import re


class ReservationCreate(BaseModel):
    first_name:   str
    last_name:    str
    email:        EmailStr
    phone:        Optional[str] = None
    date:         date
    service:      str           # "Lunch — 12:30" | "Dinner — 19:30" | "Dinner — 21:30"
    guests:       int
    pod:          Optional[str] = None
    wine_pairing: Optional[str] = None
    notes:        Optional[str] = None
    language:     Optional[str] = "en"

    @field_validator("guests")
    @classmethod
    def guests_range(cls, v):
        if not 1 <= v <= 4:
            raise ValueError("Guests must be between 1 and 4")
        return v

    @field_validator("service")
    @classmethod
    def valid_service(cls, v):
        allowed = ["Lunch — 12:30", "Dinner — 19:30", "Dinner — 21:30",
                   "Pranzo — 12:30", "Cena — 19:30", "Cena — 21:30",
                   "午餐 — 12:30", "晚餐 — 19:30", "晚餐 — 21:30"]
        if v not in allowed:
            raise ValueError(f"Invalid service slot: {v}")
        return v


class ReservationOut(BaseModel):
    id:         int
    first_name: str
    last_name:  str
    email:      str
    date:       date
    service:    str
    guests:     int
    pod:        Optional[str]
    status:     str

    class Config:
        from_attributes = True


class ReservationListOut(BaseModel):
    total: int
    items: list[ReservationOut]
