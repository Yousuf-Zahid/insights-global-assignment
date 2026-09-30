from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

INSIGHTS_URL = "/api/v1/insights"
VALID_PROMPT = "How can we improve cloud security?"


@pytest.mark.parametrize("prompt", ["", "   "])
def test_empty_prompt_is_rejected(client: TestClient, prompt: str) -> None:
    response = client.post(INSIGHTS_URL, json={"prompt": prompt, "targetLanguage": "en"})

    assert response.status_code == 422
    body = response.json()
    assert body["error"] == "INVALID_PROMPT"
    assert body["details"][0]["field"] == "prompt"


def test_missing_prompt_is_rejected(client: TestClient) -> None:
    response = client.post(INSIGHTS_URL, json={"targetLanguage": "en"})

    assert response.status_code == 422
    assert response.json()["error"] == "INVALID_PROMPT"


def test_unsupported_language_is_rejected(client: TestClient) -> None:
    response = client.post(INSIGHTS_URL, json={"prompt": VALID_PROMPT, "targetLanguage": "xx"})

    assert response.status_code == 422
    assert response.json() == {
        "error": "INVALID_LANGUAGE",
        "message": "Target language is not supported",
        "details": [{"field": "targetLanguage", "message": "Target language is not supported"}],
    }


def test_missing_language_is_rejected(client: TestClient) -> None:
    response = client.post(INSIGHTS_URL, json={"prompt": VALID_PROMPT})

    assert response.status_code == 422
    assert response.json()["error"] == "INVALID_LANGUAGE"


def test_language_is_case_insensitive(client: TestClient) -> None:
    response = client.post(INSIGHTS_URL, json={"prompt": VALID_PROMPT, "targetLanguage": "ES"})

    assert response.status_code == 200
    assert {item["language"] for item in response.json()["data"]} == {"es"}


def test_malformed_context_id_is_rejected(client: TestClient) -> None:
    payload = {"prompt": VALID_PROMPT, "targetLanguage": "en", "contextId": "not-a-uuid"}

    response = client.post(INSIGHTS_URL, json=payload)

    assert response.status_code == 422
    assert response.json()["error"] == "INVALID_CONTEXT_ID"


def test_unknown_context_id_is_accepted_on_post(client: TestClient) -> None:
    context_id = str(uuid4())
    payload = {"prompt": VALID_PROMPT, "targetLanguage": "en", "contextId": context_id}

    response = client.post(INSIGHTS_URL, json=payload)

    assert response.status_code == 200
    assert response.json()["contextId"] == context_id


def test_unknown_context_id_returns_404_on_get(client: TestClient) -> None:
    response = client.get(f"{INSIGHTS_URL}/{uuid4()}")

    assert response.status_code == 404
    assert response.json()["error"] == "CONTEXT_NOT_FOUND"
