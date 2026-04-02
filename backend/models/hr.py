from datetime import date, datetime
from sqlalchemy import Boolean, Column, Date, DateTime, Float, ForeignKey, Integer, String, Text, Enum
from sqlalchemy.orm import relationship
from database import Base
import enum


class CompanyStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"


class EmployeeStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"


class HRRole(str, enum.Enum):
    super_admin = "super_admin"
    company_admin = "company_admin"
    employee = "employee"


class LeaveStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class HRCompany(Base):
    __tablename__ = "hr_companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    industry = Column(String, nullable=True)
    status = Column(Enum(CompanyStatus), default=CompanyStatus.active)
    created_at = Column(DateTime, default=datetime.utcnow)

    employees = relationship("HREmployee", back_populates="company", cascade="all, delete-orphan")


class HREmployee(Base):
    __tablename__ = "hr_employees"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("hr_companies.id"), nullable=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(HRRole), default=HRRole.employee)
    department = Column(String, nullable=True)
    designation = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    date_of_joining = Column(Date, nullable=True)
    salary = Column(Float, nullable=True)
    status = Column(Enum(EmployeeStatus), default=EmployeeStatus.active)
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("HRCompany", back_populates="employees")
    attendance = relationship("HRAttendance", back_populates="employee", cascade="all, delete-orphan")
    leaves = relationship("HRLeave", back_populates="employee", cascade="all, delete-orphan", foreign_keys="[HRLeave.employee_id]")
    payslips = relationship("HRPayslip", back_populates="employee", cascade="all, delete-orphan")


class HRAttendance(Base):
    __tablename__ = "hr_attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("hr_employees.id"), nullable=False)
    date = Column(Date, default=date.today)
    clock_in = Column(DateTime, nullable=True)
    clock_out = Column(DateTime, nullable=True)
    total_hours = Column(Float, nullable=True)
    status = Column(String, default="present")  # present, absent, half-day

    employee = relationship("HREmployee", back_populates="attendance")


class HRLeave(Base):
    __tablename__ = "hr_leaves"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("hr_employees.id"), nullable=False)
    leave_type = Column(String, nullable=False)  # sick, casual, earned
    from_date = Column(Date, nullable=False)
    to_date = Column(Date, nullable=False)
    days = Column(Integer, nullable=False)
    reason = Column(Text, nullable=True)
    status = Column(Enum(LeaveStatus), default=LeaveStatus.pending)
    applied_at = Column(DateTime, default=datetime.utcnow)
    reviewed_by = Column(Integer, ForeignKey("hr_employees.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)

    employee = relationship("HREmployee", back_populates="leaves", foreign_keys=[employee_id], primaryjoin="HRLeave.employee_id == HREmployee.id")


class HRPayslip(Base):
    __tablename__ = "hr_payslips"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("hr_employees.id"), nullable=False)
    month = Column(String, nullable=False)  # e.g. "2024-03"
    basic = Column(Float, default=0)
    allowances = Column(Float, default=0)
    deductions = Column(Float, default=0)
    net_pay = Column(Float, default=0)
    generated_at = Column(DateTime, default=datetime.utcnow)

    employee = relationship("HREmployee", back_populates="payslips")
