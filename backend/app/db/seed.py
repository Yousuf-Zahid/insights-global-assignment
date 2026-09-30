import json
import logging
from pathlib import Path
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session, sessionmaker

from app.models import Insight

logger = logging.getLogger(__name__)


def seed_insights(session_factory: sessionmaker[Session], seed_file: Path) -> int:
    """Load the dummy insights into an empty table. Returns the number of rows inserted."""
    with session_factory() as session:
        if session.scalar(select(func.count()).select_from(Insight)):
            return 0
        records: list[dict[str, Any]] = json.loads(seed_file.read_text(encoding="utf-8"))
        session.add_all(Insight(**record) for record in records)
        session.commit()
    logger.info("Seeded %d insights from %s", len(records), seed_file.name)
    return len(records)
