"""Safe exception messages for Gemini failures (no secrets)."""

from __future__ import annotations

import re

from pydantic import ValidationError


def sanitize_exception_message_for_gemini(raw: str, *, max_len: int = 200) -> str:
    """Strip risky patterns and truncate for API responses and logs."""
    text = raw.strip().replace("\n", " ").replace("\r", " ")
    text = re.sub(r"\s+", " ", text)
    # Common Google API key prefix — never echo in errors/logs
    text = re.sub(r"AIza[0-9A-Za-z_-]{20,}", "[REDACTED]", text)
    text = re.sub(
        r"(?i)bearer\s+[0-9A-Za-z._=-]{15,}",
        "bearer [REDACTED]",
        text,
    )
    if len(text) > max_len:
        text = text[: max_len - 1].rstrip() + "…"
    return text or "(no message)"


def format_gemini_fallback_reason(exc: BaseException, model: str) -> str:
    """Human-readable, safe fallbackReason for unexpected Gemini failures."""
    safe = sanitize_exception_message_for_gemini(str(exc))
    return f"Gemini {type(exc).__name__} using {model}: {safe}"


def format_pydantic_validation_fallback_reason(
    exc: ValidationError,
    *,
    max_total_chars: int = 300,
    max_errors: int = 3,
) -> str:
    """Compact, API-safe summary of the first validation errors (path + message)."""
    parts: list[str] = []
    for err in exc.errors()[:max_errors]:
        loc = err.get("loc") or ()
        path = ".".join(str(x) for x in loc if str(x) != "")
        msg_raw = str(err.get("msg") or "").strip()
        msg = sanitize_exception_message_for_gemini(msg_raw, max_len=100)
        parts.append(f"{path}: {msg}" if path else msg)

    detail = "; ".join(parts) if parts else ""
    prefix = "Gemini output failed schema validation"
    combined = f"{prefix}: {detail}" if detail else prefix
    combined = sanitize_exception_message_for_gemini(combined, max_len=max_total_chars)
    return combined
