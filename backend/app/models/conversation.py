import uuid
from datetime import datetime

from sqlalchemy import JSON, DateTime, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, utcnow


class Conversation(Base):
    __tablename__ = "conversations"

    context_id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True)
    prompt: Mapped[str] = mapped_column(Text)
    target_language: Mapped[str] = mapped_column(String(2))
    result_ids: Mapped[list[int]] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
