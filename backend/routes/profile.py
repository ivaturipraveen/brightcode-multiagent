from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from schemas.profile import ProfileResponse, ProfileUpdateRequest
from security import get_current_user

router = APIRouter(prefix='/profile', tags=['profile'])


def _serialize_profile(user: User) -> ProfileResponse:
    return ProfileResponse(
        name=user.name,
        email=user.email,
        avatar_url=user.avatar_url or '',
        bio=user.bio or '',
    )


@router.get('', response_model=ProfileResponse)
def get_profile(user: User = Depends(get_current_user)):
    return _serialize_profile(user)


@router.put('', response_model=ProfileResponse)
def update_profile(
    payload: ProfileUpdateRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user.name = payload.name.strip()
    user.email = payload.email.lower().strip()
    user.avatar_url = payload.avatar_url.strip()
    user.bio = payload.bio.strip()
    db.add(user)
    db.commit()
    db.refresh(user)
    return _serialize_profile(user)
