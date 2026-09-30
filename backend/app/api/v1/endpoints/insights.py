from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.constants import MAX_PAGE_SIZE, PAGE_SIZE
from app.db.session import get_db
from app.repositories.conversation_repository import ConversationRepository
from app.repositories.insight_repository import InsightRepository
from app.schemas.error import ErrorResponse
from app.schemas.request import InsightRequest
from app.schemas.response import ClarificationResponse, InsightsSuccessResponse
from app.services.ai.base import AIService
from app.services.ai.mock_ai import MockAIService
from app.services.insight_service import InsightService

router = APIRouter(prefix="/insights", tags=["insights"])

SessionDep = Annotated[Session, Depends(get_db)]


def get_ai_service(session: SessionDep) -> AIService:
    return MockAIService(InsightRepository(session))


def get_insight_service(
    session: SessionDep, ai_service: Annotated[AIService, Depends(get_ai_service)]
) -> InsightService:
    return InsightService(ai_service, InsightRepository(session), ConversationRepository(session))


InsightServiceDep = Annotated[InsightService, Depends(get_insight_service)]


@router.post("", responses={422: {"model": ErrorResponse}})
def submit_prompt(
    payload: InsightRequest, service: InsightServiceDep
) -> InsightsSuccessResponse | ClarificationResponse:
    return service.submit(payload)


@router.get(
    "/{context_id}",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
def get_insights_page(
    context_id: UUID,
    service: InsightServiceDep,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(alias="pageSize", ge=1, le=MAX_PAGE_SIZE)] = PAGE_SIZE,
) -> InsightsSuccessResponse:
    return service.get_page(context_id, page, page_size)
