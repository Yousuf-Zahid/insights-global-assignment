from datetime import UTC, datetime

from pydantic import ConfigDict, field_validator

from app.schemas.base import CamelModel


class InsightOut(CamelModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    content: str
    category: str
    tags: list[str]
    language: str
    confidence: float
    created_at: datetime

    @field_validator("created_at")
    @classmethod
    def assume_utc(cls, value: datetime) -> datetime:
        """SQLite returns naive datetimes; every stored timestamp is UTC."""
        return value if value.tzinfo else value.replace(tzinfo=UTC)
