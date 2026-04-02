from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from database import get_db
from models.hr import HREmployee, HRRole, EmployeeStatus
from security import get_jwt_secret, ALGORITHM

bearer_scheme = HTTPBearer()

def get_current_hr_employee(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> HREmployee:
    token = credentials.credentials
    exc = HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid HR credentials.")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[ALGORITHM])
        sub = payload.get("sub", "")
        if not sub.startswith("hr:"):
            raise exc
        emp_id = int(sub.split(":")[1])
    except (JWTError, ValueError):
        raise exc

    emp = db.query(HREmployee).filter(HREmployee.id == emp_id).first()
    if not emp:
        raise exc
    if emp.status != EmployeeStatus.active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Account inactive.")
    return emp


def require_role(*roles: HRRole):
    def checker(current: HREmployee = Depends(get_current_hr_employee)):
        if current.role not in roles:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Insufficient permissions.")
        return current
    return checker
