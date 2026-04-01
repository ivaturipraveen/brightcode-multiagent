import os
import sys
from collections.abc import Generator
from pathlib import Path

# ── MUST set DATABASE_URL BEFORE any backend imports ───────────────────────────
# Tests use an isolated SQLite file — production Render PostgreSQL is NEVER touched.
# ───────────────────────────────────────────────────────────────────────────────
TEST_DATABASE_URL = 'sqlite:///./test_isolated.db'
os.environ['DATABASE_URL'] = TEST_DATABASE_URL
os.environ['JWT_SECRET'] = 'test-secret'
os.environ['ANTHROPIC_API_KEY'] = 'test-anthropic-key'

ROOT_DIR = Path(__file__).resolve().parents[2]
BACKEND_DIR = ROOT_DIR / 'backend'
for path in (str(ROOT_DIR), str(BACKEND_DIR)):
    if path not in sys.path:
        sys.path.insert(0, path)

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base, get_db  # noqa: E402
from main import app  # noqa: E402

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={'check_same_thread': False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def setup_database() -> Generator[None, None, None]:
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as test_client:
        yield test_client
