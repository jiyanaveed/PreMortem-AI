"""Gemini structured JSON analysis."""

from __future__ import annotations

import json
import logging

import google.generativeai as genai

from app.core.config import Settings
from app.models.premortem import AnalyzeRequest, PremortemAnalysisResponse
from app.prompts.premortem_prompt import (
    build_quality_retry_repair_instruction,
    build_system_prompt,
    build_user_prompt,
)
from app.services.quality_guardrail_service import GeminiQualityRejected, validate_gemini_output_quality
from app.utils.json_extract import parse_json_object
from app.utils.text import trim_for_llm

logger = logging.getLogger(__name__)


def _normalize_payload(data: dict) -> dict:
    fps = data.get("failurePoints") or []
    cbs = data.get("criticalBlockers") or []
    data["failureCount"] = len(fps)
    data["criticalBlockerCount"] = len(cbs)
    return data


def _generation_temperature(req: AnalyzeRequest, *, quality_retry: bool) -> float:
    if quality_retry:
        return 0.18 if req.analysisDepth == "strict" else 0.2
    return 0.28 if req.analysisDepth == "strict" else 0.35


def _call_gemini_raw(
    model: genai.GenerativeModel,
    system: str,
    user: str,
    temperature: float,
) -> str:
    response = model.generate_content(
        [system, user],
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            temperature=temperature,
        ),
    )
    raw = response.text
    if not raw:
        raise ValueError("Empty Gemini response")
    return raw


def _payload_to_validated_response(
    payload: dict,
    req: AnalyzeRequest,
    trimmed: str,
    settings: Settings,
) -> PremortemAnalysisResponse:
    payload = _normalize_payload(payload)
    payload.setdefault(
        "documentTitle",
        req.documentTitle or "Untitled enterprise document",
    )
    payload.setdefault("scenarioTitle", req.scenarioTitle or req.scenarioId)
    payload["analysisSource"] = "gemini"
    payload["fallbackReason"] = None
    validated = PremortemAnalysisResponse.model_validate(payload)
    validate_gemini_output_quality(
        validated,
        document_text_for_grounding=trimmed,
        enable_dev_quality_logs=settings.is_local_dev_logging(),
    )
    return validated


def _run_one_gemini_attempt(
    model: genai.GenerativeModel,
    system: str,
    user: str,
    req: AnalyzeRequest,
    trimmed: str,
    settings: Settings,
    *,
    temperature: float,
) -> PremortemAnalysisResponse:
    raw = _call_gemini_raw(model, system, user, temperature)
    try:
        payload = parse_json_object(raw)
    except (json.JSONDecodeError, ValueError) as e:
        logger.warning("Gemini JSON parse failed: %s", e)
        raise
    return _payload_to_validated_response(payload, req, trimmed, settings)


def analyze_with_gemini(req: AnalyzeRequest, settings: Settings) -> PremortemAnalysisResponse:
    trimmed = trim_for_llm(req.documentText)
    system = build_system_prompt(req)
    user = build_user_prompt(req, trimmed)

    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel(settings.gemini_model)

    first_temp = _generation_temperature(req, quality_retry=False)
    try:
        return _run_one_gemini_attempt(
            model,
            system,
            user,
            req,
            trimmed,
            settings,
            temperature=first_temp,
        )
    except GeminiQualityRejected:
        pass

    repair = "\n\n" + build_quality_retry_repair_instruction()
    retry_temp = _generation_temperature(req, quality_retry=True)
    try:
        result = _run_one_gemini_attempt(
            model,
            system,
            user + repair,
            req,
            trimmed,
            settings,
            temperature=retry_temp,
        )
    except GeminiQualityRejected as e:
        raise GeminiQualityRejected(e.reason, after_retry=True) from e

    if settings.is_local_dev_logging():
        logger.info("Gemini quality retry succeeded")
    return result
