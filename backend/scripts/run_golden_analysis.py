#!/usr/bin/env python3
"""Golden fixture runner: loads a sample document and calls analyze() (no frontend)."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.core.config import get_settings  # noqa: E402
from app.models.premortem import AnalyzeRequest  # noqa: E402
from app.services.analysis_service import analyze  # noqa: E402

# scenario_id, document_title, scenario_title, scenario_description
PRESETS: dict[str, tuple[str, str, str, str]] = {
    "government_audit_readiness_sample.md": (
        "audit-tomorrow",
        "Government audit readiness golden fixture",
        "Audit Tomorrow",
        "Government or enterprise audit lands in less than 24 hours; evidence must map cleanly to controls.",
    ),
    "supplier_failure_sample.md": (
        "critical-vendor-fails",
        "Tier-1 supplier continuity golden fixture",
        "Critical Vendor Fails",
        "A tier-1 supplier misses compliance or delivery; cascade risk hits commitments and revenue.",
    ),
    "ai_governance_deployment_sample.md": (
        "ai-governance-failure",
        "Responsible AI deployment golden fixture",
        "AI Governance Failure",
        "Enterprise AI logging, approvals, and incident readiness break under real deployment pressure.",
    ),
}


def main() -> None:
    parser = argparse.ArgumentParser(description="Run analyze() on a golden input file.")
    parser.add_argument(
        "input_path",
        type=Path,
        help="Path to golden markdown (e.g. test_inputs/government_audit_readiness_sample.md)",
    )
    parser.add_argument(
        "--depth",
        choices=("standard", "strict"),
        default="standard",
        help="analysisDepth forwarded to AnalyzeRequest",
    )
    parser.add_argument(
        "--scenario-id",
        default=None,
        help="Override scenarioId when using a non-standard filename",
    )
    args = parser.parse_args()

    path = args.input_path if args.input_path.is_absolute() else BACKEND_ROOT / args.input_path
    if not path.is_file():
        print(f"File not found: {path}", file=sys.stderr)
        sys.exit(1)

    preset = PRESETS.get(path.name)
    scenario_id = args.scenario_id or (preset[0] if preset else None)
    if not scenario_id:
        print("Provide --scenario-id for unknown filenames.", file=sys.stderr)
        sys.exit(1)

    doc_title = preset[1] if preset else path.stem.replace("_", " ").title()
    scen_title = preset[2] if preset else scenario_id
    scen_desc = preset[3] if preset else ""

    text = path.read_text(encoding="utf-8")
    req = AnalyzeRequest(
        documentText=text,
        documentTitle=doc_title,
        scenarioId=scenario_id,
        scenarioTitle=scen_title,
        scenarioDescription=scen_desc,
        sourceType="golden-fixture",
        isPasteCapture=False,
        analysisDepth=args.depth,
    )

    result = analyze(req, get_settings())

    print("analysisSource:", result.analysisSource)
    print("fallbackReason:", result.fallbackReason)
    print("riskScore:", result.riskScore, "confidence:", result.confidence)
    ws = result.wowSummary.replace("\n", " ")
    print("wowSummary:", ws[:360] + ("..." if len(ws) > 360 else ""))
    print("\nTop failure points:")
    for fp in result.failurePoints[:5]:
        sig = fp.signal.replace("\n", " ")
        print(f"  - [{fp.severity}] {fp.title}")
        print(f"      signal: {sig[:140]}{'...' if len(sig) > 140 else ''}")
    print("\nCounts:", json.dumps({"failureCount": result.failureCount, "fixPlan": len(result.fixPlan)}))


if __name__ == "__main__":
    main()
