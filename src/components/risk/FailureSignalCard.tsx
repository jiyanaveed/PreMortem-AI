import type { FailurePoint } from "../../types/analysis";
import { GlassPanel } from "../ui/GlassPanel";
import { SectionLabel } from "../ui/SectionLabel";

const severityTone: Record<
  FailurePoint["severity"],
  { bar: string; pill: string }
> = {
  Critical: {
    bar: "bg-sunsetCoral",
    pill: "text-sunsetCoral border-sunsetCoral/45",
  },
  High: {
    bar: "bg-fluxPink",
    pill: "text-fluxPink border-fluxPink/45",
  },
  Medium: {
    bar: "bg-magentaViolet",
    pill: "text-magentaViolet border-fluxPink/45",
  },
};

type FailureSignalCardProps = {
  point: FailurePoint;
};

export function FailureSignalCard({ point }: FailureSignalCardProps) {
  const tone = severityTone[point.severity];
  return (
    <GlassPanel className="p-4">
      <div className={`mb-3 h-1 w-12 rounded-full ${tone.bar}`} />
      <SectionLabel className="mb-1">{point.area}</SectionLabel>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-display text-lg font-semibold text-softWhite">
          {point.title}
        </h3>
        <span
          className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${tone.pill}`}
        >
          {point.severity}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-mutedGrey">{point.signal}</p>
      <div className="mt-4 rounded-lg border border-warmBorder bg-warmGlassSoft px-3 py-2 font-mono text-[11px] text-softWhite/95 backdrop-blur-sm">
        Impact — {point.impact}
      </div>
    </GlassPanel>
  );
}
