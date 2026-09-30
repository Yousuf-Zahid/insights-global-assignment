from app.schemas.base import CamelModel


class Pagination(CamelModel):
    page: int
    page_size: int
    total_items: int
    total_pages: int
    has_more: bool
