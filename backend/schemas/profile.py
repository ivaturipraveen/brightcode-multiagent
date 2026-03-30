from pydantic import BaseModel, EmailStr


class ProfileResponse(BaseModel):
    name: str
    email: EmailStr
    avatar_url: str = ''
    bio: str = ''


class ProfileUpdateRequest(BaseModel):
    name: str
    email: EmailStr
    avatar_url: str = ''
    bio: str = ''
