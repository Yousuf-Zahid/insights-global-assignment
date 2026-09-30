import logging
from http import HTTPStatus
from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic.alias_generators import to_camel
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.constants import MAX_PROMPT_LENGTH
from app.core.exceptions import ApiError, ErrorCode
from app.schemas.error import ErrorDetail, ErrorResponse

logger = logging.getLogger(__name__)

VALUE_ERROR_PREFIX = "Value error, "

FIELD_ERROR_CODES: dict[str, ErrorCode] = {
    "prompt": ErrorCode.INVALID_PROMPT,
    "targetLanguage": ErrorCode.INVALID_LANGUAGE,
    "contextId": ErrorCode.INVALID_CONTEXT_ID,
}

ERROR_MESSAGES: dict[ErrorCode, str] = {
    ErrorCode.INVALID_PROMPT: (
        f"Prompt is required and must be a non-empty string of at most {MAX_PROMPT_LENGTH} "
        "characters"
    ),
    ErrorCode.INVALID_LANGUAGE: "Target language is not supported",
    ErrorCode.INVALID_CONTEXT_ID: "contextId must be a valid UUID",
    ErrorCode.VALIDATION_ERROR: "Request validation failed",
}

HTTP_ERROR_CODES: dict[int, ErrorCode] = {
    HTTPStatus.NOT_FOUND: ErrorCode.NOT_FOUND,
    HTTPStatus.METHOD_NOT_ALLOWED: ErrorCode.METHOD_NOT_ALLOWED,
}


def _error_response(
    status_code: int,
    code: ErrorCode,
    message: str,
    details: list[ErrorDetail] | None = None,
) -> JSONResponse:
    body = ErrorResponse(error=code, message=message, details=details)
    content = body.model_dump(mode="json", exclude_none=True)
    return JSONResponse(status_code=status_code, content=content)


def _field_parts(location: tuple[int | str, ...]) -> list[str]:
    """Drops the source ("body", "query", "path") and list indexes from a pydantic location."""
    return [to_camel(part) for part in location[1:] if isinstance(part, str)]


def _to_detail(error: dict[str, Any]) -> ErrorDetail:
    location = tuple(error["loc"])
    field = ".".join(_field_parts(location)) or str(location[0])
    return ErrorDetail(field=field, message=error["msg"].removeprefix(VALUE_ERROR_PREFIX))


def _code_for(error: dict[str, Any]) -> ErrorCode:
    parts = _field_parts(tuple(error["loc"]))
    if not parts:
        return ErrorCode.VALIDATION_ERROR
    return FIELD_ERROR_CODES.get(parts[0], ErrorCode.VALIDATION_ERROR)


def handle_validation_error(_: Request, exc: RequestValidationError) -> JSONResponse:
    errors = exc.errors()
    code = _code_for(errors[0]) if errors else ErrorCode.VALIDATION_ERROR
    details = [_to_detail(error) for error in errors]
    return _error_response(HTTPStatus.UNPROCESSABLE_ENTITY, code, ERROR_MESSAGES[code], details)


def handle_api_error(_: Request, exc: ApiError) -> JSONResponse:
    return _error_response(exc.status_code, exc.code, exc.message)


def handle_http_exception(_: Request, exc: StarletteHTTPException) -> JSONResponse:
    code = HTTP_ERROR_CODES.get(exc.status_code, ErrorCode.HTTP_ERROR)
    return _error_response(exc.status_code, code, str(exc.detail))


def handle_unexpected_error(_: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled error", exc_info=exc)
    return _error_response(
        HTTPStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_ERROR, "An unexpected error occurred"
    )


def register_error_handlers(app: FastAPI) -> None:
    app.add_exception_handler(RequestValidationError, handle_validation_error)
    app.add_exception_handler(ApiError, handle_api_error)
    app.add_exception_handler(StarletteHTTPException, handle_http_exception)
    app.add_exception_handler(Exception, handle_unexpected_error)
