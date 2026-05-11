import { memo } from "react";
import type { AuditEvent } from "../../types/analysis";
import { GlassPanel } from "../ui/GlassPanel";
import { SectionLabel } from "../ui/SectionLabel";

type AuditMemoryTimelineProps = {
  events: AuditEvent[];
};

export const AuditMemoryTimeline = memo(function AuditMemoryTimeline({
  events,
}: AuditMemoryTimelineProps) {
  return (
    <GlassPanel className="p-4 md:p-5">
      <SectionLabel>Audit memory</SectionLabel>
      <div className="mt-2 font-display text-lg font-semibold text-softWhite">
        Decision timeline
      </div>
      <ol className="relative mt-6 space-y-6 border-l border-white/10 pl-6">
        {events.map((ev, idx) => (
          <li key={ev.id} className="relative">
            <span className="absolute -left-[29px] top-1 flex h-3 w-3 items-center justify-center rounded-full border border-softLavender bg-deepPlum shadow-[0_0_14px_rgba(244,114,208,0.45)]" />
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-mutedGrey">
              {ev.timestamp}
            </div>
            <div className="mt-1 text-sm text-softWhite">{ev.label}</div>
            {idx === events.length - 1 && (
              <div className="mt-2 inline-flex rounded-full border border-fluxViolet/40 bg-fluxViolet/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-fluxViolet">
                Latest memory anchor
              </div>
            )}
          </li>
        ))}
      </ol>
    </GlassPanel>
  );
});
