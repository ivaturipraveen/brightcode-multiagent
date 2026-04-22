from datetime import date, datetime
from zoneinfo import ZoneInfo

EST = ZoneInfo("America/New_York")
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.hr import HREmployee, HRCompany, HRLeave, HRRole, CompanyStatus, EmployeeStatus, LeaveStatus
from routes.hr_deps import get_current_hr_employee, require_role

router = APIRouter(prefix="/hr/admin", tags=["HR Admin"])

# ── Schemas ──────────────────────────────────────────────────────────────────

class CompanyOut(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    address: Optional[str]
    industry: Optional[str]
    status: str
    employee_count: int = 0
    class Config:
        from_attributes = True

class EmployeeOut(BaseModel):
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

class StatusUpdate(BaseModel):
    status: str  # "active" | "inactive"

# ── Super Admin: Companies ────────────────────────────────────────────────────

@router.get("/companies", response_model=List[CompanyOut])
def list_companies(db: Session = Depends(get_db), current=Depends(require_role(HRRole.super_admin))):
    companies = db.query(HRCompany).all()
    result = []
    for c in companies:
        count = db.query(HREmployee).filter(HREmployee.company_id == c.id).count()
        result.append(CompanyOut(
            id=c.id, name=c.name, email=c.email, phone=c.phone,
            address=c.address, industry=c.industry, status=c.status.value,
            employee_count=count
        ))
    return result

@router.patch("/companies/{company_id}/status")
def toggle_company_status(company_id: int, payload: StatusUpdate, db: Session = Depends(get_db), current=Depends(require_role(HRRole.super_admin))):
    company = db.query(HRCompany).filter(HRCompany.id == company_id).first()
    if not company:
        raise HTTPException(404, "Company not found.")
    company.status = CompanyStatus.active if payload.status == "active" else CompanyStatus.inactive
    db.commit()
    return {"message": f"Company status updated to {payload.status}."}

@router.delete("/companies/{company_id}")
def delete_company(company_id: int, db: Session = Depends(get_db), current=Depends(require_role(HRRole.super_admin))):
    company = db.query(HRCompany).filter(HRCompany.id == company_id).first()
    if not company:
        raise HTTPException(404, "Company not found.")
    db.delete(company)
    db.commit()
    return {"message": "Company deleted."}

# ── Super Admin / Company Admin: Employees ────────────────────────────────────

@router.get("/employees", response_model=List[EmployeeOut])
def list_employees(db: Session = Depends(get_db), current: HREmployee = Depends(get_current_hr_employee)):
    if current.role == HRRole.super_admin:
        employees = db.query(HREmployee).all()
    elif current.role == HRRole.company_admin:
        employees = db.query(HREmployee).filter(HREmployee.company_id == current.company_id).all()
    else:
        raise HTTPException(403, "Not authorized.")
    return [EmployeeOut(
        id=e.id, name=e.name, email=e.email, role=e.role.value,
        department=e.department, designation=e.designation, phone=e.phone,
        salary=e.salary, status=e.status.value, company_id=e.company_id
    ) for e in employees]

@router.patch("/employees/{employee_id}/status")
def toggle_employee_status(employee_id: int, payload: StatusUpdate, db: Session = Depends(get_db), current: HREmployee = Depends(get_current_hr_employee)):
    emp = db.query(HREmployee).filter(HREmployee.id == employee_id).first()
    if not emp:
        raise HTTPException(404, "Employee not found.")
    # Company admin can only manage their own company
    if current.role == HRRole.company_admin and emp.company_id != current.company_id:
        raise HTTPException(403, "Not authorized.")
    emp.status = EmployeeStatus.active if payload.status == "active" else EmployeeStatus.inactive
    db.commit()
    return {"message": f"Employee status updated to {payload.status}."}

@router.get("/employees/{employee_id}", response_model=EmployeeOut)
def get_employee(employee_id: int, db: Session = Depends(get_db), current: HREmployee = Depends(get_current_hr_employee)):
    emp = db.query(HREmployee).filter(HREmployee.id == employee_id).first()
    if not emp:
        raise HTTPException(404, "Employee not found.")
    if current.role == HRRole.company_admin and emp.company_id != current.company_id:
        raise HTTPException(403, "Not authorized.")
    return EmployeeOut(
        id=emp.id, name=emp.name, email=emp.email, role=emp.role.value,
        department=emp.department, designation=emp.designation, phone=emp.phone,
        salary=emp.salary, status=emp.status.value, company_id=emp.company_id
    )

@router.patch("/employees/{employee_id}")
def update_employee(employee_id: int, payload: dict, db: Session = Depends(get_db), current: HREmployee = Depends(get_current_hr_employee)):
    """Admin can update employee details."""
    if current.role not in (HRRole.company_admin, HRRole.super_admin):
        raise HTTPException(403, "Not authorized.")
    emp = db.query(HREmployee).filter(HREmployee.id == employee_id).first()
    if not emp:
        raise HTTPException(404, "Employee not found.")
    if current.role == HRRole.company_admin and emp.company_id != current.company_id:
        raise HTTPException(403, "Not authorized.")
    allowed = ['name', 'department', 'designation', 'phone', 'salary', 'address']
    for field in allowed:
        if field in payload:
            setattr(emp, field, payload[field])
    db.commit()
    db.refresh(emp)
    return EmployeeOut(
        id=emp.id, name=emp.name, email=emp.email, role=emp.role.value,
        department=emp.department, designation=emp.designation, phone=emp.phone,
        salary=emp.salary, status=emp.status.value, company_id=emp.company_id
    )

# ── Admin: Apply Leave on Behalf ────────────────────────────────────────────

class AdminLeaveRequest(BaseModel):
    employee_id: int
    leave_type: str
    from_date: str
    to_date: str
    reason: Optional[str] = None

@router.post("/leave/apply", status_code=201)
def admin_apply_leave(payload: AdminLeaveRequest, db: Session = Depends(get_db),
                      current: HREmployee = Depends(require_role(HRRole.company_admin, HRRole.super_admin))):
    """Company admin applies leave on behalf of an employee."""
    emp = db.query(HREmployee).filter(HREmployee.id == payload.employee_id).first()
    if not emp:
        raise HTTPException(404, "Employee not found.")
    if current.role == HRRole.company_admin and emp.company_id != current.company_id:
        raise HTTPException(403, "Employee not in your company.")

    from_date = date.fromisoformat(payload.from_date)
    to_date = date.fromisoformat(payload.to_date)
    if to_date < from_date:
        raise HTTPException(400, "to_date must be >= from_date.")
    days = (to_date - from_date).days + 1

    leave = HRLeave(
        employee_id=payload.employee_id,
        leave_type=payload.leave_type,
        from_date=from_date,
        to_date=to_date,
        days=days,
        reason=payload.reason,
        status=LeaveStatus.approved,  # admin-applied leaves auto-approved
        reviewed_by=current.id,
        reviewed_at=datetime.now(EST),
    )
    db.add(leave)
    db.commit()
    db.refresh(leave)
    return {"message": "Leave applied and approved.", "leave_id": leave.id, "days": days}
