"""
Run DB migrations to ensure production schema matches models.
Safe to run multiple times (uses IF NOT EXISTS / IF EXISTS guards).
"""
import os
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent / 'backend'
sys.path.insert(0, str(BACKEND_DIR))

from dotenv import load_dotenv
load_dotenv(BACKEND_DIR / '.env')

from database import Base, engine
from sqlalchemy import text

# Import all models so Base knows about them
from models.user import User           # noqa
from models.chat import Conversation, ChatMessage  # noqa
from models.email import EmailLog      # noqa
from models.lead import Lead           # noqa

print("[migrate] Creating missing tables...")
Base.metadata.create_all(bind=engine)

print("[migrate] Applying column patches...")
with engine.connect() as conn:
    # email_logs.user_id — added in v2
    conn.execute(text(
        "ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id)"
    ))
    conn.commit()

print("[migrate] Done. Schema is up to date.")
