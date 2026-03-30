from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from database import Base, engine
from routes.auth import router as auth_router
from routes.chat import router as chat_router
from routes.profile import router as profile_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="OpenClaw Multiagent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(profile_router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "openclaw-multiagent"}


@app.get("/health/db")
def health_db():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "ok", "service": "openclaw-multiagent", "database": "sqlite"}
    except SQLAlchemyError:
        return {"status": "error", "service": "openclaw-multiagent", "database": "sqlite"}
