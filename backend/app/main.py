import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import analyze, health
from app.core.config import get_settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

_api_key = (settings.gemini_api_key or "").strip()
logger.info(
    "Gemini env: api_key_configured=%s model=%s api_key_length=%s",
    bool(_api_key),
    settings.gemini_model,
    len(_api_key),
)

app = FastAPI(
    title="Meowvate PreMortem AI API",
    version="0.1.0",
    description="FastAPI backend for enterprise pre-mortem simulation.",
)

origins = [o.strip() for o in settings.allowed_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(analyze.router, prefix="/api")

logger.info("CORS origins: %s", origins)
