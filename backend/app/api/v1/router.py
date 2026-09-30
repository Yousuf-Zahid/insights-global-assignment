from fastapi import APIRouter

from app.api.v1.endpoints import insights

api_router = APIRouter()
api_router.include_router(insights.router)
