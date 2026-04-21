from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from database import Base, engine
from models import email as _email_model  # noqa: F401 — registers EmailLog with Base
from models import lead as _lead_model    # noqa: F401 — registers Lead with Base
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

app = FastAPI(title="Brightcone")

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


@app.on_event("startup")
def create_tables() -> None:
    Base.metadata.create_all(bind=engine)


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
