from typing import Annotated
from uuid import UUID

from pydantic import StringConstraints, field_validator

from app.core.constants import MAX_PROMPT_LENGTH, SUPPORTED_LANGUAGES
from app.schemas.base import CamelModel

Prompt = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=1, max_length=MAX_PROMPT_LENGTH),
]


class InsightRequest(CamelModel):
    prompt: Prompt
    target_language: str
    context_id: UUID | None = None

    @field_validator("target_language", mode="before")
    @classmethod
    def normalize_language(cls, value: object) -> str:
        normalized = value.strip().lower() if isinstance(value, str) else ""
        if normalized not in SUPPORTED_LANGUAGES:
            raise ValueError("Target language is not supported")
        return normalized
