from collections.abc import Iterator
from pathlib import Path
from unittest.mock import Mock, create_autospec

import pytest
from fastapi.testclient import TestClient

from app.api.v1.endpoints.insights import get_ai_service
from app.core.config import Settings
from app.main import create_app
from app.services.ai.base import AIService


@pytest.fixture
def client(tmp_path: Path) -> Iterator[TestClient]:
    """A client backed by an isolated, freshly seeded SQLite file."""
    settings = Settings(database_url=f"sqlite:///{(tmp_path / 'test.db').as_posix()}")
    with TestClient(create_app(settings)) as test_client:
        yield test_client


@pytest.fixture
def ai_spy(client: TestClient) -> Mock:
    """Replaces the AI service with a spy that returns no insights."""
    spy = create_autospec(AIService, instance=True)
    spy.generate_insights.return_value = []
    client.app.dependency_overrides[get_ai_service] = lambda: spy
    return spy
