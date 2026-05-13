"""
RILEY 🧪 — Backend unit tests for the Indeed job portal API.
Run: python3 -m pytest tests/backend/test_indeed.py -v
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base, get_db
from main import app

# ── In-memory SQLite for tests ───────────────────────────────────────────────
TEST_DB_URL = "sqlite:///./test_indeed.db"
engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="module", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    yield
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()


@pytest.fixture(scope="module")
def client():
    return TestClient(app)


# ─────────────────────────────────────────────────────────────────────────────
# Helper: create a job
# ─────────────────────────────────────────────────────────────────────────────
def _create_job(client: TestClient, title="Software Engineer", company="Brightcone") -> dict:
    res = client.post("/api/indeed/jobs", json={
        "title": title,
        "company": company,
        "location": "San Francisco, CA",
        "job_type": "Full-Time",
        "salary_min": 120000,
        "salary_max": 180000,
        "description": "Build amazing software.",
        "requirements": "Python, FastAPI, React",
        "benefits": "Health, 401k, Remote",
        "category": "Engineering",
    })
    assert res.status_code == 201, res.text
    return res.json()


# ─────────────────────────────────────────────────────────────────────────────
# JOBS CRUD
# ─────────────────────────────────────────────────────────────────────────────

class TestJobs:
    def test_create_job(self, client):
        job = _create_job(client)
        assert job["id"] > 0
        assert job["title"] == "Software Engineer"
        assert job["company"] == "Brightcone"
        assert job["is_active"] == "active"
        assert job["application_count"] == 0

    def test_list_jobs(self, client):
        res = client.get("/api/indeed/jobs")
        assert res.status_code == 200
        jobs = res.json()
        assert isinstance(jobs, list)
        assert len(jobs) >= 1

    def test_list_jobs_keyword_filter(self, client):
        _create_job(client, title="Data Scientist", company="AI Corp")
        res = client.get("/api/indeed/jobs?q=Data")
        assert res.status_code == 200
        jobs = res.json()
        assert all("Data" in j["title"] or "Data" in j["description"] or "Data" in j["company"] for j in jobs)

    def test_list_jobs_job_type_filter(self, client):
        # Create a part-time job
        client.post("/api/indeed/jobs", json={
            "title": "Part Time Writer",
            "company": "Blog Co",
            "location": "Remote",
            "job_type": "Part-Time",
            "description": "Write articles.",
        })
        res = client.get("/api/indeed/jobs?job_type=Part-Time")
        assert res.status_code == 200
        jobs = res.json()
        assert all(j["job_type"] == "Part-Time" for j in jobs)

    def test_get_job_by_id(self, client):
        job = _create_job(client, title="DevOps Engineer")
        res = client.get(f"/api/indeed/jobs/{job['id']}")
        assert res.status_code == 200
        assert res.json()["id"] == job["id"]

    def test_get_job_not_found(self, client):
        res = client.get("/api/indeed/jobs/99999")
        assert res.status_code == 404

    def test_update_job(self, client):
        job = _create_job(client, title="QA Engineer")
        res = client.put(f"/api/indeed/jobs/{job['id']}", json={"title": "Senior QA Engineer"})
        assert res.status_code == 200
        assert res.json()["title"] == "Senior QA Engineer"

    def test_delete_job(self, client):
        job = _create_job(client, title="Temp Job")
        res = client.delete(f"/api/indeed/jobs/{job['id']}")
        assert res.status_code == 204
        # Confirm it's gone
        res2 = client.get(f"/api/indeed/jobs/{job['id']}")
        assert res2.status_code == 404


# ─────────────────────────────────────────────────────────────────────────────
# APPLICATIONS
# ─────────────────────────────────────────────────────────────────────────────

class TestApplications:
    def test_apply_for_job(self, client):
        job = _create_job(client, title="Frontend Dev")
        res = client.post("/api/indeed/apply", json={
            "job_id": job["id"],
            "applicant_name": "Alice Smith",
            "applicant_email": "alice@example.com",
            "years_experience": 4,
            "cover_letter": "I love React!",
        })
        assert res.status_code == 201
        data = res.json()
        assert data["status"] == "submitted"
        assert data["applicant_email"] == "alice@example.com"
        assert data["job_id"] == job["id"]

    def test_duplicate_application_rejected(self, client):
        job = _create_job(client, title="Backend Dev")
        payload = {
            "job_id": job["id"],
            "applicant_name": "Bob",
            "applicant_email": "bob@example.com",
        }
        client.post("/api/indeed/apply", json=payload)
        res = client.post("/api/indeed/apply", json=payload)
        assert res.status_code == 409

    def test_apply_inactive_job(self, client):
        job = _create_job(client, title="Closed Job")
        # Close the job
        client.put(f"/api/indeed/jobs/{job['id']}", json={"is_active": "closed"})
        res = client.post("/api/indeed/apply", json={
            "job_id": job["id"],
            "applicant_name": "Charlie",
            "applicant_email": "charlie@example.com",
        })
        assert res.status_code == 404

    def test_track_applications_by_email(self, client):
        job = _create_job(client, title="ML Engineer")
        client.post("/api/indeed/apply", json={
            "job_id": job["id"],
            "applicant_name": "Dana",
            "applicant_email": "dana@track.com",
        })
        res = client.get("/api/indeed/applications/track?email=dana@track.com")
        assert res.status_code == 200
        apps = res.json()
        assert len(apps) >= 1
        assert apps[0]["applicant_email"] == "dana@track.com"

    def test_track_no_applications(self, client):
        res = client.get("/api/indeed/applications/track?email=nobody@example.com")
        assert res.status_code == 200
        assert res.json() == []

    def test_update_application_status(self, client):
        job = _create_job(client, title="Product Manager")
        apply_res = client.post("/api/indeed/apply", json={
            "job_id": job["id"],
            "applicant_name": "Eve",
            "applicant_email": "eve@example.com",
        })
        app_id = apply_res.json()["id"]

        # Move through the pipeline
        for status in ["under_review", "interview", "offer", "hired"]:
            res = client.patch(f"/api/indeed/applications/{app_id}/status", json={
                "status": status,
                "reviewer_notes": f"Moved to {status}",
            })
            assert res.status_code == 200
            assert res.json()["status"] == status

    def test_update_application_invalid_status(self, client):
        job = _create_job(client, title="Designer")
        apply_res = client.post("/api/indeed/apply", json={
            "job_id": job["id"],
            "applicant_name": "Frank",
            "applicant_email": "frank@example.com",
        })
        app_id = apply_res.json()["id"]
        res = client.patch(f"/api/indeed/applications/{app_id}/status", json={"status": "flying"})
        assert res.status_code == 400

    def test_list_applications_for_job(self, client):
        job = _create_job(client, title="Marketing Lead")
        for i in range(3):
            client.post("/api/indeed/apply", json={
                "job_id": job["id"],
                "applicant_name": f"Applicant {i}",
                "applicant_email": f"app{i}@example.com",
            })
        res = client.get(f"/api/indeed/jobs/{job['id']}/applications")
        assert res.status_code == 200
        assert len(res.json()) >= 3

    def test_list_applications_filter_status(self, client):
        job = _create_job(client, title="Sales Manager")
        apply_res = client.post("/api/indeed/apply", json={
            "job_id": job["id"],
            "applicant_name": "Grace",
            "applicant_email": "grace@example.com",
        })
        app_id = apply_res.json()["id"]
        client.patch(f"/api/indeed/applications/{app_id}/status", json={"status": "rejected"})

        res = client.get(f"/api/indeed/jobs/{job['id']}/applications?status=rejected")
        assert res.status_code == 200
        assert all(a["status"] == "rejected" for a in res.json())


# ─────────────────────────────────────────────────────────────────────────────
# STATS
# ─────────────────────────────────────────────────────────────────────────────

class TestStats:
    def test_get_stats(self, client):
        res = client.get("/api/indeed/stats")
        assert res.status_code == 200
        data = res.json()
        assert "total_jobs" in data
        assert "total_applications" in data
        assert "total_companies" in data
        assert data["total_jobs"] >= 0
        assert data["total_applications"] >= 0
