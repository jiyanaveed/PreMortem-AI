import { useState } from "react";
import type { EvidenceItem } from "../../types/analysis";
import { GlassPanel } from "../ui/GlassPanel";
import { SectionLabel } from "../ui/SectionLabel";
import { ClipboardCheck } from "lucide-react";

type EvidenceChecklistProps = {
  items: EvidenceItem[];
};

export function EvidenceChecklist({ items }: EvidenceChecklistProps) {
  const [checked, setChecked] = useState(() =>
    Object.fromEntries(items.map((i) => [i.id, i.checked] as const)),
  );

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <GlassPanel className="p-4 md:p-5">
      <div className="flex items-center gap-2">
        <ClipboardCheck className="h-4 w-4 text-signalCyan" />
        <SectionLabel>Evidence readiness</SectionLabel>
      </div>
      <div className="mt-3 font-display text-lg font-semibold text-softWhite">
        Audit checklist
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="flex w-full items-start gap-3 rounded-xl border border-warmBorder bg-warmGlassSoft px-3 py-3 text-left backdrop-blur-sm transition hover:border-peachGlow/35"
            >
              <span
                className={[
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border font-mono text-[10px]",
                  checked[item.id]
                    ? "border-signalCyan bg-signalCyan/18 text-signalCyan"
                    : "border-white/20 text-transparent",
                ].join(" ")}
              >
                ✓
              </span>
              <div>
                <div className="text-sm text-softWhite">{item.label}</div>
                {item.required && (
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-wide text-solarOrange">
                    Required artifact
                  </div>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}
