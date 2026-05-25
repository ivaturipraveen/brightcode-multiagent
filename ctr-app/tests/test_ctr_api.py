"""
RILEY 🧪 — CTR Notification API Tests
Tests for FinCEN Form 112 CTR trigger logic and API endpoints.
"""

import pytest
from fastapi.testclient import TestClient
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../backend"))

from main import app, ctr_store, CTR_THRESHOLD_USD

client = TestClient(app)

BASE_TRANSFER = {
    "amount_usd": 15000.0,
    "original_currency": "USD",
    "transaction_type": "WIRE_TRANSFER",
    "transaction_date": "2026-05-25",
    "sender": {"full_name": "Alice Johnson", "country": "US", "id_type": "PASSPORT", "id_number": "P1234567"},
    "receiver": {"full_name": "Bob Smith", "country": "GB", "id_type": "PASSPORT", "id_number": "P9876543"},
    "sending_institution": {"name": "First National Bank", "swift_bic": "FNBAUS33", "country": "US"},
    "receiving_institution": {"name": "Barclays UK", "swift_bic": "BARCGB22", "country": "GB"},
    "memo": "Invoice #1042 payment",
}

# ─── Setup ─────────────────────────────────────────────────────────────────────
@pytest.fixture(autouse=True)
def clear_store():
    ctr_store.clear()
    yield
    ctr_store.clear()

# ─── Health ────────────────────────────────────────────────────────────────────
def test_health_endpoint():
    r = client.get("/health")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"
    assert data["threshold_usd"] == 10_000.0

# ─── CTR Trigger (>= $10,000) ──────────────────────────────────────────────────
def test_ctr_triggered_above_threshold():
    r = client.post("/api/transfer/submit", json=BASE_TRANSFER)
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "TRIGGERED"
    assert data["form_type"] == "FinCEN Form 112"
    assert data["ctr_id"].startswith("CTR-")
    assert data["filing_deadline"] == "2026-06-09"          # 15 days from 2026-05-25

def test_ctr_triggered_exactly_at_threshold():
    t = {**BASE_TRANSFER, "amount_usd": 10000.0}
    r = client.post("/api/transfer/submit", json=t)
    assert r.status_code == 200
    assert r.json()["status"] == "TRIGGERED"

def test_no_ctr_below_threshold():
    t = {**BASE_TRANSFER, "amount_usd": 9999.99}
    r = client.post("/api/transfer/submit", json=t)
    assert r.status_code == 200
    assert r.json()["status"] == "BELOW_THRESHOLD"

# ─── Alerts ────────────────────────────────────────────────────────────────────
def test_high_value_edd_alert():
    t = {**BASE_TRANSFER, "amount_usd": 75000.0}
    r = client.post("/api/transfer/submit", json=t)
    alerts = r.json()["alerts"]
    assert any("Enhanced Due Diligence" in a for a in alerts)

def test_foreign_currency_alert():
    t = {**BASE_TRANSFER, "original_currency": "EUR", "original_amount": 14000.0}
    r = client.post("/api/transfer/submit", json=t)
    alerts = r.json()["alerts"]
    assert any("EUR" in a for a in alerts)

def test_stablecoin_alert():
    t = {**BASE_TRANSFER, "transaction_type": "CRYPTO_STABLECOIN"}
    r = client.post("/api/transfer/submit", json=t)
    alerts = r.json()["alerts"]
    assert any("Stablecoin" in a for a in alerts)

def test_aggregated_flag_alert():
    t = {**BASE_TRANSFER, "is_aggregated": True}
    r = client.post("/api/transfer/submit", json=t)
    alerts = r.json()["alerts"]
    assert any("Aggregated" in a for a in alerts)

# ─── Report Listing ────────────────────────────────────────────────────────────
def test_list_reports_empty():
    r = client.get("/api/ctr/reports")
    assert r.status_code == 200
    assert r.json() == []

def test_list_reports_after_submit():
    client.post("/api/transfer/submit", json=BASE_TRANSFER)
    r = client.get("/api/ctr/reports")
    assert r.status_code == 200
    assert len(r.json()) == 1

def test_filter_reports_by_status():
    client.post("/api/transfer/submit", json=BASE_TRANSFER)
    low = {**BASE_TRANSFER, "amount_usd": 500.0}
    client.post("/api/transfer/submit", json=low)
    r = client.get("/api/ctr/reports?status=TRIGGERED")
    assert len(r.json()) == 1
    assert r.json()[0]["status"] == "TRIGGERED"

# ─── Status Update ─────────────────────────────────────────────────────────────
def test_mark_ctr_as_filed():
    r1 = client.post("/api/transfer/submit", json=BASE_TRANSFER)
    ctr_id = r1.json()["ctr_id"]
    r2 = client.patch(f"/api/ctr/reports/{ctr_id}/status?new_status=FILED")
    assert r2.status_code == 200
    assert r2.json()["status"] == "FILED"

def test_fetch_single_report():
    r1 = client.post("/api/transfer/submit", json=BASE_TRANSFER)
    ctr_id = r1.json()["ctr_id"]
    r2 = client.get(f"/api/ctr/reports/{ctr_id}")
    assert r2.status_code == 200
    assert r2.json()["ctr_id"] == ctr_id

def test_fetch_nonexistent_report():
    r = client.get("/api/ctr/reports/CTR-FAKEID")
    assert r.status_code == 404

# ─── Summary content ───────────────────────────────────────────────────────────
def test_ctr_summary_contains_names():
    r = client.post("/api/transfer/submit", json=BASE_TRANSFER)
    summary = r.json()["summary"]
    assert "Alice Johnson" in summary
    assert "Bob Smith" in summary

def test_ctr_threshold_constant():
    assert CTR_THRESHOLD_USD == 10_000.00
