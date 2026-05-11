"""Reject Gemini outputs that pass schema but are too weak for production demos."""

from __future__ import annotations

import logging
import re

from app.models.premortem import FailurePointModel, FixPlanRowModel, PremortemAnalysisResponse
from app.utils.gemini_diagnostics import sanitize_exception_message_for_gemini

logger = logging.getLogger(__name__)


class GeminiQualityRejected(Exception):
    """Gemini JSON validated but failed operational quality bar."""

    def __init__(self, reason: str, *, after_retry: bool = False) -> None:
        super().__init__(reason)
        self.reason = reason
        self.after_retry = after_retry


_VAGUE_MARKERS = frozenset(
    {
        "not specified",
        "n/a",
        "no evidence",
        "none.",
        "generic risk",
        "unclear",
        "tbd",
        "to be determined",
        "unknown",
    }
)

_WEAK_ACTION_ONLY = frozenset(
    {
        "review policy",
        "review policies",
        "review documentation",
        "monitor regularly",
        "ensure compliance",
        "improve communication",
        "update documentation",
    },
)

# Multi-word anchors: if phrase appears in both signal and document, treat as grounded rescue.
_GROUNDING_ANCHOR_PHRASES = frozenset(
    {
        "primary vendor",
        "secondary vendor",
        "backup supplier",
        "quarterly reviews",
        "automated reconciliation",
        "automated threshold",
        "automated escalation",
        "escalation ownership",
        "shared folders",
        "executive approval",
        "delegated approver",
        "sla timer",
        "vendor portal",
        "incident records",
        "uptime dashboards",
        "tabletop exercises",
        "soc reports",
        "revenue milestones",
        "manual reconciliation",
        "change advisory",
        "tamper-evident",
        "customer commitments",
        "service levels",
        "vp approval",
        "audit trail",
        "root cause",
        "segregation of duties",
        "work-management",
        "work management",
        "vendor acknowledges",
        "procurement annexes",
    }
)

_GENERIC_SIGNAL_PHRASES = frozenset(
    {
        "lack of process",
        "insufficient controls",
        "vendor risk exists",
        "supplier dependency risk",
        "dependency risk exists",
        "generic risk",
    }
)

_STOPWORDS = frozenset(
    {
        "the",
        "and",
        "for",
        "are",
        "but",
        "not",
        "you",
        "all",
        "can",
        "has",
        "was",
        "were",
        "been",
        "this",
        "that",
        "with",
        "from",
        "have",
        "will",
        "may",
        "any",
        "its",
        "their",
        "than",
        "then",
        "such",
        "into",
        "only",
        "also",
        "more",
        "when",
        "what",
        "which",
        "while",
        "where",
        "about",
        "would",
        "could",
        "should",
        "under",
        "based",
        "across",
        "within",
        "without",
        "there",
        "these",
        "those",
        "they",
        "them",
        "than",
        "then",
        "some",
        "each",
        "most",
        "very",
        "just",
        "into",
        "over",
        "such",
        "being",
        "both",
        "once",
    }
)


def _norm(s: str) -> str:
    return " ".join(s.lower().split())


def _meaningful_sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    out: list[str] = []
    for p in parts:
        p = p.strip()
        if len(p.split()) >= 6:
            out.append(p)
    return out


def _allows_thin_evidence(title: str) -> bool:
    t = title.lower()
    return any(
        x in t
        for x in (
            "missing",
            "absent",
            "undocumented",
            "no documented",
            "gap in",
            "thin evidence",
            "missing control",
        )
    )


def _field_vague(value: str, title: str) -> bool:
    v = _norm(value)
    if len(v) < 12:
        return True
    if any(m in v for m in _VAGUE_MARKERS):
        return not _allows_thin_evidence(title)
    return False


def _document_norm(document_text: str) -> str:
    return " ".join(document_text.lower().split())


def _anchor_phrase_grounding_rescue(signal: str, document_text: str) -> bool:
    if not document_text.strip():
        return False
    sig = _norm(signal)
    doc = _document_norm(document_text)
    return any(p in sig and p in doc for p in _GROUNDING_ANCHOR_PHRASES)


