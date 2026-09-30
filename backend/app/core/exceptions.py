from enum import StrEnum
from http import HTTPStatus
from uuid import UUID


class ErrorCode(StrEnum):
    INVALID_PROMPT = "INVALID_PROMPT"
    INVALID_LANGUAGE = "INVALID_LANGUAGE"
    INVALID_CONTEXT_ID = "INVALID_CONTEXT_ID"
    VALIDATION_ERROR = "VALIDATION_ERROR"
    CONTEXT_NOT_FOUND = "CONTEXT_NOT_FOUND"
    NOT_FOUND = "NOT_FOUND"
    METHOD_NOT_ALLOWED = "METHOD_NOT_ALLOWED"
    HTTP_ERROR = "HTTP_ERROR"
    INTERNAL_ERROR = "INTERNAL_ERROR"


class ApiError(Exception):
    """Domain error that is rendered as a structured JSON error response."""

    def __init__(self, status_code: HTTPStatus, code: ErrorCode, message: str) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.code = code
        self.message = message


class ContextNotFoundError(ApiError):
    def __init__(self, context_id: UUID) -> None:
        super().__init__(
            HTTPStatus.NOT_FOUND,
            ErrorCode.CONTEXT_NOT_FOUND,
            f"No conversation found for contextId {context_id}",
        )
