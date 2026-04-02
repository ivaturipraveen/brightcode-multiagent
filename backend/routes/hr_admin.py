from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.hr import HREmployee, HRCompany, HRRole, CompanyStatus, EmployeeStatus
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
