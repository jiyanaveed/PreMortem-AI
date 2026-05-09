import { FelineSignalEngine } from "../components/visual/FelineSignalEngine";
import { FixPlanTable } from "../components/resolution/FixPlanTable";
import { EvidenceChecklist } from "../components/resolution/EvidenceChecklist";
import { AuditMemoryTimeline } from "../components/resolution/AuditMemoryTimeline";
import { RecommendationCard } from "../components/resolution/RecommendationCard";
import { exportExecutiveBrief } from "../utils/exportBrief";
import { useDemo } from "../context/DemoContext";
import { usePremortemDisplay } from "../hooks/usePremortemDisplay";

export function FixPlan() {
  const { selectedScenarioId } = useDemo();
  const {
    data,
    demoFallbackUsed,
    showLiveGeminiCopy,
    showBackendFallbackCopy,
  } = usePremortemDisplay();

  const resolutionHint = demoFallbackUsed
    ? "Shown output is demo intelligence after a frontend/API error (mock)."
    : showLiveGeminiCopy
      ? "Shown output is Live Gemini via your local API."
      : showBackendFallbackCopy
        ? "Shown output is the backend deterministic fallback (see Failure Map for detail)."
        : "Shown output is demo intelligence (mock).";

  return (
    <div className="px-4 py-8 md:px-10 lg:px-14">
      <p className="mb-6 max-w-2xl text-[11px] text-mutedGrey/90">
        Resolution path follows the same simulation context as Failure Map.{" "}
        {resolutionHint}
      </p>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <RecommendationCard
            analysis={data}
            showExport
            onExportBrief={() =>
              exportExecutiveBrief(data, selectedScenarioId)
            }
          />
          <FixPlanTable rows={data.fixPlan} />
        </div>
        <div className="space-y-6">
          <EvidenceChecklist items={data.evidenceChecklist} />
          <AuditMemoryTimeline events={data.auditTrail} />
          <div className="rounded-2xl border border-warmBorder bg-warmGlass px-6 py-8 text-center shadow-panel backdrop-blur-2xl ring-1 ring-peachGlow/15">
            <FelineSignalEngine state="resolved" size="sm" showLabels />
          </div>
        </div>
      </div>
    </div>
  );
}
