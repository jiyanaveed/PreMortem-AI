import type { PremortemAnalysis } from "../types/analysis";
import { scenarioSlugForFilename } from "../data/mockAnalysis";

const DISCLAIMER =
  "Disclaimer: Demo intelligence output generated from simulated public-document excerpts. Not legal, audit, or compliance advice.";

function lines(parts: string[]): string {
  return parts.join("\n");
}

export function exportExecutiveBrief(
  analysis: PremortemAnalysis,
  scenarioIdForFilename: string | null,
): void {
  const slug = scenarioSlugForFilename(scenarioIdForFilename);

  const blockerLines = analysis.criticalBlockers.map(
    (b) => `- **${b.title}** — ${b.detail}`,
  );
  const failureLines = analysis.failurePoints.map(
    (f) =>
      `- [${f.severity}] **${f.title}** (${f.area}) — ${f.signal} → Impact: ${f.impact}`,
  );
  const fixLines = analysis.fixPlan.map(
    (r) =>
      `- ${r.priority} | ${r.action} | Owner: ${r.owner} | Evidence: ${r.evidenceNeeded} | ${r.timeframe} | ${r.status}`,
  );
  const evidenceLines = analysis.evidenceChecklist.map(
    (e) =>
      `- [${e.required ? "required" : "optional"}] ${e.label}${e.checked ? " (checked in demo UI)" : ""}`,
  );
  const auditLines = analysis.auditTrail.map(
    (a) => `- ${a.timestamp} — ${a.label}`,
  );

  const body = lines([
    `# Executive Brief — PreMortem AI by Meowvate`,
    ``,
    `**Product:** PreMortem AI by Meowvate`,
    `**Simulation title:** ${analysis.simulationTitle}`,
    `**Source document (demo):** ${analysis.documentTitle}`,
    `**Scenario:** ${analysis.scenarioTitle}`,
    ``,
    `## Risk overview`,
    `- **Risk score:** ${analysis.riskScore} / 100`,
    `- **Risk level:** ${analysis.riskLevel}`,
    `- **Confidence (demo model):** ${analysis.confidence}%`,
    `- **Estimated delay exposure:** ${analysis.delayDays} days`,
    ``,
    `## Wow summary`,
    analysis.wowSummary,
    ``,
    `## Executive summary`,
    analysis.executiveSummary,
    ``,
    `## Critical blockers (${analysis.criticalBlockerCount})`,
    ...blockerLines,
    ``,
    `## Failure signals (${analysis.failureCount})`,
    ...failureLines,
    ``,
    `## Recommended resolution path`,
    analysis.recommendation,
    ``,
    `## Fix plan (prioritized)`,
    ...fixLines,
    ``,
    `## Evidence checklist`,
    ...evidenceLines,
    ``,
    `## Audit memory timeline`,
    ...auditLines,
    ``,
    `---`,
    DISCLAIMER,
    ``,
  ]);

  const filename = `premortem-executive-brief-${slug}.md`;

  const blob = new Blob([body], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
