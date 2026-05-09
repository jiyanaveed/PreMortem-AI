"""Gemini structured JSON analysis."""

from __future__ import annotations

import json
import logging

import google.generativeai as genai

from app.core.config import Settings
from app.models.premortem import AnalyzeRequest, PremortemAnalysisResponse
from app.prompts.premortem_prompt import build_system_prompt, build_user_prompt
from app.services.quality_guardrail_service import validate_gemini_output_quality
from app.utils.json_extract import parse_json_object
from app.utils.text import trim_for_llm

logger = logging.getLogger(__name__)


def _normalize_payload(data: dict) -> dict:
    fps = data.get("failurePoints") or []
    cbs = data.get("criticalBlockers") or []
    data["failureCount"] = len(fps)
    data["criticalBlockerCount"] = len(cbs)
    return data


def analyze_with_gemini(req: AnalyzeRequest, settings: Settings) -> PremortemAnalysisResponse:
    trimmed = trim_for_llm(req.documentText)
    system = build_system_prompt(req)
    user = build_user_prompt(req, trimmed)

    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel(settings.gemini_model)

    response = model.generate_content(
        [system, user],
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            temperature=0.28 if req.analysisDepth == "strict" else 0.35,
        ),
    )

    raw = response.text
    if not raw:
        raise ValueError("Empty Gemini response")

    try:
        payload = parse_json_object(raw)
    except (json.JSONDecodeError, ValueError) as e:
        logger.warning("Gemini JSON parse failed: %s", e)
        raise

    payload = _normalize_payload(payload)
    payload.setdefault(
        "documentTitle",
        req.documentTitle or "Untitled enterprise document",
    )
    payload.setdefault("scenarioTitle", req.scenarioTitle or req.scenarioId)
    payload["analysisSource"] = "gemini"
    payload["fallbackReason"] = None

    try:
        validated = PremortemAnalysisResponse.model_validate(payload)
    except Exception as e:
        logger.warning("Pydantic validation failed after Gemini: %s", e)
        raise

    validate_gemini_output_quality(validated)
    return validated