def _content_bigram_grounding_rescue(signal: str, document_text: str) -> bool:
    """True when two consecutive substantive tokens from signal appear as a phrase in the document."""
    if not document_text.strip():
        return False
    doc = _document_norm(document_text)
    words = re.findall(r"[a-z0-9]+", signal.lower())
    substantive: list[str] = []
    for w in words:
        if len(w) < 5 or w in _STOPWORDS:
            continue
        substantive.append(w)
    for i in range(len(substantive) - 1):
        pair = f"{substantive[i]} {substantive[i + 1]}"
        if len(pair) >= 11 and pair in doc:
            return True
    return False


def _text_grounding_rescue(text: str, document_text: str) -> bool:
    """True when concrete excerpt language appears in both the field and the document."""
    return _anchor_phrase_grounding_rescue(text, document_text) or _content_bigram_grounding_rescue(
        text,
        document_text,
    )


def _signal_banned_generic(norm_signal: str) -> bool:
    return any(b in norm_signal for b in _GENERIC_SIGNAL_PHRASES)


def _fix_action_too_weak(row: FixPlanRowModel) -> bool:
    a = row.action.strip()
    if len(a) < 28:
        return True
    low = a.lower()
    if low in _WEAK_ACTION_ONLY:
        return True
    if low.startswith("review ") and len(a) < 48:
        return True
    return False


def _log_signal_rejection_dev(fp: FailurePointModel) -> None:
    safe_signal = sanitize_exception_message_for_gemini(fp.signal, max_len=160)
    logger.info(
        "Quality guardrail rejected failure point signal (dev): id=%r title=%r signal=%s",
        fp.id,
        fp.title[:120],
        safe_signal,
    )


def _validate_failure_point(
    fp: FailurePointModel,
    *,
    document_text: str,
    enable_dev_quality_logs: bool,
) -> None:
    if not fp.title.strip():
        raise GeminiQualityRejected("failure point missing title")
    if not fp.area.strip():
        raise GeminiQualityRejected("failure point missing area")

    sig_norm = _norm(fp.signal)
    if _signal_banned_generic(sig_norm) and not _text_grounding_rescue(fp.signal, document_text):
        if enable_dev_quality_logs:
            _log_signal_rejection_dev(fp)
        raise GeminiQualityRejected(
            f'failure point "{fp.title[:48]}..." has generic filler in signal (document grounding)',
        )

    if _field_vague(fp.signal, fp.title) and not _text_grounding_rescue(fp.signal, document_text):
        if enable_dev_quality_logs:
            _log_signal_rejection_dev(fp)
        raise GeminiQualityRejected(
            f'failure point "{fp.title[:48]}..." has vague or empty signal (document grounding)',
        )

    if _field_vague(fp.impact, fp.title) and not _text_grounding_rescue(fp.impact, document_text):
        raise GeminiQualityRejected(
            f'failure point "{fp.title[:48]}..." has vague impact (business consequence)',
        )


def validate_gemini_output_quality(
    resp: PremortemAnalysisResponse,
    *,
    document_text_for_grounding: str = "",
    enable_dev_quality_logs: bool = False,
) -> None:
    """Raise GeminiQualityRejected if output is structurally valid but operationally weak."""
    fps = resp.failurePoints
    if len(fps) < 5:
        raise GeminiQualityRejected("insufficient failure points (need at least 5)")

    if len(resp.fixPlan) < 3:
        raise GeminiQualityRejected("insufficient fix plan rows (need at least 3)")

    exec_sentences = _meaningful_sentences(resp.executiveSummary)
    if len(exec_sentences) < 2:
        raise GeminiQualityRejected(
            "executive summary needs at least two substantive sentences",
        )

    fc_str = str(resp.failureCount)
    if fc_str not in resp.wowSummary:
        raise GeminiQualityRejected(
            "wowSummary must explicitly reference the failure count "
            f"({resp.failureCount}) aligned with failurePoints",
        )

    for fp in fps:
        _validate_failure_point(
            fp,
            document_text=document_text_for_grounding,
            enable_dev_quality_logs=enable_dev_quality_logs,
        )

    weak_fixes = [r for r in resp.fixPlan if _fix_action_too_weak(r)]
    if weak_fixes:
        raise GeminiQualityRejected(
            "fix plan contains generic or non-action-oriented rows "
            f'(example: "{weak_fixes[0].action[:60]}")',
        )
