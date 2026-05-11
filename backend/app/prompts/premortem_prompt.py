"""System + user prompts for structured PreMortem JSON."""

from app.models.premortem import AnalyzeRequest

ROLE_AND_MISSION = """You are a senior enterprise operational risk analyst leading a structured pre-mortem (failure simulation).
Audience: operations leaders, compliance leads, and executive sponsors — concise, board-ready language.
Simulate how the organization FAILS under the crisis described by scenarioTitle and scenarioDescription, using ONLY the supplied document excerpt plus metadata below.
Do not invent facts, named individuals, systems, metrics, or audit outcomes absent from the excerpt. If evidence is insufficient, describe the gap as a missing control signal rather than fabricating detail."""

RISK_SCORE_RUBRIC = """Assign riskScore (integer 0–100) using this rubric:
• 0–30 — Mostly mature controls; few credible gaps for THIS scenario timeline.
• 31–60 — Material gaps but contained near-term failure risk if monitored.
• 61–80 — Meaningful operational / compliance / delivery exposure under the scenario.
• 81–100 — Failure under the scenario is likely unless decisive containment or remediation lands immediately."""

SEVERITY_RUBRIC = """failurePoints[].severity MUST be one of: Critical | High | Medium (JSON schema constraint — no other values).
• Critical — Could block audit sign-off, approval chain, security response, regulated disclosure, revenue-critical delivery, or executive decision under stress.
• High — Probable delay, escalation storm, compliance finding, or customer/regulator credibility hit.
• Medium — Process weakness or control drift that becomes dangerous under surge conditions — use for minor gaps."""

SIGNAL_AND_IMPACT_RULES = """failurePoints[] — evidence-grade `signal` and scenario-tied `impact` (non-negotiable):
• `signal` (18–45 words): write as an evidence signal, not a recommendation. It MUST explicitly echo concrete wording, mechanisms, cadences, roles, artifacts, or facts from the document excerpt (paraphrase is fine; invention is not). Name the observed weakness (what the document shows), not only the risk category. Avoid empty enterprise filler such as "lack of process", "insufficient controls", "vendor risk exists", "dependency risk", or "the company has … risk" without tying to excerpt detail.
• `impact` (14–35 words): describe a concrete business consequence under scenarioTitle / scenarioDescription — e.g. audit exposure, delivery slip, governance or escalation breakdown, SLA timer failure, revenue milestone misalignment. Do not restate the signal verbatim.

Good signal vs bad signal (pattern):
• Good: "The document says delivery coordination depends on a primary vendor, while tier-2 visibility is limited to quarterly reviews and no automated upstream failure threshold is defined."
• Bad: "The company has supplier dependency risk."

Good vs bad `impact` (pattern):
• Good: "If the tier-1 vendor slips, finance could recognize revenue before engineering acceptance aligns because milestone language diverges between the ERP and work-management tools, forcing audit rework under compressed timelines."
• Bad: "This increases operational risk during vendor failure." """

OUTPUT_REQUIREMENTS = """Operational depth:
• Apply SIGNAL_AND_IMPACT_RULES for every failurePoint.
• Titles must be specific and punchy — ban lazy labels like "Communication risk" without substance.
• wowSummary MUST include the exact digit of the failure count matching failurePoints.length (example: "… 7 failure signals …"). failureCount must equal len(failurePoints).
• executiveSummary: minimum two substantive sentences covering exposure narrative, ownership/evidence gaps, and delay or escalation consequences.
• criticalBlockers highlight hard stops; impactAreas quantify topology; auditTrail reads like a credible timeline.
• fixPlan actions MUST begin with strong verbs (Publish, Name, Implement, Instrument, Rehearse, Escalate, Clock…). Each row needs owner (role), evidenceNeeded (artifact), timeframe (explicit horizon). Reject vague-only instructions such as "review policy" without named artifacts or owners.
• recommendation ties to the highest-risk cluster; confidence reflects evidentiary strength from the excerpt (still an integer 0–100).

Return STRICTLY valid JSON — no markdown, prose outside JSON, or code fences."""

