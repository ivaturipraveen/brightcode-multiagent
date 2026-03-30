import json
import os
from typing import AsyncGenerator

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from openai import AsyncOpenAI
from sqlalchemy.orm import Session

from database import get_db
from models.chat import ChatMessage, Conversation
from models.user import User
from schemas.chat import (
    ChatMessageResponse,
    ChatRequest,
    ConversationCreateRequest,
    ConversationResponse,
)
from security import get_current_user

router = APIRouter(tags=['chat'])


def _sse(data: str) -> str:
    return f'data: {data}\n\n'


def _conversation_title(message: str) -> str:
    trimmed = message.strip()
    return (trimmed[:57] + '...') if len(trimmed) > 60 else trimmed or 'New chat'


def _serialize_conversation(conversation: Conversation) -> ConversationResponse:
    return ConversationResponse(
        id=conversation.id,
        title=conversation.title,
        created_at=conversation.created_at.isoformat() if conversation.created_at else None,
        updated_at=conversation.updated_at.isoformat() if conversation.updated_at else None,
    )


def _serialize_message(message: ChatMessage) -> ChatMessageResponse:
    return ChatMessageResponse(
        id=message.id,
        role=message.role,
        content=message.content,
        created_at=message.created_at.isoformat() if message.created_at else None,
    )


async def generate_chat_events(
    db: Session,
    conversation: Conversation,
    message: str,
) -> AsyncGenerator[str, None]:
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail='OPENAI_API_KEY is not set')

    db_message = ChatMessage(conversation_id=conversation.id, role='user', content=message)
    db.add(db_message)
    db.commit()

    history = (
        db.query(ChatMessage)
        .filter(ChatMessage.conversation_id == conversation.id)
        .order_by(ChatMessage.id.asc())
        .all()
    )

    client = AsyncOpenAI(api_key=api_key)
    stream = await client.chat.completions.create(
        model='gpt-4o',
        messages=[{'role': item.role, 'content': item.content} for item in history],
        stream=True,
    )

    assistant_parts: list[str] = []
    async for chunk in stream:
        delta = ''
        if chunk.choices:
            delta = chunk.choices[0].delta.content or ''
        if delta:
            assistant_parts.append(delta)
            yield _sse(json.dumps({'token': delta, 'conversation_id': conversation.id}))

    assistant_text = ''.join(assistant_parts)
    db.add(ChatMessage(conversation_id=conversation.id, role='assistant', content=assistant_text))
    if conversation.title == 'New chat':
        conversation.title = _conversation_title(message)
    db.add(conversation)
    db.commit()

    yield _sse('[DONE]')


@router.get('/conversations', response_model=list[ConversationResponse])
def list_conversations(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conversations = (
        db.query(Conversation)
        .filter(Conversation.user_id == user.id)
        .order_by(Conversation.updated_at.desc(), Conversation.id.desc())
        .all()
    )
    return [_serialize_conversation(conversation) for conversation in conversations]


@router.post('/conversations', response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
def create_conversation(
    payload: ConversationCreateRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversation = Conversation(user_id=user.id, title=(payload.title or 'New chat').strip() or 'New chat')
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return _serialize_conversation(conversation)


@router.get('/conversations/{conversation_id}/messages', response_model=list[ChatMessageResponse])
def list_conversation_messages(
    conversation_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversation = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id, Conversation.user_id == user.id)
        .first()
    )
    if not conversation:
        raise HTTPException(status_code=404, detail='Conversation not found')

    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.conversation_id == conversation.id)
        .order_by(ChatMessage.id.asc())
        .all()
    )
    return [_serialize_message(message) for message in messages]


@router.post('/chat')
async def chat(
    payload: ChatRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversation = None
    if payload.conversation_id is not None:
        conversation = (
            db.query(Conversation)
            .filter(Conversation.id == payload.conversation_id, Conversation.user_id == user.id)
            .first()
        )
        if not conversation:
            raise HTTPException(status_code=404, detail='Conversation not found')
    else:
        conversation = Conversation(user_id=user.id, title='New chat')
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

    return StreamingResponse(
        generate_chat_events(db, conversation, payload.message),
        media_type='text/event-stream',
    )
