from sqlalchemy import Column, Integer, String, Date, DateTime, func
from database import Base


class WowReservation(Base):
    __tablename__ = "wow_reservations"

    id          = Column(Integer, primary_key=True, index=True)
    first_name  = Column(String(100), nullable=False)
    last_name   = Column(String(100), nullable=False)
    email       = Column(String(255), nullable=False, index=True)
    phone       = Column(String(50), nullable=True)
    date        = Column(Date, nullable=False)
    service     = Column(String(50), nullable=False)   # "lunch-1230" | "dinner-1930" | "dinner-2130"
    guests      = Column(Integer, nullable=False)
    pod         = Column(String(10), nullable=True)    # "1" – "6"
    wine_pairing= Column(String(100), nullable=True)
    notes       = Column(String(500), nullable=True)
    language    = Column(String(10), default="en")     # "en" | "it" | "zh"
    status      = Column(String(20), default="pending") # pending | confirmed | cancelled
    created_at  = Column(DateTime, server_default=func.now())
