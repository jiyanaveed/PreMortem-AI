export type ScenarioCard = {
  id: string;
  title: string;
  subtitle: string;
  crisisBrief: string;
  boardQuestion: string;
  primaryRiskAreas: string[];
  recommendedDocIds: string[];
};

export const scenarios: ScenarioCard[] = [
  {
    id: "audit-tomorrow",
    title: "Audit Tomorrow",
    subtitle: "Regulator asks for evidence trail tomorrow",
    crisisBrief:
      "A government or enterprise audit lands in less than 24 hours; evidence must map cleanly to controls.",
    boardQuestion:
      "Can we prove ownership, completeness, and escalation readiness without heroic effort?",
    primaryRiskAreas: [
      "Evidence indexing",
      "Approval matrices",
      "Control-to-artifact mapping",
      "Regulator response ownership",
    ],
    recommendedDocIds: ["ibm-government-guidelines"],
  },
  {
    id: "critical-vendor-fails",
    title: "Critical Vendor Fails",
    subtitle: "Supplier outage threatens delivery",
    crisisBrief:
      "A tier-1 supplier misses compliance or delivery; cascade risk hits commitments and revenue.",
    boardQuestion:
      "Do we see tier-2 failure early enough to activate backups and customer comms?",
    primaryRiskAreas: [
      "Supplier monitoring",
      "Backup triggers",
      "Continuity runbooks",
      "Breach / escalation notification",
    ],
    recommendedDocIds: ["ibm-supplier-responsibility"],
  },
  {
    id: "sensitive-data-exposure",
    title: "Sensitive Data Exposure",
    subtitle: "Confidential data flows through weak process",
    crisisBrief:
      "Sensitive information moves across teams and tools without crisp handling rules.",
    boardQuestion:
      "Who owns containment, customer disclosure, and regulator narrative at hour zero?",
    primaryRiskAreas: [
      "Data handling",
      "Access reviews",
      "Incident communications",
      "Compliance exposure",
    ],
    recommendedDocIds: ["ibm-government-guidelines", "ibm-ai-governance"],
  },
  {
    id: "enterprise-client-escalates",
    title: "Enterprise Client Escalates",
    subtitle: "Client demands resolution visibility",
    crisisBrief:
      "A strategic customer escalates over delays, demanding transparent timelines and executives on the record.",
    boardQuestion:
      "Is there a single SLA-backed narrative with logged commitments?",
    primaryRiskAreas: [
      "SLA ownership",
      "Client-facing timelines",
      "Communication records",
      "Trust / transparency",
    ],
    recommendedDocIds: ["ibm-government-guidelines"],
  },
  {
    id: "approval-workflow-breaks",
    title: "Approval Workflow Breaks",
    subtitle: "Decision bottleneck delays operations",
    crisisBrief:
      "Executive approval paths collapse during surge or absence; delegations are unclear.",
    boardQuestion:
      "Can decisions proceed safely with pre-authorized backups and visible logs?",
    primaryRiskAreas: [
      "Delegation limits",
      "Fallback approvers",
      "Decision logs",
      "Operational throughput",
    ],
    recommendedDocIds: ["ibm-government-guidelines"],
  },
  {
    id: "ai-governance-failure",
    title: "AI Governance Failure",
    subtitle: "Weak oversight before AI agents scale internally",
    crisisBrief:
      "Model-assisted workflows lack durable human review, monitoring proof, and audit-grade logs.",
    boardQuestion:
      "Can we reconstruct AI-influenced decisions for regulators and customers?",
    primaryRiskAreas: [
      "Human review paths",
      "Model monitoring evidence",
      "Decision logging",
      "Responsible-use attestations",
    ],
    recommendedDocIds: ["ibm-ai-governance"],
  },
];

export function getScenarioById(id: string | null): ScenarioCard | undefined {
  if (!id) return undefined;
  return scenarios.find((s) => s.id === id);
}
