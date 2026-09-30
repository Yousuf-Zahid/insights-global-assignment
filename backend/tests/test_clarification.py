from unittest.mock import Mock

import pytest
from fastapi.testclient import TestClient

INSIGHTS_URL = "/api/v1/insights"
CLARIFICATION_BODY = {"status": "NEEDS_CLARIFICATION", "message": "Please provide more details"}


@pytest.mark.parametrize("prompt", ["hey", "  ok  ", "????", "12345", "hello", "help help"])
def test_thin_prompt_needs_clarification_without_calling_ai(
    client: TestClient, ai_spy: Mock, prompt: str
) -> None:
    response = client.post(INSIGHTS_URL, json={"prompt": prompt, "targetLanguage": "en"})

    assert response.status_code == 200
    assert response.json() == CLARIFICATION_BODY
    ai_spy.generate_insights.assert_not_called()


def test_detailed_prompt_calls_ai_once(client: TestClient, ai_spy: Mock) -> None:
    response = client.post(
        INSIGHTS_URL, json={"prompt": "Explain zero trust security", "targetLanguage": "de"}
    )

    assert response.status_code == 200
    assert response.json()["status"] == "SUCCESS"
    ai_spy.generate_insights.assert_called_once_with("Explain zero trust security", "de")
