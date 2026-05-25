"""
CTR Notification Service — Currency Transaction Report (FinCEN Form 112)
Compliant with BSA (Bank Secrecy Act) requirements.
Triggers notifications for transactions >= $10,000 USD.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum
import uuid

app = FastAPI(
    title="CTR Notification Service",
    description="Currency Transaction Report notification system for global money transfers (BSA/FinCEN Form 112 compliant)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Constants ─────────────────────────────────────────────────────────────────
CTR_THRESHOLD_USD = 10_000.00  # FinCEN mandated threshold

# ─── Enums ─────────────────────────────────────────────────────────────────────
class TransactionType(str, Enum):
    WIRE_TRANSFER = "WIRE_TRANSFER"
    CASH_DEPOSIT  = "CASH_DEPOSIT"
    CASH_WITHDRAWAL = "CASH_WITHDRAWAL"
    CRYPTO_STABLECOIN = "CRYPTO_STABLECOIN"
    ACH = "ACH"
    SWIFT = "SWIFT"
    SEPA = "SEPA"

class CTRStatus(str, Enum):
    TRIGGERED   = "TRIGGERED"
    FILED       = "FILED"
    EXEMPT      = "EXEMPT"
    BELOW_THRESHOLD = "BELOW_THRESHOLD"

# ─── Models ────────────────────────────────────────────────────────────────────
class Person(BaseModel):
    full_name: str
    date_of_birth: Optional[str] = None          # YYYY-MM-DD
    id_type: Optional[str] = None                # "PASSPORT" | "DRIVER_LICENSE" | "SSN"
    id_number: Optional[str] = None
    address: Optional[str] = None
    country: str = "US"
    phone: Optional[str] = None

class FinancialInstitution(BaseModel):
    name: str
    ein: Optional[str] = None                    # Employer Identification Number
    routing_number: Optional[str] = None
    swift_bic: Optional[str] = None
    address: Optional[str] = None
    country: str = "US"

class TransferRequest(BaseModel):
    transaction_id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    amount_usd: float = Field(..., gt=0, description="Transaction amount in USD equivalent")
    original_currency: str = Field(default="USD", description="Original transaction currency")
    original_amount: Optional[float] = None
    exchange_rate: Optional[float] = None
    transaction_type: TransactionType
    transaction_date: str = Field(default_factory=lambda: datetime.utcnow().strftime("%Y-%m-%d"))
    transaction_time: Optional[str] = None       # HH:MM UTC

    sender: Person
    receiver: Person
    sending_institution: Optional[FinancialInstitution] = None
    receiving_institution: Optional[FinancialInstitution] = None

    account_number_sender: Optional[str] = None
    account_number_receiver: Optional[str] = None
    memo: Optional[str] = None
    is_aggregated: bool = Field(default=False, description="True if this is an aggregated daily total")

# ─── CTR Report Model ───────────────────────────────────────────────────────────
class CTRNotification(BaseModel):
    ctr_id: str
    status: CTRStatus
    form_type: str = "FinCEN Form 112"
    triggered_at: str
    threshold_usd: float = CTR_THRESHOLD_USD
    transaction: TransferRequest
    filing_deadline: str                          # 15 calendar days from transaction
    alerts: List[str] = []
    summary: str

# ─── In-memory store (replace with DB in production) ──────────────────────────
ctr_store: List[CTRNotification] = []

# ─── Helpers ───────────────────────────────────────────────────────────────────
def build_alerts(transfer: TransferRequest) -> List[str]:
    alerts = []
    if transfer.amount_usd >= CTR_THRESHOLD_USD:
        alerts.append(f"⚠️  Transaction of ${transfer.amount_usd:,.2f} meets or exceeds the $10,000 CTR threshold.")
    if transfer.amount_usd >= 50_000:
        alerts.append("🔴 High-value transfer — Enhanced Due Diligence (EDD) recommended.")
    if transfer.original_currency != "USD":
        alerts.append(f"💱 Foreign currency involved: {transfer.original_currency} — verify exchange rate documentation.")
    if transfer.transaction_type in [TransactionType.CRYPTO_STABLECOIN]:
        alerts.append("🔗 Stablecoin/crypto transaction — ensure VASP compliance (FinCEN guidance 2019-G001).")
    if transfer.is_aggregated:
        alerts.append("📊 Aggregated transaction — multiple same-day transactions from same person exceeding threshold.")
    return alerts

def compute_filing_deadline(date_str: str) -> str:
    from datetime import timedelta
    try:
        txn_date = datetime.strptime(date_str, "%Y-%m-%d")
        deadline = txn_date + timedelta(days=15)
        return deadline.strftime("%Y-%m-%d")
    except:
        return "Within 15 calendar days of transaction"

# ─── Routes ────────────────────────────────────────────────────────────────────
@app.post("/api/transfer/submit", response_model=CTRNotification, tags=["CTR"])
def submit_transfer(transfer: TransferRequest):
    """
    Submit a money transfer. If amount >= $10,000 USD, a CTR notification
    is automatically generated in FinCEN Form 112 format.
    """
    alerts = build_alerts(transfer)

    if transfer.amount_usd >= CTR_THRESHOLD_USD:
        status = CTRStatus.TRIGGERED
        summary = (
            f"CTR REQUIRED — {transfer.transaction_type.value} of ${transfer.amount_usd:,.2f} USD "
            f"from {transfer.sender.full_name} ({transfer.sender.country}) "
            f"to {transfer.receiver.full_name} ({transfer.receiver.country}) "
            f"on {transfer.transaction_date}. File with FinCEN within 15 days."
        )
    else:
        status = CTRStatus.BELOW_THRESHOLD
        summary = (
            f"No CTR required — ${transfer.amount_usd:,.2f} USD is below the $10,000 threshold."
        )

    notification = CTRNotification(
        ctr_id=f"CTR-{str(uuid.uuid4())[:8].upper()}",
        status=status,
        triggered_at=datetime.utcnow().isoformat() + "Z",
        transaction=transfer,
        filing_deadline=compute_filing_deadline(transfer.transaction_date),
        alerts=alerts,
        summary=summary
    )

    ctr_store.append(notification)
    return notification


@app.get("/api/ctr/reports", response_model=List[CTRNotification], tags=["CTR"])
def list_ctr_reports(status: Optional[CTRStatus] = None):
    """List all CTR notifications, optionally filtered by status."""
    if status:
        return [r for r in ctr_store if r.status == status]
    return ctr_store


@app.get("/api/ctr/reports/{ctr_id}", response_model=CTRNotification, tags=["CTR"])
def get_ctr_report(ctr_id: str):
    """Fetch a single CTR notification by ID."""
    for r in ctr_store:
        if r.ctr_id == ctr_id:
            return r
    raise HTTPException(status_code=404, detail="CTR report not found")


@app.patch("/api/ctr/reports/{ctr_id}/status", tags=["CTR"])
def update_ctr_status(ctr_id: str, new_status: CTRStatus):
    """Update CTR filing status (e.g., mark as FILED or EXEMPT)."""
    for r in ctr_store:
        if r.ctr_id == ctr_id:
            r.status = new_status
            return {"ctr_id": ctr_id, "status": new_status, "updated_at": datetime.utcnow().isoformat() + "Z"}
    raise HTTPException(status_code=404, detail="CTR report not found")


@app.get("/health", tags=["System"])
def health():
    return {"status": "ok", "service": "CTR Notification Service", "threshold_usd": CTR_THRESHOLD_USD}
