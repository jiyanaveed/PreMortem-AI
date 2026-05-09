import type { DemoMode } from "../context/DemoContext";
import type { PremortemAnalysis } from "../types/analysis";

/** Single subtle badge line for header / context strip. */
export function analysisSourceBadgeLabel(
  mode: DemoMode,
  demoFallbackUsed: boolean,
  cachedAnalysis: PremortemAnalysis | null,
): string {
  if (mode === "demo") return "Demo intelligence";
  if (demoFallbackUsed) return "Demo fallback used";
  if (cachedAnalysis?.analysisSource === "backend_fallback") {
    return "Backend fallback used";
  }
  return "Live Gemini";
}

export function isBackendDeterministicAnalysis(
  data: PremortemAnalysis,
  demoFallbackUsed: boolean,
): boolean {
  return (
    !demoFallbackUsed && data.analysisSource === "backend_fallback"
  );
}

export function isLiveGeminiAnalysis(
  data: PremortemAnalysis,
  demoFallbackUsed: boolean,
): boolean {
  return !demoFallbackUsed && data.analysisSource === "gemini";
}
