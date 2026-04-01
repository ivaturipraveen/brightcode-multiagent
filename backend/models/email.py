from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func

from database import Base


class EmailLog(Base):
    __tablename__ = 'email_logs'

    id = Column(Integer, primary_key=True, index=True)
    resend_id = Column(String, nullable=False)
    to_email = Column(String, nullable=False, index=True)
    subject = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    status = Column(String, nullable=False, default='sent')  # sent | failed
    sent_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
