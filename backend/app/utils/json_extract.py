"""Extract and parse JSON from Gemini responses."""

from __future__ import annotations

import json
import re
from typing import Any


def strip_code_fences(raw: str) -> str:
    text = raw.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
        text = re.sub(r"\s*```\s*$", "", text)
    return text.strip()


def parse_json_object(raw: str) -> dict[str, Any]:
    text = strip_code_fences(raw)
    return json.loads(text)
