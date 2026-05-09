import { useMemo } from "react";
import { useDemo } from "../context/DemoContext";
import { getMockAnalysis } from "../data/mockAnalysis";
import type { PremortemAnalysis } from "../types/analysis";
import {
  isBackendDeterministicAnalysis,
  isLiveGeminiAnalysis,
} from "../utils/analysisSourceLabel";

export function usePremortemDisplay(): {
  data: PremortemAnalysis;
  demoFallbackUsed: boolean;
  backendFallbackUsed: boolean;
  analysisError: string | null;
  mode: "demo" | "live";
  showLiveGeminiCopy: boolean;
  showBackendFallbackCopy: boolean;
} {
  const ctx = useDemo();

  const data = useMemo(
    () =>
      ctx.cachedAnalysis ??
      getMockAnalysis(ctx.selectedDocumentId, ctx.selectedScenarioId, {
        isPasteCapture: ctx.isPasteCapture,
      }),
    [
      ctx.cachedAnalysis,
      ctx.selectedDocumentId,
      ctx.selectedScenarioId,
      ctx.isPasteCapture,
    ],
  );

  const backendFallbackUsed =
    ctx.mode === "live" &&
    !ctx.demoFallbackUsed &&
    data.analysisSource === "backend_fallback";

  const showLiveGeminiCopy = isLiveGeminiAnalysis(data, ctx.demoFallbackUsed);
  const showBackendFallbackCopy = isBackendDeterministicAnalysis(
    data,
    ctx.demoFallbackUsed,
  );

  return {
    data,
    demoFallbackUsed: ctx.demoFallbackUsed,
    backendFallbackUsed,
    analysisError: ctx.analysisError,
    mode: ctx.mode,
    showLiveGeminiCopy,
    showBackendFallbackCopy,
  };
}
