import json
import os
from typing import AsyncGenerator

from openai import OpenAI
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
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
    # Raising past this point is invisible to the client: StreamingResponse has
    # already sent the 200 headers, so an exception just ends the body after zero
    # bytes and the UI renders an empty reply. Every failure below is reported as
    # an SSE error event instead.
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        yield _sse(json.dumps({'error': 'OPENAI_API_KEY is not set', 'conversation_id': conversation.id}))
        yield _sse('[DONE]')
        return

    db_message = ChatMessage(conversation_id=conversation.id, role='user', content=message)
    db.add(db_message)
    db.commit()

    history = (
        db.query(ChatMessage)
        .filter(ChatMessage.conversation_id == conversation.id)
        .order_by(ChatMessage.id.asc())
        .all()
    )

    client = OpenAI(api_key=api_key)

    assistant_parts: list[str] = []

    try:
        stream = client.chat.completions.create(
            model=os.getenv('OPENAI_MODEL', 'gpt-4o-mini'),
            max_tokens=4096,
            messages=[{'role': item.role, 'content': item.content} for item in history],
            stream=True,
        )
        for chunk in stream:
            if not chunk.choices:
                continue
            text = chunk.choices[0].delta.content
            if text:
                assistant_parts.append(text)
                yield _sse(json.dumps({'token': text, 'conversation_id': conversation.id}))
    except Exception as exc:
        yield _sse(json.dumps({
            'error': f'{type(exc).__name__}: {exc}',
            'conversation_id': conversation.id,
        }))
        yield _sse('[DONE]')
        return

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
