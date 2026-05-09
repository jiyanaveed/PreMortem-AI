export type FelineSignalEngineState =
  | "idle"
  | "documentLoaded"
  | "scenarioSelected"
  | "analyzing"
  | "failureDetected"
  | "resolved";

export type Severity = "Critical" | "High" | "Medium";

export type FailurePoint = {
  id: string;
  severity: Severity;
  title: string;
  area: string;
  signal: string;
  impact: string;
};

export type CriticalBlocker = {
  id: string;
  title: string;
  detail: string;
};

export type ImpactArea = {
  id: string;
  label: string;
  exposure: string;
  metric: string;
};

export type FixPlanRow = {
  id: string;
  priority: "P0" | "P1" | "P2";
  action: string;
  owner: string;
  evidenceNeeded: string;
  timeframe: string;
  status: "Proposed" | "Approved" | "Rejected" | "Edited";
};

export type AuditEvent = {
  id: string;
  label: string;
  timestamp: string;
};

export type EvidenceItem = {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
};

/** Set by FastAPI on `/api/analyze`; omitted for in-browser demo mocks. */
export type AnalysisSource = "gemini" | "backend_fallback";

/** Full mock pre-mortem output for demo intelligence (Phase 3). */
export type PremortemAnalysis = {
  simulationTitle: string;
  documentTitle: string;
  scenarioTitle: string;
  riskScore: number;
  riskLevel: "High" | "Elevated" | "Moderate";
  failureCount: number;
  criticalBlockerCount: number;
  delayDays: number;
  executiveSummary: string;
  wowSummary: string;
  failurePoints: FailurePoint[];
  criticalBlockers: CriticalBlocker[];
  impactAreas: ImpactArea[];
  fixPlan: FixPlanRow[];
  auditTrail: AuditEvent[];
  evidenceChecklist: EvidenceItem[];
  recommendation: string;
  confidence: number;
  analysisSource?: AnalysisSource;
  fallbackReason?: string;
};

/** @deprecated Use PremortemAnalysis — kept for gradual migration. */
export type MockAnalysis = PremortemAnalysis;
