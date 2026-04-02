from datetime import date, datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.hr import HREmployee, HRAttendance, HRLeave, HRPayslip, HRRole, LeaveStatus
from routes.hr_deps import get_current_hr_employee, require_role

router = APIRouter(prefix="/hr", tags=["HR Employee"])

# ── Profile ───────────────────────────────────────────────────────────────────

class ProfileOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    department: Optional[str]
    designation: Optional[str]
    phone: Optional[str]
    salary: Optional[float]
    status: str
    company_id: Optional[int]
    class Config:
        from_attributes = True

@router.get("/profile", response_model=ProfileOut)
def get_profile(current: HREmployee = Depends(get_current_hr_employee)):
    return ProfileOut(
        id=current.id, name=current.name, email=current.email,
        role=current.role.value, department=current.department,
        designation=current.designation, phone=current.phone,
        salary=current.salary, status=current.status.value,
        company_id=current.company_id
    )

# ── Attendance ────────────────────────────────────────────────────────────────

class AttendanceOut(BaseModel):
    id: int
    date: str
    clock_in: Optional[str]
    clock_out: Optional[str]
    total_hours: Optional[float]
    status: str

@router.post("/attendance/clockin")
def clock_in(db: Session = Depends(get_db), current: HREmployee = Depends(get_current_hr_employee)):
    today = date.today()
    existing = db.query(HRAttendance).filter(
        HRAttendance.employee_id == current.id,
        HRAttendance.date == today
    ).first()
    if existing and existing.clock_in:
        raise HTTPException(400, "Already clocked in today.")
    if not existing:
        existing = HRAttendance(employee_id=current.id, date=today)
        db.add(existing)
    existing.clock_in = datetime.utcnow()
    db.commit()
    return {"message": "Clocked in.", "time": existing.clock_in.isoformat()}

@router.post("/attendance/clockout")
def clock_out(db: Session = Depends(get_db), current: HREmployee = Depends(get_current_hr_employee)):
    today = date.today()
    record = db.query(HRAttendance).filter(
        HRAttendance.employee_id == current.id,
        HRAttendance.date == today
    ).first()
    if not record or not record.clock_in:
        raise HTTPException(400, "Not clocked in today.")
    if record.clock_out:
        raise HTTPException(400, "Already clocked out.")
    record.clock_out = datetime.utcnow()
    delta = record.clock_out - record.clock_in
    record.total_hours = round(delta.total_seconds() / 3600, 2)
    db.commit()
    return {"message": "Clocked out.", "total_hours": record.total_hours}

@router.get("/attendance", response_model=List[AttendanceOut])
def get_attendance(db: Session = Depends(get_db), current: HREmployee = Depends(get_current_hr_employee)):
    records = db.query(HRAttendance).filter(HRAttendance.employee_id == current.id).order_by(HRAttendance.date.desc()).limit(30).all()
    return [AttendanceOut(
        id=r.id, date=str(r.date),
        clock_in=r.clock_in.isoformat() if r.clock_in else None,
        clock_out=r.clock_out.isoformat() if r.clock_out else None,
        total_hours=r.total_hours, status=r.status
    ) for r in records]

# ── Leave ─────────────────────────────────────────────────────────────────────

class LeaveRequest(BaseModel):
    leave_type: str
    from_date: str
    to_date: str
    reason: Optional[str] = None

class LeaveOut(BaseModel):
    id: int
    leave_type: str
    from_date: str
    to_date: str
    days: int
    reason: Optional[str]
    status: str
    applied_at: str

class LeaveAction(BaseModel):
    action: str  # "approved" | "rejected"

@router.post("/leave", status_code=201)
def apply_leave(payload: LeaveRequest, db: Session = Depends(get_db), current: HREmployee = Depends(get_current_hr_employee)):
    from_date = date.fromisoformat(payload.from_date)
    to_date = date.fromisoformat(payload.to_date)
    if to_date < from_date:
        raise HTTPException(400, "to_date must be >= from_date.")
    days = (to_date - from_date).days + 1
    leave = HRLeave(
        employee_id=current.id,
        leave_type=payload.leave_type,
        from_date=from_date,
        to_date=to_date,
        days=days,
        reason=payload.reason,
    )
    db.add(leave)
    db.commit()
    db.refresh(leave)
    return {"message": "Leave applied.", "leave_id": leave.id, "days": days}

