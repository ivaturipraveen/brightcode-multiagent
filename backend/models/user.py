from sqlalchemy import Boolean, Column, Integer, String, Text
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    avatar_url = Column(String, nullable=False, default='')
    bio = Column(Text, nullable=False, default='')
    is_admin = Column(Boolean, nullable=False, default=False)

    conversations = relationship('Conversation', backref='user', cascade='all, delete-orphan')
