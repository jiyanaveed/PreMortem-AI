import { memo } from "react";
import { GlassPanel } from "../ui/GlassPanel";

type WowSummaryStripProps = {
  failureSignals: number;
  criticalBlockers: number;
  delayDays: number;
  subtitle?: string;
};

export const WowSummaryStrip = memo(function WowSummaryStrip({
  failureSignals,
  criticalBlockers,
  delayDays,
  subtitle = "Failure points detected before impact",
}: WowSummaryStripProps) {
  return (
    <GlassPanel glow="cyan" className="px-4 py-5 md:px-8 md:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-mutedGrey">
            Executive signal
          </div>
          <div className="mt-2 font-display text-2xl font-semibold tracking-tight text-softWhite md:text-3xl">
            {failureSignals} FAILURE SIGNALS DETECTED
          </div>
          <div className="mt-1 font-display text-lg text-peachGlow md:text-xl">
            {criticalBlockers} CRITICAL BLOCKERS · {delayDays}-DAY DELAY EXPOSURE
          </div>
        </div>
        <div className="max-w-xl rounded-xl border border-warmBorder bg-warmGlass px-4 py-3 font-mono text-xs leading-relaxed text-mutedGrey backdrop-blur-sm">
          {subtitle}
        </div>
      </div>
    </GlassPanel>
  );
});
