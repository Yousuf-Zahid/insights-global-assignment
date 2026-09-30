from pydantic import BaseModel

from app.core.exceptions import ErrorCode


class ErrorDetail(BaseModel):
    field: str
    message: str


class ErrorResponse(BaseModel):
    error: ErrorCode
    message: str
    details: list[ErrorDetail] | None = None
