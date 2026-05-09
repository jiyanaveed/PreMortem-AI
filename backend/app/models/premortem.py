"""Pydantic models aligned with frontend `src/types/analysis.ts`."""

from typing import Literal

from pydantic import BaseModel, Field


Severity = Literal["Critical", "High", "Medium"]
RiskLevel = Literal["High", "Elevated", "Moderate"]
FixPriority = Literal["P0", "P1", "P2"]
FixStatus = Literal["Proposed", "Approved", "Rejected", "Edited"]
AnalysisSource = Literal["gemini", "backend_fallback"]
AnalysisDepth = Literal["standard", "strict"]


class FailurePointModel(BaseModel):
    id: str
    severity: Severity
    title: str
    area: str
    signal: str
    impact: str


class CriticalBlockerModel(BaseModel):
    id: str
    title: str
    detail: str


class ImpactAreaModel(BaseModel):
    id: str
    label: str
    exposure: str
    metric: str


class FixPlanRowModel(BaseModel):
    id: str
    priority: FixPriority
    action: str
    owner: str
    evidenceNeeded: str
    timeframe: str
    status: FixStatus


class AuditEventModel(BaseModel):
    id: str
    label: str
    timestamp: str


class EvidenceItemModel(BaseModel):
    id: str
    label: str
    required: bool
    checked: bool


class PremortemAnalysisResponse(BaseModel):
    simulationTitle: str
    documentTitle: str
    scenarioTitle: str
    riskScore: int = Field(ge=0, le=100)
    riskLevel: RiskLevel
    failureCount: int = Field(ge=0)
    criticalBlockerCount: int = Field(ge=0)
    delayDays: int = Field(ge=0)
    executiveSummary: str
    wowSummary: str
    failurePoints: list[FailurePointModel]
    criticalBlockers: list[CriticalBlockerModel]
    impactAreas: list[ImpactAreaModel]
    fixPlan: list[FixPlanRowModel]
    auditTrail: list[AuditEventModel]
    evidenceChecklist: list[EvidenceItemModel]
    recommendation: str
    confidence: int = Field(ge=0, le=100)
    analysisSource: AnalysisSource
    fallbackReason: str | None = None


class AnalyzeRequest(BaseModel):
    documentText: str
    documentTitle: str | None = None
    documentId: str | None = None
    scenarioId: str
    scenarioTitle: str | None = None
    scenarioDescription: str | None = None
    sourceType: str | None = None
    isPasteCapture: bool = False
    analysisDepth: AnalysisDepth = Field(default="standard")
