import os
from datetime import datetime, timedelta, timezone

import resend
from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from schemas.auth import ForgotPasswordRequest, LoginRequest, RegisterRequest, RegisterResponse, ResetPasswordRequest, TokenResponse
from security import create_access_token, get_jwt_secret, hash_password, verify_password

RESET_TOKEN_EXPIRE_MINUTES = 30
RESET_ALGORITHM = "HS256"
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://www.wowfinedining.com")

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=RegisterResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = User(
        name=payload.name.strip(),
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        avatar_url='',
        bio='',
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(str(user.id))
    return RegisterResponse(
        access_token=token,
        token_type='bearer',
        name=user.name,
        email=user.email,
        avatar_url=user.avatar_url or '',
        bio=user.bio or '',
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token)


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    # Always return success to prevent email enumeration
    if not user:
        return {"message": "If that email exists, a reset link has been sent."}

    expire = datetime.now(timezone.utc) + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)
    reset_token = jwt.encode(
        {"sub": str(user.id), "exp": expire, "type": "password_reset"},
        get_jwt_secret(),
        algorithm=RESET_ALGORITHM,
    )

    reset_url = f"{FRONTEND_URL}/reset-password?token={reset_token}"

    api_key = os.getenv("RESEND_API_KEY")
    if api_key:
        resend.api_key = api_key
        try:
            resend.Emails.send({
                "from": "info@wowfinedining.com",
                "to": user.email,
                "subject": "Reset your Brightcone password",
                "html": f"""
                <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
                  <h2 style="color:#0f172a">Reset your password</h2>
                  <p style="color:#475569">Click the button below to reset your password. This link expires in 30 minutes.</p>
                  <a href="{reset_url}" style="display:inline-block;margin:24px 0;padding:14px 28px;background:#0f172a;color:#fff;border-radius:999px;text-decoration:none;font-weight:500">
                    Reset Password
                  </a>
                  <p style="color:#94a3b8;font-size:13px">If you didn't request this, you can safely ignore this email.</p>
                </div>
                """,
            })
        except Exception:
            pass  # Never expose email errors to client

    return {"message": "If that email exists, a reset link has been sent."}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid or expired reset token.",
    )
    try:
        data = jwt.decode(payload.token, get_jwt_secret(), algorithms=[RESET_ALGORITHM])
        if data.get("type") != "password_reset":
            raise credentials_exception
        user_id = int(data.get("sub", 0))
    except (JWTError, ValueError):
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise credentials_exception

    if len(payload.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")

    user.password_hash = hash_password(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully."}
