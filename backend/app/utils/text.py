"""Document text trimming for LLM input (begin/middle/end windows)."""

import re

MAX_CHARS_DEFAULT = 24_000
HEAD_TAIL_EACH = 10_000


def normalize_whitespace(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def trim_for_llm(text: str, max_chars: int = MAX_CHARS_DEFAULT) -> str:
    """Preserve beginning and end signal for very long inputs."""
    text = normalize_whitespace(text)
    if len(text) <= max_chars:
        return text
    head = text[:HEAD_TAIL_EACH]
    tail = text[-HEAD_TAIL_EACH:]
    omitted = len(text) - len(head) - len(tail)
    middle = f"\n\n… [{omitted} characters omitted for length] …\n\n"
    out = head + middle + tail
    if len(out) > max_chars:
        return out[:max_chars] + "\n… [truncated]"
    return out


def meaningful_char_count(text: str) -> int:
    """Count non-whitespace characters after normalization."""
    return len(re.sub(r"\s+", "", normalize_whitespace(text)))
