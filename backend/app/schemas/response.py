from typing import Literal
from uuid import UUID

from app.schemas.base import CamelModel
from app.schemas.insight import InsightOut
from app.schemas.pagination import Pagination


class InsightsSuccessResponse(CamelModel):
    status: Literal["SUCCESS"] = "SUCCESS"
    context_id: UUID
    data: list[InsightOut]
    pagination: Pagination | None


class ClarificationResponse(CamelModel):
    status: Literal["NEEDS_CLARIFICATION"] = "NEEDS_CLARIFICATION"
    message: str