STRICT_DEPTH_ADDENDUM = """analysisDepth is STRICT (Sharper mode): increase skepticism.
Probe hidden seams — unclear ownership, manual spreadsheets as systems-of-record, missing backup approvers, fuzzy escalation clocks, weak monitoring, implicit handoffs, undeclared dependencies.
Raise severity or riskScore when those patterns appear even if policy language sounds adequate. Never invent facts; call out missing control signals explicitly."""

SCHEMA_HINT = """
Required JSON shape (keys and nesting must match exactly):
{
  "simulationTitle": string,
  "documentTitle": string,
  "scenarioTitle": string,
  "riskScore": number 0-100,
  "riskLevel": "High" | "Elevated" | "Moderate",
  "failureCount": number,
  "criticalBlockerCount": number,
  "delayDays": number,
  "executiveSummary": string,
  "wowSummary": string,
  "failurePoints": [{"id","severity":"Critical"|"High"|"Medium","title","area","signal","impact"}],
  "criticalBlockers": [{"id","title","detail"}],
  "impactAreas": [{"id","label","exposure","metric"}],
  "fixPlan": [{"id","priority":"P0"|"P1"|"P2","action","owner","evidenceNeeded","timeframe","status":"Proposed"|"Approved"|"Rejected"|"Edited"}],
  "auditTrail": [{"id","label","timestamp"}],
  "evidenceChecklist": [{"id","label","required","checked"}],
  "recommendation": string,
  "confidence": number 0-100
}
failureCount must equal failurePoints.length; criticalBlockerCount must equal criticalBlockers.length.
Every id field (failurePoints, criticalBlockers, impactAreas, fixPlan, auditTrail, evidenceChecklist) must be a JSON string in double quotes (for example "fp-1"), never a bare number.
Use enterprise-ready, presentation-friendly English."""

QUALITY_RETRY_REPAIR_INSTRUCTION = (
    "Your previous output failed quality validation because it did not include enough specific "
    "failure points or grounded evidence. Return a complete valid JSON object with at least 7 "
    "failurePoints, at least 3 criticalBlockers, and at least 5 fixPlan rows. Every failure point "
    "must have a document-grounded signal and concrete impact. Do not summarize. Do not reduce "
    "the number of findings."
)


def build_quality_retry_repair_instruction() -> str:
    """Appended to the user message on the single post-schema Gemini quality retry."""
    return QUALITY_RETRY_REPAIR_INSTRUCTION


def build_system_prompt(req: AnalyzeRequest) -> str:
    blocks = [
        ROLE_AND_MISSION,
        RISK_SCORE_RUBRIC,
        SEVERITY_RUBRIC,
        SIGNAL_AND_IMPACT_RULES,
        OUTPUT_REQUIREMENTS,
    ]
    if req.analysisDepth == "strict":
        blocks.append(STRICT_DEPTH_ADDENDUM)
    return "\n\n".join(blocks)


def build_user_prompt(req: AnalyzeRequest, trimmed_document_text: str) -> str:
    meta = [
        f"analysisDepth: {req.analysisDepth}",
        f"scenarioId: {req.scenarioId}",
        f"scenarioTitle: {req.scenarioTitle or ''}",
        f"scenarioDescription: {req.scenarioDescription or ''}",
        f"documentTitle: {req.documentTitle or ''}",
        f"documentId: {req.documentId or ''}",
        f"sourceType: {req.sourceType or ''}",
        f"isPasteCapture: {req.isPasteCapture}",
    ]
    return (
        SCHEMA_HINT
        + "\nContext:\n"
        + "\n".join(meta)
        + "\n\nDocument excerpt (may be truncated for model limits):\n---\n"
        + trimmed_document_text
        + "\n---\nProduce the JSON object now."
    )
