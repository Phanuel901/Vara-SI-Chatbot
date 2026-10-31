from fastapi import APIRouter

from app.core.config import settings
from app.database.session import check_database_connection


router = APIRouter(
    tags=["System"],
)


@router.get("/")
def root():
    return {
        "message": "Vara AI backend is running.",
        "application": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


@router.get("/health")
def health_check():
    database_status = (
        "connected"
        if check_database_connection()
        else "not connected"
    )

    return {
        "status": "running",
        "service": settings.APP_NAME,
        "database": database_status,
    }