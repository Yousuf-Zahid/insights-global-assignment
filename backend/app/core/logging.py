import logging
import time

from fastapi import Request, Response
from starlette.middleware.base import RequestResponseEndpoint

LOG_FORMAT = "%(asctime)s %(levelname)-8s %(name)s | %(message)s"

request_logger = logging.getLogger("app.request")


def configure_logging(level: str) -> None:
    logging.basicConfig(level=level, format=LOG_FORMAT)


async def log_requests(request: Request, call_next: RequestResponseEndpoint) -> Response:
    started_at = time.perf_counter()
    response = await call_next(request)
    elapsed_ms = (time.perf_counter() - started_at) * 1000
    request_logger.info(
        "%s %s -> %d (%.1f ms)",
        request.method,
        request.url.path,
        response.status_code,
        elapsed_ms,
    )
    return response
