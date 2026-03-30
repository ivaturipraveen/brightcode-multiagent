from typing import Literal

from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    conversation_id: int | None = None


class ConversationCreateRequest(BaseModel):
    title: str | None = None


class ConversationResponse(BaseModel):
    id: int
    title: str
    created_at: str | None = None
    updated_at: str | None = None


class ChatMessageResponse(BaseModel):
    id: int
    role: Literal['user', 'assistant']
    content: str
    created_at: str | None = None
