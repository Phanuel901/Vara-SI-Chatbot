from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from google.genai.errors import APIError
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.user import User
from app.schemas.conversation import MessageCreate, MessageResponse
from app.services.gemini import generate_response


router = APIRouter(
    prefix="/conversations",
    tags=["Chat"],
)


@router.post(
    "/{conversation_id}/messages",
    response_model=MessageResponse,
)
def send_message(
    conversation_id: int,
    request: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Find the conversation and verify its ownership.
    conversation = db.scalar(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id,
        )
    )

    if conversation is None:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found.",
        )

    # Load previous messages to maintain conversation context.
    previous_messages = db.scalars(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at, Message.id)
    ).all()

    gemini_messages = []

    for message in previous_messages:
        gemini_messages.append({
            "role": (
                "model" if message.role == "assistant"
                else "user"
            ),
            "parts": [{"text": message.content}],
        })

    gemini_messages.append({
        "role": "user",
        "parts": [{"text": request.content}],
    })

    # Generate the AI response before saving either message.
    try:
        reply = generate_response(gemini_messages)

    except APIError as exc:
        print(f"Gemini API error: {exc}")

        raise HTTPException(
            status_code=502,
            detail="Vara could not get a response from Gemini.",
        ) from exc

    except ValueError as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        ) from exc

    # Save both messages after successful generation.
    user_message = Message(
        conversation_id=conversation_id,
        role="user",
        content=request.content,
    )

    assistant_message = Message(
        conversation_id=conversation_id,
        role="assistant",
        content=reply,
    )

    db.add_all([user_message, assistant_message])

    # Update the conversation's last activity time.
    conversation.updated_at = datetime.now(timezone.utc)

    try:
        db.commit()
        db.refresh(assistant_message)

    except Exception:
        db.rollback()
        raise

    return assistant_message