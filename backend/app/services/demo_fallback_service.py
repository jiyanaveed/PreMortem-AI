"""Deterministic backend fallback when Gemini is unavailable or invalid."""

from app.models.premortem import (
    AnalyzeRequest,
    AuditEventModel,
    CriticalBlockerModel,
    EvidenceItemModel,
    FailurePointModel,
    FixPlanRowModel,
    ImpactAreaModel,
    PremortemAnalysisResponse,
)

SCENARIO_LABELS: dict[str, tuple[str, str]] = {
    "audit-tomorrow": (
        "Government Audit Readiness Stress Test",
        "Audit Tomorrow",
    ),
    "critical-vendor-fails": (
        "Critical Supplier Continuity Breakdown",
        "Critical Vendor Fails",
    ),
    "sensitive-data-exposure": (
        "Sensitive Data Handling Failure Mode",
        "Sensitive Data Exposure",
    ),
    "enterprise-client-escalates": (
        "Strategic Client Escalation Visibility Crisis",
        "Enterprise Client Escalates",
    ),
    "approval-workflow-breaks": (
        "Executive Approval Bottleneck Collapse",
        "Approval Workflow Breaks",
    ),
    "ai-governance-failure": (
        "Enterprise AI Governance & Logging Breakdown",
        "AI Governance Failure",
    ),
}


def _titles(req: AnalyzeRequest) -> tuple[str, str, str]:
    sim, scen_default = SCENARIO_LABELS.get(
        req.scenarioId,
        (
            "Enterprise PreMortem Simulation",
            "Stress scenario",
        ),
    )
    doc = req.documentTitle or "Untitled enterprise document"
    scen = req.scenarioTitle or scen_default
    return sim, doc, scen


