from uuid import uuid4

from fastapi.testclient import TestClient

INSIGHTS_URL = "/api/v1/insights"
BROAD_PROMPT = "quantum gardening tips"
TOTAL_ENGLISH_INSIGHTS = 26


def _submit(client: TestClient, prompt: str, **extra: str) -> dict:
    response = client.post(INSIGHTS_URL, json={"prompt": prompt, "targetLanguage": "en", **extra})
    assert response.status_code == 200
    return response.json()


def test_more_than_ten_results_are_paginated(client: TestClient) -> None:
    body = _submit(client, BROAD_PROMPT)

    assert len(body["data"]) == 10
    assert body["pagination"] == {
        "page": 1,
        "pageSize": 10,
        "totalItems": TOTAL_ENGLISH_INSIGHTS,
        "totalPages": 3,
        "hasMore": True,
    }


def test_second_and_last_pages_are_served_by_context_id(client: TestClient) -> None:
    first = _submit(client, BROAD_PROMPT)
    context_id = first["contextId"]

    second = client.get(f"{INSIGHTS_URL}/{context_id}", params={"page": 2}).json()
    third = client.get(f"{INSIGHTS_URL}/{context_id}", params={"page": 3}).json()
    beyond = client.get(f"{INSIGHTS_URL}/{context_id}", params={"page": 4}).json()

    assert second["pagination"]["page"] == 2
    assert second["pagination"]["hasMore"] is True
    assert len(second["data"]) == 10
    assert len(third["data"]) == TOTAL_ENGLISH_INSIGHTS - 20
    assert third["pagination"]["hasMore"] is False
    assert beyond["data"] == []

    seen_ids = [item["id"] for page in (first, second, third) for item in page["data"]]
    assert len(seen_ids) == len(set(seen_ids)) == TOTAL_ENGLISH_INSIGHTS


def test_ten_or_fewer_results_have_no_pagination(client: TestClient) -> None:
    body = _submit(client, "zero trust security")

    assert 0 < len(body["data"]) <= 10
    assert body["pagination"] is None


def test_page_size_is_validated(client: TestClient) -> None:
    context_id = _submit(client, BROAD_PROMPT)["contextId"]

    response = client.get(f"{INSIGHTS_URL}/{context_id}", params={"pageSize": 51})

    assert response.status_code == 422
    assert response.json()["error"] == "VALIDATION_ERROR"


def test_existing_context_id_is_reused(client: TestClient) -> None:
    context_id = str(uuid4())

    first = _submit(client, BROAD_PROMPT, contextId=context_id)
    second = _submit(client, "zero trust security", contextId=context_id)

    assert first["contextId"] == second["contextId"] == context_id
    stored = client.get(f"{INSIGHTS_URL}/{context_id}").json()
    assert stored["pagination"] is None
