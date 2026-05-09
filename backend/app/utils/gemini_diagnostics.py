"""Safe exception messages for Gemini failures (no secrets)."""

from __future__ import annotations

import re


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
