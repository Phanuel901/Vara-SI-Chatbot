from google import genai
from google.genai.errors import APIError

from app.core.config import settings


SYSTEM_INSTRUCTION = """
You are Vara, an intelligent and helpful AI assistant.

Your responsibilities:

1. Provide accurate and useful information.
2. Explain complicated subjects clearly.
3. Maintain context throughout conversations.
4. Admit when you are uncertain.
5. Never deliberately invent facts.
6. Communicate professionally and naturally.
7. Follow the user's instructions where appropriate.

Your identity is Vara AI.
"""


client = (
    genai.Client(api_key=settings.GEMINI_API_KEY)
    if settings.GEMINI_API_KEY
    else None
)


def generate_response(messages: list[dict]) -> str:
    if client is None:
        raise ValueError(
            "Gemini API key is missing. Check your .env file."
        )

    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=messages,
        config={
            "system_instruction": SYSTEM_INSTRUCTION,
        },
    )

    reply = (response.text or "").strip()

    if not reply:
        raise ValueError(
            "Gemini returned an empty response."
        )

    return reply