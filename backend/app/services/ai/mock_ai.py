import re
import unicodedata

from app.models import Insight
from app.repositories.insight_repository import InsightRepository

WORD_PATTERN = re.compile(r"[^\W_]+")
MIN_TITLE_TERM_LENGTH = 4
MIN_STEM_LENGTH = 4


def _words(text: str) -> set[str]:
    """Lower-cased, accent-free words so that "autenticación" matches "autenticacion"."""
    decomposed = unicodedata.normalize("NFKD", text.lower())
    stripped = "".join(char for char in decomposed if not unicodedata.combining(char))
    return set(WORD_PATTERN.findall(stripped))


def _terms_match(keyword: str, term: str) -> bool:
    if keyword == term:
        return True
    return min(len(keyword), len(term)) >= MIN_STEM_LENGTH and (
        keyword.startswith(term) or term.startswith(keyword)
    )


def _score(keywords: set[str], insight: Insight) -> int:
    tag_terms = {word for tag in insight.tags for word in _words(tag)}
    title_terms = {word for word in _words(insight.title) if len(word) >= MIN_TITLE_TERM_LENGTH}
    terms = tag_terms | title_terms
    return sum(any(_terms_match(keyword, term) for term in terms) for keyword in keywords)


class MockAIService:
    """Stand-in for an LLM: keyword-matches the prompt against seeded insights."""

    def __init__(self, insights: InsightRepository) -> None:
        self._insights = insights

    def generate_insights(self, prompt: str, target_language: str) -> list[Insight]:
        candidates = self._insights.list_by_language(target_language)
        keywords = _words(prompt)
        scored = [(_score(keywords, insight), insight) for insight in candidates]
        matches = sorted((pair for pair in scored if pair[0] > 0), key=lambda pair: -pair[0])
        return [insight for _, insight in matches] or candidates
