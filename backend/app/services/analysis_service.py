"""Orchestrates analyze flow (Gemini + fallback)."""

import json
import logging

from pydantic import ValidationError

from app.core.config import Settings
from app.models.premortem import AnalyzeRequest, PremortemAnalysisResponse
from app.services.demo_fallback_service import build_fallback_analysis
from app.services.quality_guardrail_service import GeminiQualityRejected
from app.utils.gemini_diagnostics import (
    format_gemini_fallback_reason,
    format_pydantic_validation_fallback_reason,
    sanitize_exception_message_for_gemini,
)

logger = logging.getLogger(__name__)


def analyze_placeholder(req: AnalyzeRequest) -> PremortemAnalysisResponse:
    """Deterministic response matching live contract (demo / fallback)."""
    return build_fallback_analysis(
        req,
        fallback_reason="Placeholder analysis (skeleton)",
    )


def analyze(req: AnalyzeRequest, settings: Settings) -> PremortemAnalysisResponse:
    """Try Gemini; on missing key or any failure, return deterministic fallback."""
    if not settings.gemini_api_key:
        logger.info("GEMINI_API_KEY unset; using fallback analysis")
        return build_fallback_analysis(
            req,
            fallback_reason="GEMINI_API_KEY not configured",
        )
    try:
        from app.services.gemini_service import analyze_with_gemini

        return analyze_with_gemini(req, settings)
    except ValidationError as e:
        fallback_reason = format_pydantic_validation_fallback_reason(e)
        if settings.is_local_dev_logging():
            for err in e.errors():
                safe_msg = sanitize_exception_message_for_gemini(
                    str(err.get("msg") or ""),
                    max_len=500,
                )
                logger.info(
                    "Gemini schema validation (dev): loc=%r msg=%s type=%r",
                    err.get("loc"),
                    safe_msg,
                    err.get("type"),
                )
        logger.warning(
            "Gemini output failed schema validation; using fallback (%s)",
            sanitize_exception_message_for_gemini(fallback_reason, max_len=240),
        )
        return build_fallback_analysis(req, fallback_reason=fallback_reason)
    except json.JSONDecodeError:
        logger.warning("Gemini returned invalid JSON; using fallback")
        return build_fallback_analysis(
            req,
            fallback_reason="Gemini returned invalid JSON",
        )
    except ValueError as e:
        logger.warning("Gemini response unusable: %s", e)
        return build_fallback_analysis(
            req,
            fallback_reason="Gemini returned empty or unreadable output",
        )
    except GeminiQualityRejected as e:
        logger.warning("Gemini output rejected by quality guardrails: %s", e.reason)
        if e.after_retry:
            fb = f"Gemini output rejected after retry: {e.reason}"
        else:
            fb = f"Gemini output rejected: {e.reason}"
        return build_fallback_analysis(req, fallback_reason=fb)
    except Exception as e:
        reason = format_gemini_fallback_reason(e, settings.gemini_model)
        logger.warning(
            "Gemini analysis failed; using fallback (%s)",
            type(e).__name__,
        )
        return build_fallback_analysis(req, fallback_reason=reason)
