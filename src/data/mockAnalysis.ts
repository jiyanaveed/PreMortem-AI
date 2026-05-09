import type { AuditEvent, PremortemAnalysis } from "../types/analysis";
import { getSampleDocById } from "./sampleDocs";
import { getScenarioById } from "./scenarios";

export type ScenarioKey =
  | "audit-tomorrow"
  | "critical-vendor-fails"
  | "sensitive-data-exposure"
  | "enterprise-client-escalates"
  | "approval-workflow-breaks"
  | "ai-governance-failure";

const DEFAULT_SCENARIO: ScenarioKey = "audit-tomorrow";
const DEFAULT_DOC_ID = "ibm-government-guidelines";

const SCENARIO_KEYS = new Set<string>([
  "audit-tomorrow",
  "critical-vendor-fails",
  "sensitive-data-exposure",
  "enterprise-client-escalates",
  "approval-workflow-breaks",
  "ai-governance-failure",
]);

function normalizeScenarioId(id: string | null): ScenarioKey {
  if (id && SCENARIO_KEYS.has(id)) return id as ScenarioKey;
  return DEFAULT_SCENARIO;
}

type AnalysisCore = Omit<
  PremortemAnalysis,
  "documentTitle" | "scenarioTitle" | "auditTrail"
>;

function auditFor(scenarioTitle: string, blockers: number): AuditEvent[] {
  return [
    {
      id: "at-1",
      label: "Document signal captured (simulated public-document excerpt)",
      timestamp: "T+00:00",
    },
    {
      id: "at-2",
      label: `Scenario selected: ${scenarioTitle}`,
      timestamp: "T+00:02",
    },
    {
      id: "at-3",
      label: "Failure simulation completed (mock enterprise pre-mortem output)",
      timestamp: "T+00:05",
    },
    {
      id: "at-4",
      label: `${blockers} critical blockers detected`,
      timestamp: "T+00:05",
    },
    {
      id: "at-5",
      label: "Resolution path generated",
      timestamp: "T+00:06",
    },
    {
      id: "at-6",
      label: "Action approved by user (local demo)",
      timestamp: "T+00:08",
    },
  ];
}

