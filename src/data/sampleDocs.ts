export type SampleDoc = {
  id: string;
  buttonLabel: string;
  shortTitle: string;
  title: string;
  organization: "IBM";
  sourceLabel: string;
  recommendedScenarioId: string;
  summary: string;
  simulatedExcerpt: string;
  signalThemes: string[];
  demoReason: string;
};

export const sampleDocs: SampleDoc[] = [
  {
    id: "ibm-government-guidelines",
    buttonLabel: "IBM Government Audit Simulation",
    shortTitle: "Gov Client Guidelines",
    title: "IBM Government Client Guidelines",
    organization: "IBM",
    sourceLabel:
      "IBM public-facing guidance (representative excerpt — simulated for demo)",
    recommendedScenarioId: "audit-tomorrow",
    summary:
      "Standards for government-client engagement, disclosure hygiene, and evidence readiness under scrutiny.",
    simulatedExcerpt:
      "Simulated excerpt: engagements require documented approval chains, conflict-of-interest attestations, and auditable disclosure logs. Evidence owners must be named before contract execution.",
    signalThemes: [
      "government client engagement",
      "disclosure controls",
      "evidence readiness",
      "approval chains",
      "conflict-of-interest risk",
    ],
    demoReason:
      "Shows how policy language breaks under overnight audit pressure when matrices and owners are implicit.",
  },
  {
    id: "ibm-supplier-responsibility",
    buttonLabel: "IBM Supplier Failure Simulation",
    shortTitle: "Supply Chain Responsibility",
    title: "IBM Supply Chain Responsibility Requirements",
    organization: "IBM",
    sourceLabel:
      "IBM supplier responsibility expectations (representative excerpt — simulated for demo)",
    recommendedScenarioId: "critical-vendor-fails",
    summary:
      "Supplier assessments, corrective action, sustainability signals, and continuity expectations across tiers.",
    simulatedExcerpt:
      "Simulated excerpt: suppliers must maintain management-system evidence, cascade requirements to sub-suppliers, and notify IBM of material breaches within defined windows.",
    signalThemes: [
      "supplier monitoring",
      "corrective action",
      "continuity assumptions",
      "upstream dependency risk",
      "breach notification",
    ],
    demoReason:
      "Stress-tests tier-2 blind spots and stale continuity artifacts when a critical vendor stalls.",
  },
  {
    id: "ibm-ai-governance",
    buttonLabel: "IBM AI Governance Simulation",
    shortTitle: "Responsible AI / Granite",
    title: "IBM Responsible AI / Granite Responsible Use Guide",
    organization: "IBM",
    sourceLabel:
      "IBM responsible-AI governance materials (representative excerpt — simulated for demo)",
    recommendedScenarioId: "ai-governance-failure",
    summary:
      "Responsible deployment, human oversight, monitoring evidence, and governance artifacts for enterprise AI.",
    simulatedExcerpt:
      "Simulated excerpt: deployments require documented human review paths, model monitoring evidence, decision logs suitable for audit, and responsible-use attestations tied to owners.",
    signalThemes: [
      "model oversight",
      "responsible deployment",
      "human review",
      "AI decision logging",
      "governance evidence",
    ],
    demoReason:
      "Surfaces weak human-review and logging posture before agents scale inside regulated workflows.",
  },
];

export function getSampleDocById(id: string | null): SampleDoc | undefined {
  if (!id || id === "local-paste") return undefined;
  return sampleDocs.find((d) => d.id === id);
}