@router.get("/leave", response_model=List[LeaveOut])
def get_leaves(db: Session = Depends(get_db), current: HREmployee = Depends(get_current_hr_employee)):
    leaves = db.query(HRLeave).filter(HRLeave.employee_id == current.id).order_by(HRLeave.applied_at.desc()).all()
    return [LeaveOut(
        id=l.id, leave_type=l.leave_type, from_date=str(l.from_date),
        to_date=str(l.to_date), days=l.days, reason=l.reason,
        status=l.status.value, applied_at=l.applied_at.isoformat()
    ) for l in leaves]

@router.get("/leave/all")
def get_all_leaves(db: Session = Depends(get_db), current: HREmployee = Depends(require_role(HRRole.company_admin, HRRole.super_admin))):
    """Company admin sees all leaves for their company."""
    if current.role == HRRole.super_admin:
        leaves = db.query(HRLeave).all()
    else:
        emp_ids = [e.id for e in db.query(HREmployee).filter(HREmployee.company_id == current.company_id).all()]
        leaves = db.query(HRLeave).filter(HRLeave.employee_id.in_(emp_ids)).all()
    return [{"id": l.id, "employee_id": l.employee_id, "leave_type": l.leave_type,
             "from_date": str(l.from_date), "to_date": str(l.to_date),
             "days": l.days, "status": l.status.value} for l in leaves]

@router.patch("/leave/{leave_id}/action")
def action_leave(leave_id: int, payload: LeaveAction, db: Session = Depends(get_db),
                 current: HREmployee = Depends(require_role(HRRole.company_admin, HRRole.super_admin))):
    leave = db.query(HRLeave).filter(HRLeave.id == leave_id).first()
    if not leave:
        raise HTTPException(404, "Leave not found.")
    leave.status = LeaveStatus.approved if payload.action == "approved" else LeaveStatus.rejected
    leave.reviewed_by = current.id
    leave.reviewed_at = datetime.utcnow()
    db.commit()
    return {"message": f"Leave {payload.action}."}

# ── Payslips ──────────────────────────────────────────────────────────────────

class PayslipOut(BaseModel):
    id: int
    month: str
    basic: float
    allowances: float
    deductions: float
    net_pay: float
    generated_at: str

@router.get("/payslips", response_model=List[PayslipOut])
def get_payslips(db: Session = Depends(get_db), current: HREmployee = Depends(get_current_hr_employee)):
    slips = db.query(HRPayslip).filter(HRPayslip.employee_id == current.id).order_by(HRPayslip.generated_at.desc()).all()
    return [PayslipOut(
        id=s.id, month=s.month, basic=s.basic, allowances=s.allowances,
        deductions=s.deductions, net_pay=s.net_pay,
        generated_at=s.generated_at.isoformat()
    ) for s in slips]

@router.post("/payslips/generate")
def generate_payslip(month: str, employee_id: int, db: Session = Depends(get_db),
                     current: HREmployee = Depends(require_role(HRRole.company_admin, HRRole.super_admin))):
    emp = db.query(HREmployee).filter(HREmployee.id == employee_id).first()
    if not emp:
        raise HTTPException(404, "Employee not found.")
    basic = emp.salary or 0
    allowances = round(basic * 0.2, 2)
    deductions = round(basic * 0.1, 2)
    net_pay = round(basic + allowances - deductions, 2)
    slip = HRPayslip(
        employee_id=employee_id, month=month,
        basic=basic, allowances=allowances,
        deductions=deductions, net_pay=net_pay,
    )
    db.add(slip)
    db.commit()
    db.refresh(slip)
    return {"message": "Payslip generated.", "net_pay": net_pay, "payslip_id": slip.id}

# ── Reports ───────────────────────────────────────────────────────────────────

@router.get("/reports/summary")
def reports_summary(db: Session = Depends(get_db),
                    current: HREmployee = Depends(require_role(HRRole.company_admin, HRRole.super_admin))):
    if current.role == HRRole.super_admin:
        total_companies = db.query(HRCompany).count() if True else 0
        total_employees = db.query(HREmployee).count()
    else:
        total_companies = 1
        total_employees = db.query(HREmployee).filter(HREmployee.company_id == current.company_id).count()

    from models.hr import HRCompany
    total_companies = db.query(HRCompany).count() if current.role == HRRole.super_admin else 1
    pending_leaves = db.query(HRLeave).filter(HRLeave.status == LeaveStatus.pending).count()

    return {
        "total_companies": total_companies,
        "total_employees": total_employees,
        "pending_leaves": pending_leaves,
    }
