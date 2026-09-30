import math
from uuid import UUID, uuid4

from app.core.constants import CLARIFICATION_MESSAGE, PAGE_SIZE
from app.core.exceptions import ContextNotFoundError
from app.repositories.conversation_repository import ConversationRepository
from app.repositories.insight_repository import InsightRepository
from app.schemas.insight import InsightOut
from app.schemas.pagination import Pagination
from app.schemas.request import InsightRequest
from app.schemas.response import ClarificationResponse, InsightsSuccessResponse
from app.services.ai.base import AIService
from app.services.prompt_guard import needs_clarification


def _build_pagination(page: int, page_size: int, total_items: int) -> Pagination | None:
    if total_items <= page_size:
        return None
    total_pages = math.ceil(total_items / page_size)
    return Pagination(
        page=page,
        page_size=page_size,
        total_items=total_items,
        total_pages=total_pages,
        has_more=page < total_pages,
    )


class InsightService:
    """Orchestrates: prompt guard -> AI service -> persist conversation -> paginate."""

    def __init__(
        self,
        ai_service: AIService,
        insights: InsightRepository,
        conversations: ConversationRepository,
    ) -> None:
        self._ai_service = ai_service
        self._insights = insights
        self._conversations = conversations

    def submit(self, request: InsightRequest) -> InsightsSuccessResponse | ClarificationResponse:
        if needs_clarification(request.prompt):
            return ClarificationResponse(message=CLARIFICATION_MESSAGE)

        results = self._ai_service.generate_insights(request.prompt, request.target_language)
        context_id = request.context_id or uuid4()
        result_ids = [insight.id for insight in results]
        self._conversations.save(context_id, request.prompt, request.target_language, result_ids)
        return self._page_response(context_id, result_ids, page=1, page_size=PAGE_SIZE)

    def get_page(self, context_id: UUID, page: int, page_size: int) -> InsightsSuccessResponse:
        conversation = self._conversations.get(context_id)
        if conversation is None:
            raise ContextNotFoundError(context_id)
        return self._page_response(context_id, conversation.result_ids, page, page_size)

    def _page_response(
        self, context_id: UUID, result_ids: list[int], page: int, page_size: int
    ) -> InsightsSuccessResponse:
        start = (page - 1) * page_size
        rows = self._insights.get_by_ids(result_ids[start : start + page_size])
        return InsightsSuccessResponse(
            context_id=context_id,
            data=[InsightOut.model_validate(row) for row in rows],
            pagination=_build_pagination(page, page_size, len(result_ids)),
        )
