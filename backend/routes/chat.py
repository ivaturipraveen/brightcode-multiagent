import json
import os
from typing import AsyncGenerator

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from openai import AsyncOpenAI

from backend.models.user import User
from backend.schemas.chat import ChatRequest
from backend.security import get_current_user

router = APIRouter(tags=["chat"])


def _sse(data: str) -> str:
    return f"data: {data}\n\n"


async def generate_chat_events(message: str) -> AsyncGenerator[str, None]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not set")

    client = AsyncOpenAI(api_key=api_key)
    stream = await client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": message}],
        stream=True,
    )

    async for chunk in stream:
        delta = ""
        if chunk.choices:
            delta = chunk.choices[0].delta.content or ""
        if delta:
            yield _sse(json.dumps({"token": delta}))

    yield _sse("[DONE]")


@router.post("/chat")
async def chat(payload: ChatRequest, user: User = Depends(get_current_user)):
    _ = user
    return StreamingResponse(generate_chat_events(payload.message), media_type="text/event-stream")
