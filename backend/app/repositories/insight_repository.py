from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Insight


class InsightRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def list_by_language(self, language: str) -> list[Insight]:
        statement = select(Insight).where(Insight.language == language).order_by(Insight.id)
        return list(self._session.scalars(statement))

    def get_by_ids(self, insight_ids: Sequence[int]) -> list[Insight]:
        """Returns the insights for the given ids, preserving the order of `insight_ids`."""
        if not insight_ids:
            return []
        statement = select(Insight).where(Insight.id.in_(insight_ids))
        by_id = {insight.id: insight for insight in self._session.scalars(statement)}
        return [by_id[insight_id] for insight_id in insight_ids if insight_id in by_id]
