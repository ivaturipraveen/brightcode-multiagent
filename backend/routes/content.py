import os
import uuid
from datetime import datetime, timezone
from typing import Dict

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models.content import ContentBlock
from models.user import User
from security import get_current_user

router = APIRouter(prefix="/content", tags=["content"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "static", "uploads")
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"}
MAX_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user


# ── Public endpoints ─────────────────────────────────────────────────────────

@router.get("", response_model=Dict[str, str])
def get_all_content(db: Session = Depends(get_db)):
    """Return all content blocks as a flat key→value dict."""
    blocks = db.query(ContentBlock).all()
    return {b.key: b.value for b in blocks}


@router.get("/{key}", response_model=Dict[str, str])
def get_content_block(key: str, db: Session = Depends(get_db)):
    block = db.query(ContentBlock).filter(ContentBlock.key == key).first()
    if not block:
        raise HTTPException(status_code=404, detail=f"Content key '{key}' not found")
    return {"key": block.key, "value": block.value, "content_type": block.content_type}


# ── Admin endpoints ──────────────────────────────────────────────────────────

class ContentUpdateRequest(BaseModel):
    value: str


@router.put("/{key}", response_model=Dict[str, str])
def update_content_block(
    key: str,
    payload: ContentUpdateRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Update a text content block. Admin only."""
    block = db.query(ContentBlock).filter(ContentBlock.key == key).first()
    if not block:
        # Auto-create if key doesn't exist
        block = ContentBlock(
            key=key,
            content_type="text",
            value=payload.value,
            updated_by=admin.id,
            updated_at=datetime.now(timezone.utc),
        )
        db.add(block)
    else:
        block.value = payload.value
        block.updated_by = admin.id
        block.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(block)
    return {"key": block.key, "value": block.value, "content_type": block.content_type}


@router.post("/upload-image", response_model=Dict[str, str])
async def upload_image(
    key: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Upload an image and associate it with a content key. Admin only."""
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")

    contents = await file.read()
    if len(contents) > MAX_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File too large. Max 5MB allowed.")

    # Save with UUID filename to avoid collisions
    ext = os.path.splitext(file.filename or "upload")[1] or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(contents)

    image_url = f"/static/uploads/{filename}"

    # Upsert content block
    block = db.query(ContentBlock).filter(ContentBlock.key == key).first()
    if not block:
        block = ContentBlock(
            key=key,
            content_type="image",
            value=image_url,
            updated_by=admin.id,
            updated_at=datetime.now(timezone.utc),
        )
        db.add(block)
    else:
        block.content_type = "image"
        block.value = image_url
        block.updated_by = admin.id
        block.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(block)
    return {"key": block.key, "value": image_url, "content_type": "image"}
