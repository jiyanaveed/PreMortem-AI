"""Reject Gemini outputs that pass schema but are too weak for production demos."""

from __future__ import annotations

import re

from app.models.premortem import FailurePointModel, FixPlanRowModel, PremortemAnalysisResponse


class GeminiQualityRejected(Exception):
    """Gemini JSON validated but failed operational quality bar."""

    def __init__(self, reason: str) -> None:
        super().__init__(reason)
        self.reason = reason


_VAGUE_MARKERS = frozenset(
    {
        "not specified",
        "n/a",
        "na",
        "no evidence",
        "none.",
        "none",
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


def _validate_failure_point(fp: FailurePointModel) -> None:
    if not fp.title.strip():
        raise GeminiQualityRejected("failure point missing title")
    if not fp.area.strip():
        raise GeminiQualityRejected("failure point missing area")
    if _field_vague(fp.signal, fp.title):
        raise GeminiQualityRejected(
            f'failure point "{fp.title[:48]}..." has vague or empty signal (document grounding)',
        )
    if _field_vague(fp.impact, fp.title):
        raise GeminiQualityRejected(
            f'failure point "{fp.title[:48]}..." has vague impact (business consequence)',
        )


def validate_gemini_output_quality(resp: PremortemAnalysisResponse) -> None:
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
        _validate_failure_point(fp)

    weak_fixes = [r for r in resp.fixPlan if _fix_action_too_weak(r)]
    if weak_fixes:
        raise GeminiQualityRejected(
            "fix plan contains generic or non-action-oriented rows "
            f'(example: "{weak_fixes[0].action[:60]}")',
        )
