import { useMemo, useState } from "react";
import type { FixPlanRow } from "../../types/analysis";
import { GlassPanel } from "../ui/GlassPanel";
import { SectionLabel } from "../ui/SectionLabel";
import { Check, Pencil, X } from "lucide-react";

function priorityClass(priority: FixPlanRow["priority"]) {
  if (priority === "P0") return "text-sunsetCoral";
  if (priority === "P1") return "text-solarOrange";
  return "text-magentaViolet";
}

type FixPlanTableProps = {
  rows: FixPlanRow[];
};

export function FixPlanTable({ rows }: FixPlanTableProps) {
  const [local, setLocal] = useState(() =>
    Object.fromEntries(rows.map((r) => [r.id, r.status] as const)),
  );

  const merged = useMemo(
    () =>
      rows.map((r) => ({
        ...r,
        status: local[r.id] ?? r.status,
      })),
    [rows, local],
  );

  function setStatus(id: string, status: FixPlanRow["status"]) {
    setLocal((prev) => ({ ...prev, [id]: status }));
  }

  return (
    <GlassPanel className="overflow-hidden">
      <div className="border-b border-warmBorder/40 px-4 py-3 md:px-6 md:py-4">
        <SectionLabel>Resolution path</SectionLabel>
        <div className="mt-1 font-display text-xl font-semibold text-softWhite">
          Prioritized action grid
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-aubergine/85 font-mono text-[10px] uppercase tracking-[0.2em] text-softLavender">
            <tr>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Evidence</th>
              <th className="px-4 py-3">Timeframe</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warmBorder/15">
            {merged.map((row) => (
              <tr key={row.id} className="bg-warmGlassSoft hover:bg-peachGlow/[0.06]">
                <td
                  className={`px-4 py-3 font-mono text-xs ${priorityClass(row.priority)}`}
                >
                  {row.priority}
                </td>
                <td className="max-w-xs px-4 py-3 text-softWhite">{row.action}</td>
                <td className="px-4 py-3 text-mutedGrey">{row.owner}</td>
                <td className="max-w-[220px] px-4 py-3 text-mutedGrey">
                  {row.evidenceNeeded}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-softWhite">
                  {row.timeframe}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={[
                      "rounded-full border px-2 py-1 font-mono text-[10px] uppercase tracking-wide",
                      row.status === "Approved"
                        ? "border-softLavender/45 text-softLavender"
                        : row.status === "Rejected"
                          ? "border-sunsetCoral/45 text-sunsetCoral"
                          : row.status === "Edited"
                            ? "border-fluxPink/45 text-fluxPink"
                            : "border-warmBorder text-mutedGrey",
                    ].join(" ")}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      title="Approve"
                      onClick={() => setStatus(row.id, "Approved")}
                      className="rounded-lg border border-warmBorder p-1.5 text-signalCyan transition hover:border-signalCyan/55 hover:bg-signalCyan/10"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Edit"
                      onClick={() => setStatus(row.id, "Edited")}
                      className="rounded-lg border border-warmBorder p-1.5 text-solarOrange transition hover:border-solarOrange/50 hover:bg-solarOrange/10"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Reject"
                      onClick={() => setStatus(row.id, "Rejected")}
                      className="rounded-lg border border-warmBorder p-1.5 text-sunsetCoral transition hover:border-sunsetCoral/50 hover:bg-sunsetCoral/10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassPanel>
  );
}
