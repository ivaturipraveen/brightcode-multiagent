from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from database import get_db
from models.hr import HREmployee, HRCompany, HRRole, CompanyStatus, EmployeeStatus
from security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/hr/auth", tags=["HR Auth"])

# ── Schemas ──────────────────────────────────────────────────────────────────

class CompanyRegisterRequest(BaseModel):
    company_name: str
    company_email: str
    company_phone: str | None = None
    company_address: str | None = None
    industry: str | None = None
    admin_name: str
    admin_email: EmailStr
    admin_password: str

class EmployeeRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    company_id: int
    department: str | None = None
    designation: str | None = None
    phone: str | None = None
    date_of_joining: str | None = None
    salary: float | None = None

class HRLoginRequest(BaseModel):
    email: EmailStr
    password: str

class HRLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    name: str
    email: str
    company_id: int | None
    employee_id: int

# ── Routes ───────────────────────────────────────────────────────────────────

@router.post("/register-company", status_code=201)
def register_company(payload: CompanyRegisterRequest, db: Session = Depends(get_db)):
    # Check duplicate company email
    if db.query(HRCompany).filter(HRCompany.email == payload.company_email).first():
        raise HTTPException(400, "Company email already registered.")
    if db.query(HREmployee).filter(HREmployee.email == payload.admin_email).first():
        raise HTTPException(400, "Admin email already registered.")

    company = HRCompany(
        name=payload.company_name,
        email=payload.company_email,
        phone=payload.company_phone,
        address=payload.company_address,
        industry=payload.industry,
    )
    db.add(company)
    db.flush()

    admin = HREmployee(
        company_id=company.id,
        name=payload.admin_name,
        email=payload.admin_email,
        password_hash=hash_password(payload.admin_password),
        role=HRRole.company_admin,
    )
    db.add(admin)
    db.commit()
    db.refresh(company)
    return {"message": "Company registered successfully.", "company_id": company.id}


@router.post("/register-employee", status_code=201)
def register_employee(payload: EmployeeRegisterRequest, db: Session = Depends(get_db)):
    company = db.query(HRCompany).filter(HRCompany.id == payload.company_id).first()
    if not company:
        raise HTTPException(404, "Company not found.")
    if company.status != CompanyStatus.active:
        raise HTTPException(400, "Company is inactive.")
    if db.query(HREmployee).filter(HREmployee.email == payload.email).first():
        raise HTTPException(400, "Email already registered.")

    from datetime import date
    doj = None
    if payload.date_of_joining:
        try:
            doj = date.fromisoformat(payload.date_of_joining)
        except ValueError:
            pass

    emp = HREmployee(
        company_id=payload.company_id,
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=HRRole.employee,
        department=payload.department,
        designation=payload.designation,
        phone=payload.phone,
        date_of_joining=doj,
        salary=payload.salary,
    )
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return {"message": "Employee registered.", "employee_id": emp.id}


@router.post("/register-super-admin", status_code=201)
def register_super_admin(payload: EmployeeRegisterRequest, db: Session = Depends(get_db)):
    """One-time super admin creation (no company required)."""
    if db.query(HREmployee).filter(HREmployee.email == payload.email).first():
        raise HTTPException(400, "Email already registered.")
    emp = HREmployee(
        company_id=None,
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=HRRole.super_admin,
    )
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return {"message": "Super admin created.", "employee_id": emp.id}


@router.post("/login", response_model=HRLoginResponse)
def hr_login(payload: HRLoginRequest, db: Session = Depends(get_db)):
    emp = db.query(HREmployee).filter(HREmployee.email == payload.email).first()
    if not emp or not verify_password(payload.password, emp.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials.")
    if emp.status != EmployeeStatus.active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Account is inactive.")

    token = create_access_token(f"hr:{emp.id}", expires_delta=timedelta(hours=24))
    return HRLoginResponse(
        access_token=token,
        role=emp.role.value,
        name=emp.name,
        email=emp.email,
        company_id=emp.company_id,
        employee_id=emp.id,
    )
