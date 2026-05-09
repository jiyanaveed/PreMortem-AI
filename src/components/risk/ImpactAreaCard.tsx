import type { ImpactArea } from "../../types/analysis";
import { GlassPanel } from "../ui/GlassPanel";

type ImpactAreaCardProps = {
  area: ImpactArea;
};

export function ImpactAreaCard({ area }: ImpactAreaCardProps) {
  return (
    <GlassPanel className="p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-mutedGrey">
        Impact topology
      </div>
      <div className="mt-2 font-display text-lg font-semibold text-softWhite">
        {area.label}
      </div>
      <div className="mt-2 text-sm text-mutedGrey">{area.exposure}</div>
      <div className="mt-4 rounded-lg border border-softLavender/25 bg-fluxPink/10 px-3 py-2 font-mono text-xs text-softLavender">
        {area.metric}
      </div>
    </GlassPanel>
  );
}
