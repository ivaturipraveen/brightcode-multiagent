import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from database import Base, engine
from models import email as _email_model  # noqa: F401 — registers EmailLog with Base
from models import lead as _lead_model    # noqa: F401 — registers Lead with Base
from models import content as _content_model  # noqa: F401 — registers ContentBlock with Base
from routes.auth import router as auth_router
from routes.chat import router as chat_router
from routes.email import router as email_router
from routes.leads import router as leads_router
from routes.profile import router as profile_router
from routes.hr_auth import router as hr_auth_router
from routes.hr_admin import router as hr_admin_router
from routes.hr_employee import router as hr_employee_router
from models import hr as _hr_model  # noqa: F401 — registers HR models with Base
from models import signup as _signup_model  # noqa: F401 — registers Signup with Base
from models import career as _career_model  # noqa: F401 — registers JobApplication with Base
from routes.signup import router as signup_router
from routes.careers import router as careers_router
from models import freelance as _freelance_model  # noqa: F401 — registers Freelance models with Base
from routes.freelance import router as freelance_router
from models import wow_reservation as _wow_reservation_model  # noqa: F401
from routes.wow_reservations import router as wow_reservations_router
from routes.content import router as content_router
from routes.admin_auth import router as admin_auth_router
from models import wfm as _wfm_model  # noqa: F401 — registers WFM models with Base
from routes.wfm import router as wfm_router

app = FastAPI(title="Brightcone")

# ── Static files (uploaded images) ──────────────────────────────────────────
_static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(os.path.join(_static_dir, "uploads"), exist_ok=True)
app.mount("/static", StaticFiles(directory=_static_dir), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(email_router)
app.include_router(leads_router)
app.include_router(profile_router)
app.include_router(hr_auth_router)
app.include_router(hr_admin_router)
app.include_router(hr_employee_router)
app.include_router(signup_router)
app.include_router(careers_router)
app.include_router(freelance_router)
app.include_router(wow_reservations_router)
app.include_router(content_router)
app.include_router(admin_auth_router)
app.include_router(wfm_router)


@app.on_event("startup")
def create_tables() -> None:
    Base.metadata.create_all(bind=engine)
    # Seed admin user and default content on every startup (idempotent)
    try:
        import seed_admin
        seed_admin.run()
    except Exception as e:
        print(f"[seed] Warning: {e}")
    try:
        import seed_wfm
        seed_wfm.run()
    except Exception as e:
        print(f"[seed_wfm] Warning: {e}")


@app.get("/health")
def health():
    return {"status": "ok", "service": "brightcone"}


@app.get("/health/db")
def health_db():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "ok", "service": "brightcone", "database": "postgresql"}
    except SQLAlchemyError:
        return {"status": "error", "service": "brightcone", "database": "unknown"}
