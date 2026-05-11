from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    gemini_api_key: str | None = None
    gemini_model: str = "gemini-1.5-flash"
    allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    min_document_chars: int = 80
    node_env: str | None = None
    app_env: str | None = None

    def is_local_dev_logging(self) -> bool:
        """True when env indicates local development (verbose diagnostics only)."""
        for v in (self.node_env, self.app_env):
            if v and v.strip().lower() in ("development", "dev", "local", "debug"):
                return True
        return False


@lru_cache
def get_settings() -> Settings:
    return Settings()
