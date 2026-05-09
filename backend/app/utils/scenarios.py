"""Scenario id → default title for API requests."""

SCENARIO_TITLE_FALLBACK: dict[str, str] = {
    "audit-tomorrow": "Audit Tomorrow",
    "critical-vendor-fails": "Critical Vendor Fails",
    "sensitive-data-exposure": "Sensitive Data Exposure",
    "enterprise-client-escalates": "Enterprise Client Escalates",
    "approval-workflow-breaks": "Approval Workflow Breaks",
    "ai-governance-failure": "AI Governance Failure",
}


def scenario_title_for_id(scenario_id: str, explicit: str | None) -> str:
    if explicit and explicit.strip():
        return explicit.strip()
    return SCENARIO_TITLE_FALLBACK.get(scenario_id, scenario_id)