const ANALYSIS_CORE: Record<ScenarioKey, AnalysisCore> = {
  "audit-tomorrow": {
    simulationTitle: "Government Audit Readiness Stress Test",
    riskScore: 82,
    riskLevel: "High",
    failureCount: 7,
    criticalBlockerCount: 3,
    delayDays: 14,
    wowSummary:
      "PreMortem complete: evidence gaps, weak control-to-artifact mapping, and unnamed regulator-response owners create a 14-day delay exposure under audit surge.",
    executiveSummary:
      "Under tomorrow’s audit posture, the operating model cannot prove completeness of evidence or delegation authority. Approval matrices are implicit, control mappings are fragmented, and no named owner owns the regulator response timeline — creating stall risk within the first evidence request cycle.",
    recommendation:
      "Stand up an evidence readiness index with named owners within 48 hours, publish a deputized approval matrix, and rehearse a timed regulator-response drill before the audit window closes.",
    confidence: 88,
    failurePoints: [
      {
        id: "aud-fp-1",
        severity: "Critical",
        title: "Approval matrix not published",
        area: "Governance",
        signal:
          "Delegations exist in practice but are not versioned or attestable for auditors.",
        impact: "First ownership challenge freezes decision throughput.",
      },
      {
        id: "aud-fp-2",
        severity: "Critical",
        title: "Control-to-evidence mapping absent",
        area: "Compliance",
        signal:
          "Artifacts live across drives and tickets without a control index.",
        impact: "Cannot prove coverage under tight regulator timelines.",
      },
      {
        id: "aud-fp-3",
        severity: "Critical",
        title: "Regulator response owner unclear",
        area: "Audit Response",
        signal:
          "Escalation paths name roles informally, not clocked accountable owners.",
        impact: "Response latency breaches escalate to leadership overnight.",
      },
      {
        id: "aud-fp-4",
        severity: "High",
        title: "Conflict-of-interest attestations stale",
        area: "Ethics",
        signal: "Quarterly attestations not reconciled to active engagements.",
        impact: "Audit findings on integrity controls become likely.",
      },
      {
        id: "aud-fp-5",
        severity: "High",
        title: "Disclosure log fragmentation",
        area: "Disclosure",
        signal: "Partial logs in email threads lack immutable timestamps.",
        impact: "Disclosure narrative cannot be reconstructed quickly.",
      },
      {
        id: "aud-fp-6",
        severity: "Medium",
        title: "Sampling methodology undocumented",
        area: "Testing",
        signal: "Test samples chosen ad hoc without reproducible criteria.",
        impact: "Expandable scope risk during fieldwork.",
      },
      {
        id: "aud-fp-7",
        severity: "Medium",
        title: "Third-party evidence SLAs informal",
        area: "Third Parties",
        signal: "Vendor evidence requests lack contractual turnaround clauses.",
        impact: "Clock bleed while waiting on vendor artifacts.",
      },
    ],
    criticalBlockers: [
      {
        id: "aud-cb-1",
        title: "No defensible evidence catalog",
        detail:
          "Cannot produce an indexed evidence pack mapped to controls within 24 hours.",
      },
      {
        id: "aud-cb-2",
        title: "Single-threaded executive sign-off",
        detail:
          "No deputized approver with pre-authorized limits for surge periods.",
      },
      {
        id: "aud-cb-3",
        title: "Regulator comms playbook informal",
        detail:
          "No timed rehearsal or approved narrative owners for escalations.",
      },
    ],
    impactAreas: [
      {
        id: "aud-ia-1",
        label: "Audit readiness",
        exposure: "High — completeness challenge",
        metric: "Open evidence gaps: 12",
      },
      {
        id: "aud-ia-2",
        label: "Leadership credibility",
        exposure: "Elevated — governance optics",
        metric: "Ownership disputes: 4 roles",
      },
      {
        id: "aud-ia-3",
        label: "Remediation velocity",
        exposure: "High — clock pressure",
        metric: "Delay exposure: 14 days",
      },
    ],
    fixPlan: [
      {
        id: "aud-fx-1",
        priority: "P0",
        action: "Publish backup approver matrix with limits",
        owner: "COO Office",
        evidenceNeeded: "Approval matrix, delegation attestations",
        timeframe: "48h",
        status: "Proposed",
      },
      {
        id: "aud-fx-2",
        priority: "P0",
        action: "Stand up control-to-evidence readiness index",
        owner: "Compliance Lead",
        evidenceNeeded: "Control map, artifact owners",
        timeframe: "5 days",
        status: "Proposed",
      },
      {
        id: "aud-fx-3",
        priority: "P1",
        action: "Name regulator response owner + deputy",
        owner: "Legal / Audit",
        evidenceNeeded: "RACI, response charter",
        timeframe: "72h",
        status: "Proposed",
      },
      {
        id: "aud-fx-4",
        priority: "P1",
        action: "Immutable disclosure log export process",
        owner: "Records",
        evidenceNeeded: "Logging spec, retention policy",
        timeframe: "7 days",
        status: "Proposed",
      },
      {
        id: "aud-fx-5",
        priority: "P2",
        action: "Vendor evidence SLA addendum",
        owner: "Procurement",
        evidenceNeeded: "Contract clauses template",
        timeframe: "10 days",
        status: "Proposed",
      },
    ],
    evidenceChecklist: [
      {
        id: "aud-ev-1",
        label: "Signed approval matrix (current quarter)",
        required: true,
        checked: false,
      },
      {
        id: "aud-ev-2",
        label: "Control-to-evidence workbook",
        required: true,
        checked: false,
      },
      {
        id: "aud-ev-3",
        label: "Conflict-of-interest attestation rollup",
        required: true,
        checked: false,
      },
      {
        id: "aud-ev-4",
        label: "Disclosure log immutable export",
        required: false,
        checked: true,
      },
      {
        id: "aud-ev-5",
        label: "Regulator response rehearsal notes",
        required: false,
        checked: false,
      },
    ],
  },

  "critical-vendor-fails": {
    simulationTitle: "Critical Supplier Continuity Breakdown",
    riskScore: 79,
    riskLevel: "High",
    failureCount: 7,
    criticalBlockerCount: 3,
    delayDays: 11,
    wowSummary:
      "PreMortem complete: tier-2 blind spots, missing backup triggers, and stale continuity artifacts threaten revenue commitments within ~11 days.",
    executiveSummary:
      "When the tier-1 supplier fails, monitoring does not illuminate tier-2 cascades early enough. Backup vendor triggers are undefined, continuity runbooks predate topology changes, and breach-notification chains lack clocked owners — exposing fulfillment and customer trust simultaneously.",
    recommendation:
      "Instrument tier-2 signals with thresholds, codify backup triggers with finance approval, refresh continuity tabletop evidence, and rehearse customer/revenue comms within one sprint.",
    confidence: 86,
    failurePoints: [
      {
        id: "ven-fp-1",
        severity: "Critical",
        title: "Tier-2 monitoring absent",
        area: "Supply Chain",
        signal: "No automated signals when sub-suppliers breach thresholds.",
        impact: "Latency discovers cascade after revenue commitments slip.",
      },
      {
        id: "ven-fp-2",
        severity: "Critical",
        title: "Backup vendor trigger undefined",
        area: "Operations",
        signal: "Playbooks reference backups without activation criteria.",
        impact: "Teams negotiate under fire instead of executing switches.",
      },
      {
        id: "ven-fp-3",
        severity: "Critical",
        title: "Breach notification RACI unclear",
        area: "Legal / Ops",
        signal: "Who notifies customers vs regulators is argued case-by-case.",
        impact: "Regulatory and contractual clocks diverge.",
      },
      {
        id: "ven-fp-4",
        severity: "High",
        title: "Corrective action evidence scattered",
        area: "Quality",
        signal: "CAPA records do not chain to supplier assessments.",
        impact: "Audit challenges repeat findings.",
      },
      {
        id: "ven-fp-5",
        severity: "High",
        title: "Continuity runbook stale",
        area: "BC",
        signal: "Last drill predates current supplier graph.",
        impact: "Wrong contacts and wrong assumptions during incident.",
      },
      {
        id: "ven-fp-6",
        severity: "Medium",
        title: "Upstream environmental claims unaudited",
        area: "ESG",
        signal: "Self-assessments not reconciled to invoices.",
        impact: "Brand/regulatory exposure on misrepresentation.",
      },
      {
        id: "ven-fp-7",
        severity: "Medium",
        title: "Inventory buffers misaligned",
        area: "Planning",
        signal: "Safety stock math ignores longest-tier lead times.",
        impact: "Stockouts sync with supplier delays.",
      },
    ],
    criticalBlockers: [
      {
        id: "ven-cb-1",
        title: "No tier-2 signal instrumentation",
        detail:
          "Cannot see upstream failure before customer-visible slip.",
      },
      {
        id: "ven-cb-2",
        title: "Backup activation authority fuzzy",
        detail:
          "Finance and ops disagree on when spend switches vendors.",
      },
      {
        id: "ven-cb-3",
        title: "Customer breach narrative unprepared",
        detail:
          "No approved templates or exec spokespeople on clock.",
      },
    ],
    impactAreas: [
      {
        id: "ven-ia-1",
        label: "Revenue continuity",
        exposure: "High — fulfillment",
        metric: "SLA breach risk: 21%",
      },
      {
        id: "ven-ia-2",
        label: "Customer trust",
        exposure: "Elevated — comms",
        metric: "Escalation queue +35%",
      },
      {
        id: "ven-ia-3",
        label: "Regulatory notification",
        exposure: "Moderate — clocks",
        metric: "Contractual notice gaps: 3 regions",
      },
    ],
    fixPlan: [
      {
        id: "ven-fx-1",
        priority: "P0",
        action: "Define backup vendor triggers + approvers",
        owner: "COO / CFO",
        evidenceNeeded: "Decision tree, limits matrix",
        timeframe: "72h",
        status: "Proposed",
      },
      {
        id: "ven-fx-2",
        priority: "P0",
        action: "Deploy tier-2 monitoring thresholds",
        owner: "Supply Chain",
        evidenceNeeded: "Vendor graph export, alert config",
        timeframe: "5 days",
        status: "Proposed",
      },
      {
        id: "ven-fx-3",
        priority: "P1",
        action: "Refresh continuity tabletop + contacts",
        owner: "BC Lead",
        evidenceNeeded: "Drill minutes, roster attestation",
        timeframe: "7 days",
        status: "Proposed",
      },
      {
        id: "ven-fx-4",
        priority: "P1",
        action: "Publish breach notification RACI",
        owner: "Legal",
        evidenceNeeded: "Playbook, templates",
        timeframe: "5 days",
        status: "Proposed",
      },
      {
        id: "ven-fx-5",
        priority: "P2",
        action: "Chain CAPA to supplier assessments",
        owner: "Quality",
        evidenceNeeded: "Workflow mapping",
        timeframe: "12 days",
        status: "Proposed",
      },
    ],
    evidenceChecklist: [
      {
        id: "ven-ev-1",
        label: "Vendor topology export (signed)",
        required: true,
        checked: false,
      },
      {
        id: "ven-ev-2",
        label: "Monitoring configuration screenshot pack",
        required: true,
        checked: false,
      },
      {
        id: "ven-ev-3",
        label: "Backup trigger approval memo",
        required: true,
        checked: false,
      },
      {
        id: "ven-ev-4",
        label: "Continuity drill attestation",
        required: false,
        checked: true,
      },
      {
        id: "ven-ev-5",
        label: "Customer notification templates v2",
        required: false,
        checked: false,
      },
    ],
  },

  "sensitive-data-exposure": {
    simulationTitle: "Sensitive Data Handling Failure Mode",
    riskScore: 84,
    riskLevel: "High",
    failureCount: 7,
    criticalBlockerCount: 3,
    delayDays: 9,
    wowSummary:
      "PreMortem complete: weak handling paths, unclear escalation ownership, and missing access-review evidence spike compliance exposure within ~9 days.",
    executiveSummary:
      "Sensitive data moves through informal channels without immutable routing controls. Escalation ownership at hour zero is contested, access-review evidence is incomplete, and incident communications risk contradictory narratives — compounding regulatory and customer penalties.",
    recommendation:
      "Freeze non-standard sharing paths, name containment + comms owners with timers, export access-review evidence packs, and rehearse coordinated regulator/customer storyline.",
    confidence: 87,
    failurePoints: [
      {
        id: "dat-fp-1",
        severity: "Critical",
        title: "Escalation owner undefined",
        area: "Incident",
        signal: "Runbooks list committees instead of named executives.",
        impact: "Containment delays amplify exposure scope.",
      },
      {
        id: "dat-fp-2",
        severity: "Critical",
        title: "Access review evidence incomplete",
        area: "IAM",
        signal: "Privileged lists reconciled informally monthly.",
        impact: "Cannot prove least-privilege posture.",
      },
      {
        id: "dat-fp-3",
        severity: "Critical",
        title: "Data lineage gaps for sensitive sets",
        area: "Data Gov",
        signal: "Flows documented at system-level only.",
        impact: "Impact analysis underestimates recipients.",
      },
      {
        id: "dat-fp-4",
        severity: "High",
        title: "Customer comms timeline informal",
        area: "Comms",
        signal: "No synchronized clock with legal holds.",
        impact: "Premature or late disclosures.",
      },
      {
        id: "dat-fp-5",
        severity: "High",
        title: "Third-party subprocessors unaudited",
        area: "Vendor Risk",
        signal: "DPAs lack audit exhibit specifics.",
        impact: "Liability cascade unclear.",
      },
      {
        id: "dat-fp-6",
        severity: "Medium",
        title: "Encryption posture inconsistent",
        area: "Security",
        signal: "Legacy exports skip enforced KMS paths.",
        impact: "Expanded forensic scope.",
      },
      {
        id: "dat-fp-7",
        severity: "Medium",
        title: "Training attestations stale",
        area: "HR",
        signal: "Sensitive-handling training optional for contractors.",
        impact: "Human-error defense weak.",
      },
    ],
    criticalBlockers: [
      {
        id: "dat-cb-1",
        title: "No hour-zero incident commander",
        detail:
          "Legal, security, and comms dispute activation authority.",
      },
      {
        id: "dat-cb-2",
        title: "Incomplete access certification archive",
        detail:
          "Missing signatures for last two quarters.",
      },
      {
        id: "dat-cb-3",
        title: "Customer/regulator narrative divergent",
        detail:
          "Two draft FAQs contradict scope statements.",
      },
    ],
    impactAreas: [
      {
        id: "dat-ia-1",
        label: "Compliance exposure",
        exposure: "High — breach readiness",
        metric: "Open IAM findings: 8",
      },
      {
        id: "dat-ia-2",
        label: "Customer trust",
        exposure: "High — transparency",
        metric: "Escalation SLA slip: +4 days",
      },
      {
        id: "dat-ia-3",
        label: "Forensic cost",
        exposure: "Elevated — scope",
        metric: "Systems in scope: +18",
      },
    ],
    fixPlan: [
      {
        id: "dat-fx-1",
        priority: "P0",
        action: "Name incident commander + deputy",
        owner: "CISO / Legal",
        evidenceNeeded: "IR charter update",
        timeframe: "48h",
        status: "Proposed",
      },
      {
        id: "dat-fx-2",
        priority: "P0",
        action: "Complete access certification archive",
        owner: "IAM Lead",
        evidenceNeeded: "Signed quarterly packs",
        timeframe: "5 days",
        status: "Proposed",
      },
      {
        id: "dat-fx-3",
        priority: "P1",
        action: "Unified customer/regulator FAQ",
        owner: "Comms",
        evidenceNeeded: "Legal review memo",
        timeframe: "72h",
        status: "Proposed",
      },
      {
        id: "dat-fx-4",
        priority: "P1",
        action: "Block legacy export paths",
        owner: "Security Eng",
        evidenceNeeded: "Change tickets",
        timeframe: "6 days",
        status: "Proposed",
      },
      {
        id: "dat-fx-5",
        priority: "P2",
        action: "Contract DPA exhibit refresh",
        owner: "Procurement",
        evidenceNeeded: "Redlines log",
        timeframe: "14 days",
        status: "Proposed",
      },
    ],
    evidenceChecklist: [
      {
        id: "dat-ev-1",
        label: "Privileged access quarterly certification",
        required: true,
        checked: false,
      },
      {
        id: "dat-ev-2",
        label: "Data flow diagram for sensitive sets",
        required: true,
        checked: false,
      },
      {
        id: "dat-ev-3",
        label: "Incident commander appointment letter",
        required: true,
        checked: false,
      },
      {
        id: "dat-ev-4",
        label: "Training completion extract",
        required: false,
        checked: true,
      },
      {
        id: "dat-ev-5",
        label: "Single FAQ source-of-truth export",
        required: false,
        checked: false,
      },
    ],
  },

  "enterprise-client-escalates": {
    simulationTitle: "Strategic Client Escalation Visibility Crisis",
    riskScore: 76,
    riskLevel: "Elevated",
    failureCount: 7,
    criticalBlockerCount: 3,
    delayDays: 10,
    wowSummary:
      "PreMortem complete: SLA ownership gaps and fragmented communication records erode executive credibility within ~10 days under escalation heat.",
    executiveSummary:
      "The escalation lacks a single accountable SLA owner, client-facing timelines are commitments without logged approvals, and communication records live across channels — producing contradictory narratives and trust erosion with a strategic account.",
    recommendation:
      "Stand up a war-room RACI with clocked client milestones, consolidate communication logs into one source of truth, and publish executive-read dashboards tied to remediation owners.",
    confidence: 83,
    failurePoints: [
      {
        id: "cli-fp-1",
        severity: "Critical",
        title: "SLA ownership ambiguous",
        area: "Customer Ops",
        signal: "Multiple VPs named without signing RACI.",
        impact: "Missed commitments without clear accountability.",
      },
      {
        id: "cli-fp-2",
        severity: "Critical",
        title: "No client-visible timeline artifact",
        area: "Delivery",
        signal: "Dates communicated verbally and in chat only.",
        impact: "Disputed expectations during QBR.",
      },
      {
        id: "cli-fp-3",
        severity: "Critical",
        title: "Fragmented communication record",
        area: "Governance",
        signal: "Email, Slack, and tickets disagree on facts.",
        impact: "Forensic reconstruction burns executive time.",
      },
      {
        id: "cli-fp-4",
        severity: "High",
        title: "Escalation playbook informal",
        area: "CX",
        signal: "Steps rely on tribal knowledge.",
        impact: "On-call engineers improvise responses.",
      },
      {
        id: "cli-fp-5",
        severity: "High",
        title: "Credit/remedy authority unclear",
        area: "Finance",
        signal: "Commercial gestures require multi-week approvals.",
        impact: "Perception of inflexibility worsens churn risk.",
      },
      {
        id: "cli-fp-6",
        severity: "Medium",
        title: "Support taxonomy mismatch",
        area: "Support",
        signal: "Severity codes differ between vendor and client.",
        impact: "Mis-prioritized engineering pulls.",
      },
      {
        id: "cli-fp-7",
        severity: "Medium",
        title: "Exec sponsor drift",
        area: "Sales",
        signal: "Named sponsor rotated without client acknowledgement.",
        impact: "Relationship continuity breaks.",
      },
    ],
    criticalBlockers: [
      {
        id: "cli-cb-1",
        title: "No signed escalation RACI",
        detail:
          "Cannot prove who owns client commitments.",
      },
      {
        id: "cli-cb-2",
        title: "Single source of truth missing",
        detail:
          "Three competing timelines circulating externally.",
      },
      {
        id: "cli-cb-3",
        title: "Remedy authority bottleneck",
        detail:
          "No pre-approved gesture envelope for surge.",
      },
    ],
    impactAreas: [
      {
        id: "cli-ia-1",
        label: "Trust / transparency",
        exposure: "High — strategic account",
        metric: "Net sentiment: −22 pts",
      },
      {
        id: "cli-ia-2",
        label: "Renewal exposure",
        exposure: "Elevated — commercial",
        metric: "At-risk ARR: material",
      },
      {
        id: "cli-ia-3",
        label: "Executive load",
        exposure: "High — time cost",
        metric: "War-room hours/week: 18",
      },
    ],
    fixPlan: [
      {
        id: "cli-fx-1",
        priority: "P0",
        action: "Publish escalation RACI + milestones",
        owner: "COO",
        evidenceNeeded: "Signed charter",
        timeframe: "48h",
        status: "Proposed",
      },
      {
        id: "cli-fx-2",
        priority: "P0",
        action: "Consolidate client communication log",
        owner: "Program Mgmt",
        evidenceNeeded: "Export + hash manifest",
        timeframe: "72h",
        status: "Proposed",
      },
      {
        id: "cli-fx-3",
        priority: "P1",
        action: "Codify remedy envelope limits",
        owner: "CFO",
        evidenceNeeded: "Policy memo",
        timeframe: "5 days",
        status: "Proposed",
      },
      {
        id: "cli-fx-4",
        priority: "P1",
        action: "Align severity taxonomy",
        owner: "Support Lead",
        evidenceNeeded: "Joint dictionary doc",
        timeframe: "6 days",
        status: "Proposed",
      },
      {
        id: "cli-fx-5",
        priority: "P2",
        action: "Executive sponsor continuity letter",
        owner: "Sales VP",
        evidenceNeeded: "Client-signed acknowledgement",
        timeframe: "10 days",
        status: "Proposed",
      },
    ],
    evidenceChecklist: [
      {
        id: "cli-ev-1",
        label: "Client-visible timeline PDF (versioned)",
        required: true,
        checked: false,
      },
      {
        id: "cli-ev-2",
        label: "Communication log consolidation export",
        required: true,
        checked: false,
      },
      {
        id: "cli-ev-3",
        label: "Escalation RACI signatures",
        required: true,
        checked: false,
      },
      {
        id: "cli-ev-4",
        label: "Remedy envelope policy",
        required: false,
        checked: true,
      },
      {
        id: "cli-ev-5",
        label: "Joint severity glossary",
        required: false,
        checked: false,
      },
    ],
  },

  "approval-workflow-breaks": {
    simulationTitle: "Executive Approval Bottleneck Collapse",
    riskScore: 80,
    riskLevel: "High",
    failureCount: 7,
    criticalBlockerCount: 3,
    delayDays: 12,
    wowSummary:
      "PreMortem complete: single-threaded approvals, missing fallback owners, and incomplete decision logs stall operations within ~12 days.",
    executiveSummary:
      "Approvals collapse to one executive without deputized limits. Delegation policies are aspirational, emergency overrides hide in chat, and decision logs cannot reconstruct rationale — creating throughput risk and weak audit posture simultaneously.",
    recommendation:
      "Publish deputized approvers with limits, instrument approval SLAs with timers, and require structured decision logs for overrides.",
    confidence: 85,
    failurePoints: [
      {
        id: "app-fp-1",
        severity: "Critical",
        title: "Single-threaded executive approval",
        area: "Governance",
        signal: "No acting approver when executive travels.",
        impact: "Ship decisions stall across portfolios.",
      },
      {
        id: "app-fp-2",
        severity: "Critical",
        title: "Delegation limits undocumented",
        area: "Policy",
        signal: "Managers infer limits from verbal guidance.",
        impact: "Retroactive voiding risk on commitments.",
      },
      {
        id: "app-fp-3",
        severity: "Critical",
        title: "Decision logs incomplete",
        area: "Audit",
        signal: "Approvals captured as email forwards without metadata.",
        impact: "Cannot defend approvals under scrutiny.",
      },
      {
        id: "app-fp-4",
        severity: "High",
        title: "Emergency override abuse window",
        area: "Risk",
        signal: "Dual-control waived without expiry timers.",
        impact: "Segregation-of-duties drift.",
      },
      {
        id: "app-fp-5",
        severity: "High",
        title: "Workflow tool misconfigured",
        area: "IT",
        signal: "Routes skip quality gates under load.",
        impact: "Defective releases reach clients.",
      },
      {
        id: "app-fp-6",
        severity: "Medium",
        title: "Cross-border approval friction",
        area: "Legal",
        signal: "Regional holidays not modeled in SLAs.",
        impact: "Predictable latency spikes ignored.",
      },
      {
        id: "app-fp-7",
        severity: "Medium",
        title: "Vendor invoice approval latency",
        area: "Finance",
        signal: "Threshold tables stale vs spend reality.",
        impact: "Cash discounts missed.",
      },
    ],
    criticalBlockers: [
      {
        id: "app-cb-1",
        title: "No deputized approver roster",
        detail:
          "Continuity breaks whenever executive is unavailable.",
      },
      {
        id: "app-cb-2",
        title: "Approval SLA not instrumented",
        detail:
          "Queues grow silently until customer impact.",
      },
      {
        id: "app-cb-3",
        title: "Immutable rationale capture absent",
        detail:
          "Cannot explain why expedited approvals occurred.",
      },
    ],
    impactAreas: [
      {
        id: "app-ia-1",
        label: "Operational throughput",
        exposure: "High — delivery",
        metric: "Queue depth +140%",
      },
      {
        id: "app-ia-2",
        label: "Audit posture",
        exposure: "Elevated — logging",
        metric: "Missing rationale: 37%",
      },
      {
        id: "app-ia-3",
        label: "Vendor relationships",
        exposure: "Moderate — payments",
        metric: "Late pay incidents +19%",
      },
    ],
    fixPlan: [
      {
        id: "app-fx-1",
        priority: "P0",
        action: "Publish deputized matrix + limits",
        owner: "COO Office",
        evidenceNeeded: "Signed matrix",
        timeframe: "48h",
        status: "Proposed",
      },
      {
        id: "app-fx-2",
        priority: "P0",
        action: "Instrument approval SLA timers",
        owner: "BizTech",
        evidenceNeeded: "Workflow config export",
        timeframe: "5 days",
        status: "Proposed",
      },
      {
        id: "app-fx-3",
        priority: "P1",
        action: "Structured decision log for overrides",
        owner: "Risk",
        evidenceNeeded: "Template + training",
        timeframe: "7 days",
        status: "Proposed",
      },
      {
        id: "app-fx-4",
        priority: "P1",
        action: "Emergency override expiry automation",
        owner: "Security",
        evidenceNeeded: "Policy + tooling tickets",
        timeframe: "8 days",
        status: "Proposed",
      },
      {
        id: "app-fx-5",
        priority: "P2",
        action: "Refresh invoice thresholds",
        owner: "Finance Ops",
        evidenceNeeded: "Spend analysis export",
        timeframe: "10 days",
        status: "Proposed",
      },
    ],
    evidenceChecklist: [
      {
        id: "app-ev-1",
        label: "Signed delegation matrix",
        required: true,
        checked: false,
      },
      {
        id: "app-ev-2",
        label: "Workflow routing audit export",
        required: true,
        checked: false,
      },
      {
        id: "app-ev-3",
        label: "Override log pilot extract",
        required: true,
        checked: false,
      },
      {
        id: "app-ev-4",
        label: "SLA instrumentation screenshot pack",
        required: false,
        checked: true,
      },
      {
        id: "app-ev-5",
        label: "Regional holiday SLA appendix",
        required: false,
        checked: false,
      },
    ],
  },

  "ai-governance-failure": {
    simulationTitle: "Enterprise AI Governance & Logging Breakdown",
    riskScore: 83,
    riskLevel: "High",
    failureCount: 7,
    criticalBlockerCount: 3,
    delayDays: 13,
    wowSummary:
      "PreMortem complete: incomplete AI decision logs, weak human review paths, and missing monitoring evidence heighten auditability risk within ~13 days.",
    executiveSummary:
      "Model-assisted approvals lack immutable rationale snapshots. Human review checkpoints are bypassable under load, monitoring evidence packs are incomplete, and responsible-use attestations are absent — preventing defensible reconstruction for regulators or enterprise customers.",
    recommendation:
      "Ship immutable AI decision exports with reviewer identity, require monitoring evidence bundles per deployment, and publish responsible-use attestation tied to named owners before scaling agents.",
    confidence: 89,
    failurePoints: [
      {
        id: "ai-fp-1",
        severity: "Critical",
        title: "AI decision logs incomplete",
        area: "AI Governance",
        signal: "Prompt/context discarded after session.",
        impact: "Cannot reconstruct decisions under audit.",
      },
      {
        id: "ai-fp-2",
        severity: "Critical",
        title: "Human review path weak",
        area: "Risk",
        signal: "Rubber-stamp approvals under SLA pressure.",
        impact: "Unsafe automation scales quietly.",
      },
      {
        id: "ai-fp-3",
        severity: "Critical",
        title: "Model monitoring evidence missing",
        area: "MLOps",
        signal: "Dashboards exist but retention + signing absent.",
        impact: "Drift incidents invisible historically.",
      },
      {
        id: "ai-fp-4",
        severity: "High",
        title: "Responsible-use attestation absent",
        area: "Compliance",
        signal: "No quarterly sign-off tied to deployment scope.",
        impact: "Governance narrative unavailable to board.",
      },
      {
        id: "ai-fp-5",
        severity: "High",
        title: "PII handling in prompts unclear",
        area: "Privacy",
        signal: "Redaction controls inconsistent across tools.",
        impact: "Data spill during investigations.",
      },
      {
        id: "ai-fp-6",
        severity: "Medium",
        title: "Bias testing artifacts stale",
        area: "Responsible AI",
        signal: "Last evaluation predates feature launch.",
        impact: "Fairness exposure on regulated decisions.",
      },
      {
        id: "ai-fp-7",
        severity: "Medium",
        title: "Vendor model dependency undocumented",
        area: "Security",
        signal: "Subprocessor model paths implicit.",
        impact: "Supply-chain transparency gaps.",
      },
    ],
    criticalBlockers: [
      {
        id: "ai-cb-1",
        title: "No immutable AI rationale export",
        detail:
          "Logs mutable or truncated before retention window.",
      },
      {
        id: "ai-cb-2",
        title: "Monitoring bundle not audit-signed",
        detail:
          "Cannot prove drift controls operated continuously.",
      },
      {
        id: "ai-cb-3",
        title: "Human review bypass under load",
        detail:
          "Queues auto-approve when backlog > threshold.",
      },
    ],
    impactAreas: [
      {
        id: "ai-ia-1",
        label: "Auditability",
        exposure: "High — reconstruction",
        metric: "Missing rationale trails: 41%",
      },
      {
        id: "ai-ia-2",
        label: "Regulatory posture",
        exposure: "Elevated — AI oversight",
        metric: "Open governance findings: 6",
      },
      {
        id: "ai-ia-3",
        label: "Customer trust",
        exposure: "Moderate — transparency",
        metric: "AI clauses questioned: 3 accounts",
      },
    ],
    fixPlan: [
      {
        id: "ai-fx-1",
        priority: "P0",
        action: "Immutable AI decision export pipeline",
        owner: "AI Governance",
        evidenceNeeded: "Logging spec, retention attestation",
        timeframe: "7 days",
        status: "Proposed",
      },
      {
        id: "ai-fx-2",
        priority: "P0",
        action: "Enforce human review gates (non-bypassable)",
        owner: "Risk",
        evidenceNeeded: "Workflow controls export",
        timeframe: "5 days",
        status: "Proposed",
      },
      {
        id: "ai-fx-3",
        priority: "P1",
        action: "Signed monitoring evidence bundles",
        owner: "MLOps",
        evidenceNeeded: "Dashboard archives + hashes",
        timeframe: "8 days",
        status: "Proposed",
      },
      {
        id: "ai-fx-4",
        priority: "P1",
        action: "Responsible-use quarterly attestation",
        owner: "Compliance",
        evidenceNeeded: "Sign-off templates",
        timeframe: "10 days",
        status: "Proposed",
      },
      {
        id: "ai-fx-5",
        priority: "P2",
        action: "Refresh bias evaluation artifacts",
        owner: "Responsible AI",
        evidenceNeeded: "Test harness outputs",
        timeframe: "12 days",
        status: "Proposed",
      },
    ],
    evidenceChecklist: [
      {
        id: "ai-ev-1",
        label: "AI logging architecture diagram (approved)",
        required: true,
        checked: false,
      },
      {
        id: "ai-ev-2",
        label: "Human review configuration export",
        required: true,
        checked: false,
      },
      {
        id: "ai-ev-3",
        label: "Monitoring retention attestation",
        required: true,
        checked: false,
      },
      {
        id: "ai-ev-4",
        label: "PII redaction test results",
        required: false,
        checked: true,
      },
      {
        id: "ai-ev-5",
        label: "Subprocessor AI disclosure update",
        required: false,
        checked: false,
      },
    ],
  },
};