def build_fallback_analysis(
    req: AnalyzeRequest,
    *,
    fallback_reason: str,
) -> PremortemAnalysisResponse:
    """Placeholder / fallback analysis aligned with frontend contract."""
    simulation_title, doc_title, scenario_title = _titles(req)
    sid = req.scenarioId

    wow = (
        f"PreMortem (fallback): under scenario [{scenario_title}], "
        "evidence ownership and escalation clarity remain the highest-risk gaps "
        "relative to the supplied excerpt."
    )
    exec_sum = (
        f"Deterministic fallback analysis for `{scenario_title}` against `{doc_title}`. "
        "Treat as illustrative until live Gemini analysis succeeds. "
        "Focus on naming accountable owners, tightening evidence indexes, and "
        "clocking escalation commitments."
    )

    fps = [
        FailurePointModel(
            id=f"fb-{sid}-1",
            severity="Critical",
            title="Accountable owner ambiguity",
            area="Governance",
            signal="Roles are named informally; backup authority is not documented.",
            impact="Decisions stall when primary owners are unavailable.",
        ),
        FailurePointModel(
            id=f"fb-{sid}-2",
            severity="High",
            title="Evidence trail fragmentation",
            area="Compliance",
            signal="Artifacts scatter across channels without a control map.",
            impact="Audit or client challenge cannot be answered quickly.",
        ),
        FailurePointModel(
            id=f"fb-{sid}-3",
            severity="High",
            title="Escalation SLA implicit",
            area="Operations",
            signal="Commitments rely on chat norms rather than timed playbooks.",
            impact="Customer/regulator clocks breach before structured response.",
        ),
        FailurePointModel(
            id=f"fb-{sid}-4",
            severity="Medium",
            title="Monitoring evidence gaps",
            area="Risk",
            signal="Controls exist in narrative form without exportable proof packs.",
            impact="Leadership cannot attest operational effectiveness.",
        ),
    ]

    cbs = [
        CriticalBlockerModel(
            id=f"fb-{sid}-cb1",
            title="No single-threaded response charter",
            detail="Incident or audit surge lacks named commander and deputy.",
        ),
        CriticalBlockerModel(
            id=f"fb-{sid}-cb2",
            title="Incomplete evidence index",
            detail="Cannot produce a defensible artifact matrix under pressure.",
        ),
        CriticalBlockerModel(
            id=f"fb-{sid}-cb3",
            title="Delegation limits unpublished",
            detail="Approvers lack pre-authorized envelopes for surge periods.",
        ),
    ]

    impact = [
        ImpactAreaModel(
            id=f"fb-{sid}-ia1",
            label="Compliance exposure",
            exposure="Elevated — readiness",
            metric="Evidence gaps: unresolved",
        ),
        ImpactAreaModel(
            id=f"fb-{sid}-ia2",
            label="Operational latency",
            exposure="High — throughput",
            metric="Estimated delay risk: 10–14 days",
        ),
        ImpactAreaModel(
            id=f"fb-{sid}-ia3",
            label="Stakeholder trust",
            exposure="Moderate — transparency",
            metric="Communication record fragmentation",
        ),
    ]

    fix_plan = [
        FixPlanRowModel(
            id=f"fb-{sid}-fx1",
            priority="P0",
            action="Publish RACI + backup approvers with limits",
            owner="COO Office",
            evidenceNeeded="Signed matrix, delegation policy",
            timeframe="48h",
            status="Proposed",
        ),
        FixPlanRowModel(
            id=f"fb-{sid}-fx2",
            priority="P0",
            action="Stand up control-to-evidence index",
            owner="Compliance Lead",
            evidenceNeeded="Control map, owners list",
            timeframe="5 days",
            status="Proposed",
        ),
        FixPlanRowModel(
            id=f"fb-{sid}-fx3",
            priority="P1",
            action="Codify escalation SLA with timers",
            owner="Program Office",
            evidenceNeeded="Playbook, templates",
            timeframe="7 days",
            status="Proposed",
        ),
        FixPlanRowModel(
            id=f"fb-{sid}-fx4",
            priority="P2",
            action="Export monitoring configuration evidence packs",
            owner="Risk / Security",
            evidenceNeeded="Screenshots, hashes, retention note",
            timeframe="10 days",
            status="Proposed",
        ),
    ]

    audit = [
        AuditEventModel(
            id="at-1",
            label="Document signal captured (fallback)",
            timestamp="T+00:00",
        ),
        AuditEventModel(
            id="at-2",
            label=f"Scenario: {scenario_title}",
            timestamp="T+00:01",
        ),
        AuditEventModel(
            id="at-3",
            label="Fallback analysis served (no Gemini / parse error)",
            timestamp="T+00:02",
        ),
    ]

    evidence = [
        EvidenceItemModel(
            id="ev-1",
            label="Signed delegation / approval matrix",
            required=True,
            checked=False,
        ),
        EvidenceItemModel(
            id="ev-2",
            label="Control-to-evidence workbook",
            required=True,
            checked=False,
        ),
        EvidenceItemModel(
            id="ev-3",
            label="Escalation playbook with SLA clocks",
            required=True,
            checked=False,
        ),
        EvidenceItemModel(
            id="ev-4",
            label="Executive rehearsal notes",
            required=False,
            checked=False,
        ),
    ]

    return PremortemAnalysisResponse(
        simulationTitle=simulation_title,
        documentTitle=doc_title,
        scenarioTitle=scenario_title,
        riskScore=78,
        riskLevel="High",
        failureCount=len(fps),
        criticalBlockerCount=len(cbs),
        delayDays=12,
        executiveSummary=exec_sum,
        wowSummary=wow,
        failurePoints=fps,
        criticalBlockers=cbs,
        impactAreas=impact,
        fixPlan=fix_plan,
        auditTrail=audit,
        evidenceChecklist=evidence,
        recommendation=(
            "Prioritize publishing accountable owners and an evidence index, "
            "then rehearse a timed escalation drill before the next audit or client surge."
        ),
        confidence=72,
        analysisSource="backend_fallback",
        fallbackReason=fallback_reason,
    )
