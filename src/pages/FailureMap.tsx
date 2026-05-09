import { AlertTriangle } from "lucide-react";
import { GlassPanel } from "../components/ui/GlassPanel";
import { SectionLabel } from "../components/ui/SectionLabel";
import { ExportBriefButton } from "../components/ui/ExportBriefButton";
import { FelineSignalEngine } from "../components/visual/FelineSignalEngine";
import { WowSummaryStrip } from "../components/risk/WowSummaryStrip";
import { RiskScoreOrb } from "../components/risk/RiskScoreOrb";
import { FailureSignalCard } from "../components/risk/FailureSignalCard";
import { ImpactAreaCard } from "../components/risk/ImpactAreaCard";
import { exportExecutiveBrief } from "../utils/exportBrief";
import { analysisSourceBadgeLabel } from "../utils/analysisSourceLabel";
import { usePremortemDisplay } from "../hooks/usePremortemDisplay";
import { useDemo } from "../context/DemoContext";

export function FailureMap() {
  const { analysisReady, selectedScenarioId, mode, cachedAnalysis } = useDemo();
  const {
    data: displayData,
    demoFallbackUsed,
    backendFallbackUsed,
    analysisError,
    showLiveGeminiCopy,
    showBackendFallbackCopy,
  } = usePremortemDisplay();

  const stripLabel = analysisSourceBadgeLabel(
    mode,
    demoFallbackUsed,
    cachedAnalysis,
  );

  const labelSuffix = mode === "live" && !demoFallbackUsed ? "live" : "demo";

  return (
    <div className="space-y-10 px-4 py-8 md:px-10 lg:px-14">
      <GlassPanel className="px-4 py-4 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <SectionLabel>
              Active simulation ({labelSuffix})
            </SectionLabel>
            <span className="mt-1 inline-flex rounded-full border border-warmBorder/70 bg-warmGlassSoft px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.28em] text-softLavender">
              {stripLabel}
            </span>
            <div className="mt-1 font-display text-lg font-semibold text-softWhite">
              {displayData.simulationTitle}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-mutedGrey">
              <span>
                <span className="text-softLavender">Document · </span>
                {displayData.documentTitle}
              </span>
              <span>
                <span className="text-softLavender">Scenario · </span>
                {displayData.scenarioTitle}
              </span>
            </div>
            {analysisError && (
              <p className="mt-2 max-w-xl text-[11px] leading-relaxed text-mutedGrey/95">
                {analysisError}
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
            {!analysisReady && (
              <span className="rounded-full border border-warmBorder bg-warmGlassSoft px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-mutedGrey">
                Preview · run from Input Signal to advance demo chain
              </span>
            )}
            {demoFallbackUsed && (
              <span className="rounded-full border border-peachGlow/35 bg-peachGlow/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-softLavender">
                Demo fallback used
              </span>
            )}
            {backendFallbackUsed && (
              <span className="rounded-full border border-warmBorder/80 bg-warmGlassSoft px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-mutedGrey">
                Backend fallback used
              </span>
            )}
            <ExportBriefButton
              onExport={() =>
                exportExecutiveBrief(displayData, selectedScenarioId)
              }
            />
          </div>
        </div>
      </GlassPanel>

      <WowSummaryStrip
        failureSignals={displayData.failureCount}
        criticalBlockers={displayData.criticalBlockerCount}
        delayDays={displayData.delayDays}
        subtitle={displayData.wowSummary}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <GlassPanel className="flex flex-col items-center justify-center px-6 py-10 md:px-10">
          <SectionLabel className="mb-4">Failure signal map</SectionLabel>
          <FelineSignalEngine state="failureDetected" size="lg" showLabels />
          <p className="mt-6 max-w-xl text-center text-sm text-mutedGrey">
            {displayData.executiveSummary}
          </p>
          <p className="mt-3 max-w-xl text-center text-[11px] text-mutedGrey/85">
            {showLiveGeminiCopy ? (
              <>
                Live Gemini analysis · verify exports against authoritative
                source documents.
              </>
            ) : showBackendFallbackCopy ? (
              <>
                Backend deterministic fallback · illustrative output until a
                full Gemini analysis succeeds.
              </>
            ) : (
              <>
                Mock enterprise pre-mortem output · simulated public-document
                excerpt.
              </>
            )}
          </p>
          {showBackendFallbackCopy && displayData.fallbackReason ? (
            <p className="mt-2 max-w-xl text-center text-[10px] text-mutedGrey/75">
              {displayData.fallbackReason}
            </p>
          ) : null}
        </GlassPanel>
        <div className="flex justify-center lg:justify-end">
          <RiskScoreOrb score={displayData.riskScore} level={displayData.riskLevel} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <SectionLabel>Critical blockers</SectionLabel>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {displayData.criticalBlockers.map((b) => (
              <GlassPanel key={b.id} glow="violet" className="p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg border border-sunsetCoral/35 bg-sunsetCoral/12 p-2 text-sunsetCoral">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-mutedGrey">
                      Blocker
                    </div>
                    <div className="mt-1 font-display text-base font-semibold text-softWhite">
                      {b.title}
                    </div>
                    <p className="mt-2 text-sm text-mutedGrey">{b.detail}</p>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>Failure signals</SectionLabel>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {displayData.failurePoints.map((fp) => (
              <FailureSignalCard key={fp.id} point={fp} />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>Impact topology</SectionLabel>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {displayData.impactAreas.map((a) => (
              <ImpactAreaCard key={a.id} area={a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
