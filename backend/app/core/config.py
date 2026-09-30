import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Self

BACKEND_DIR = Path(__file__).resolve().parents[2]
DEFAULT_DATABASE_PATH = BACKEND_DIR / "insights.db"
DEFAULT_SEED_FILE = BACKEND_DIR / "app" / "data" / "seed_insights.json"
DOTENV_FILE = BACKEND_DIR / ".env"


def _read_dotenv(path: Path) -> dict[str, str]:
    if not path.is_file():
        return {}
    values: dict[str, str] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, _, value = stripped.partition("=")
        values[key.strip()] = value.strip().strip("\"'")
    return values


@dataclass(frozen=True)
class Settings:
    """Application settings. Every field has a working default, so no .env is required."""

    app_name: str = "AI Insights API"
    api_prefix: str = "/api/v1"
    database_url: str = f"sqlite:///{DEFAULT_DATABASE_PATH.as_posix()}"
    cors_origins: tuple[str, ...] = ("http://localhost:5173",)
    log_level: str = "INFO"
    seed_file: Path = DEFAULT_SEED_FILE

    @classmethod
    def from_env(cls) -> Self:
        defaults = cls()
        env = {**_read_dotenv(DOTENV_FILE), **os.environ}
        origins = env.get("CORS_ORIGINS")
        return cls(
            database_url=env.get("DATABASE_URL", defaults.database_url),
            cors_origins=(
                tuple(origin.strip() for origin in origins.split(",") if origin.strip())
                if origins
                else defaults.cors_origins
            ),
            log_level=env.get("LOG_LEVEL", defaults.log_level).upper(),
        )


@lru_cache
def get_settings() -> Settings:
    return Settings.from_env()