export function getMockAnalysis(
  documentId: string | null,
  scenarioId: string | null,
  options?: { isPasteCapture?: boolean },
): PremortemAnalysis {
  const scenarioKey = normalizeScenarioId(scenarioId);
  const core = ANALYSIS_CORE[scenarioKey];
  const scenarioMeta = getScenarioById(scenarioKey);
  const scenarioTitle =
    scenarioMeta?.title ?? getScenarioById(DEFAULT_SCENARIO)!.title;

  const isPaste = options?.isPasteCapture === true;
  let documentTitle: string;
  if (isPaste) {
    documentTitle =
      "Local operational excerpt (simulated public-demo capture)";
  } else {
    const doc = getSampleDocById(documentId ?? DEFAULT_DOC_ID);
    documentTitle =
      doc?.title ??
      getSampleDocById(DEFAULT_DOC_ID)?.title ??
      "IBM Government Client Guidelines";
  }

  return {
    ...core,
    documentTitle,
    scenarioTitle,
    auditTrail: auditFor(scenarioTitle, core.criticalBlockerCount),
  };
}

/** Default analysis for legacy imports / smoke tests. */
export const mockAnalysis = getMockAnalysis(DEFAULT_DOC_ID, DEFAULT_SCENARIO, {
  isPasteCapture: false,
});

export function scenarioSlugForFilename(scenarioId: string | null): string {
  const key = normalizeScenarioId(scenarioId);
  return key.replace(/-/g, "_");
}
