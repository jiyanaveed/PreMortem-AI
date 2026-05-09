import type { PremortemAnalysis } from "../../types/analysis";
import { GlassPanel } from "../ui/GlassPanel";
import { SectionLabel } from "../ui/SectionLabel";
import { ExportBriefButton } from "../ui/ExportBriefButton";

type RecommendationCardProps = {
  analysis: Pick<
    PremortemAnalysis,
    | "executiveSummary"
    | "recommendation"
    | "confidence"
    | "delayDays"
    | "simulationTitle"
  >;
  onExportBrief?: () => void;
  showExport?: boolean;
};

export function RecommendationCard({
  analysis,
  onExportBrief,
  showExport = false,
}: RecommendationCardProps) {
  return (
    <GlassPanel glow="blue" className="p-4 md:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <SectionLabel>Executive synthesis</SectionLabel>
          <div className="mt-2 font-display text-xl font-semibold text-softWhite">
            {analysis.simulationTitle}
          </div>
        </div>
        {showExport && onExportBrief && (
          <ExportBriefButton onExport={onExportBrief} className="shrink-0" />
        )}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-mutedGrey">
        {analysis.executiveSummary}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-softLavender/95">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-mutedGrey">
          Recommendation ·{" "}
        </span>
        {analysis.recommendation}
      </p>
      <div className="mt-4 grid gap-2 font-mono text-[11px] text-softWhite/90 md:grid-cols-3">
        <div className="rounded-lg border border-warmBorder/70 bg-warmGlassSoft px-3 py-2">
          Confidence (demo): {analysis.confidence}%
        </div>
        <div className="rounded-lg border border-warmBorder/70 bg-warmGlassSoft px-3 py-2">
          Delay exposure: {analysis.delayDays}d
        </div>
        <div className="rounded-lg border border-warmBorder/70 bg-warmGlassSoft px-3 py-2">
          Mock board-ready brief
        </div>
      </div>
    </GlassPanel>
  );
}
