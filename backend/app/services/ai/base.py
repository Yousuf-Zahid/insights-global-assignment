from typing import Protocol

from app.models import Insight


class AIService(Protocol):
    """Anything that can turn a prompt into insights, e.g. a mock or a real LLM client."""

    def generate_insights(self, prompt: str, target_language: str) -> list[Insight]: ...
