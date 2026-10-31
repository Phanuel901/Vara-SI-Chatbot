from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chat import router as chat_router
from app.api.health import router as health_router
from app.core.config import settings
from app.api.auth import router as auth_router
from app.api.conversations import router as conversations_router

app = FastAPI(
    title=settings.APP_NAME,
    description="Vara's AI assistant backend.",
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
)


# Allow the Next.js frontend to communicate with the backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routes.
app.include_router(
    health_router,
)

app.include_router(
    chat_router,
    prefix="/api/v1",
)

app.include_router(
    auth_router,
    prefix = "/api/v1",
)

app.include_router(
    chat_router,
    prefix = "/api/v1",
)

app.include_router(
    conversations_router,
    prefix="/api/v1",
)

@app.on_event("startup")
def startup_event():
    print(f"{settings.APP_NAME} backend started.")
    print(f"Version: {settings.APP_VERSION}")


