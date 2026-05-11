import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { getMockAnalysis } from "../data/mockAnalysis";
import { analyzePremortem } from "../services/api";
import type {
  FelineSignalEngineState,
  PremortemAnalysis,
} from "../types/analysis";
import {
  buildLiveAnalyzePayload,
  type AnalysisDepth,
} from "../utils/documentText";

export type DemoMode = "demo" | "live";

const MODE_STORAGE_KEY = "premortem_demo_mode";
const DEPTH_STORAGE_KEY = "premortem_analysis_depth";

function readStoredMode(): DemoMode {
  try {
    const v = sessionStorage.getItem(MODE_STORAGE_KEY);
    if (v === "live" || v === "demo") return v;
  } catch {
    /* ignore */
  }
  return "demo";
}

function readStoredAnalysisDepth(): AnalysisDepth {
  try {
    const v = sessionStorage.getItem(DEPTH_STORAGE_KEY);
    if (v === "strict" || v === "standard") return v;
  } catch {
    /* ignore */
  }
  return "standard";
}

export type DemoContextValue = {
  mode: DemoMode;
  setMode: (mode: DemoMode) => void;
  selectedDocumentId: string | null;
  selectedScenarioId: string | null;
  isPasteCapture: boolean;
  pastedDocumentText: string;
  setPastedDocumentText: (text: string) => void;
  engineState: FelineSignalEngineState;
  analysisReady: boolean;
  isAnalyzing: boolean;
  cachedAnalysis: PremortemAnalysis | null;
  analysisError: string | null;
  demoFallbackUsed: boolean;
  analysisDepth: AnalysisDepth;
  setAnalysisDepth: (depth: AnalysisDepth) => void;
  setSelectedDocumentId: (id: string | null) => void;
  setSelectedScenarioId: (id: string | null) => void;
  setPasteCapture: (active: boolean) => void;
  runSimulation: () => Promise<void>;
  resetDemo: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

/** Narrow subscription: stable `resetDemo` only — avoids re-rendering Sidebar on analysis updates. */
const DemoResetContext = createContext<(() => void) | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const runLockRef = useRef(false);

  const [mode, setModeState] = useState<DemoMode>(() => readStoredMode());
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null,
  );
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(
    null,
  );
  const [isPasteCapture, setPasteCapture] = useState(false);
  const [pastedDocumentText, setPastedDocumentText] = useState("");
  const [analysisReady, setAnalysisReady] = useState(false);
  const [cachedAnalysis, setCachedAnalysis] = useState<PremortemAnalysis | null>(
    null,
  );
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [demoFallbackUsed, setDemoFallbackUsed] = useState(false);
  const [engineOverride, setEngineOverride] = useState<
    FelineSignalEngineState | null
  >(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisDepth, setAnalysisDepthState] = useState<AnalysisDepth>(
    () => readStoredAnalysisDepth(),
  );

  const setAnalysisDepth = useCallback((depth: AnalysisDepth) => {
    setAnalysisDepthState(depth);
    try {
      sessionStorage.setItem(DEPTH_STORAGE_KEY, depth);
    } catch {
      /* ignore */
    }
  }, []);

  const setMode = useCallback((next: DemoMode) => {
    setModeState(next);
    try {
      sessionStorage.setItem(MODE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const engineState: FelineSignalEngineState = useMemo(() => {
    if (engineOverride !== null) return engineOverride;
    if (isAnalyzing) return "analyzing";
    const hasDoc = selectedDocumentId !== null || isPasteCapture;
    if (!hasDoc) return "idle";
    if (!selectedScenarioId) return "documentLoaded";
    return "scenarioSelected";
  }, [
    engineOverride,
    isAnalyzing,
    selectedDocumentId,
    selectedScenarioId,
    isPasteCapture,
  ]);

  const setSelectedDocumentIdWrapped = useCallback((id: string | null) => {
    setSelectedDocumentId(id);
    if (id !== null) setPasteCapture(false);
    setEngineOverride(null);
  }, []);

  const setPasteCaptureWrapped = useCallback((active: boolean) => {
    setPasteCapture(active);
    if (active) setSelectedDocumentId(null);
    setEngineOverride(null);
  }, []);

  const setSelectedScenarioIdWrapped = useCallback((id: string | null) => {
    setSelectedScenarioId(id);
    setEngineOverride(null);
  }, []);

  const runSimulation = useCallback(async () => {
    const hasDoc = selectedDocumentId !== null || isPasteCapture;
    if (!hasDoc || !selectedScenarioId || runLockRef.current) return;
    runLockRef.current = true;
    flushSync(() => {
      setIsAnalyzing(true);
      setAnalysisError(null);
      setDemoFallbackUsed(false);
      setEngineOverride(null);
    });

    const fallback = () =>
      getMockAnalysis(selectedDocumentId, selectedScenarioId, {
        isPasteCapture,
      });

    const finishSuccess = () => {
      setAnalysisReady(true);
      setEngineOverride("failureDetected");
      navigate("/failure-map");
    };

    try {
      if (mode === "demo") {
        await new Promise((r) => setTimeout(r, 1500));
        setCachedAnalysis(fallback());
        finishSuccess();
      } else {
        const built = buildLiveAnalyzePayload({
          pastedDocumentText,
          selectedDocumentId,
          selectedScenarioId,
          analysisDepth,
        });
        if (!built.ok) {
          setAnalysisError(built.error);
          return;
        }
        try {
          const result = await analyzePremortem(built.payload);
          setCachedAnalysis(result);
        } catch (e) {
          const msg =
            e instanceof Error ? e.message : "Live analysis failed";
          setAnalysisError(msg);
          setDemoFallbackUsed(true);
          setCachedAnalysis(fallback());
        }
        finishSuccess();
      }
    } finally {
      runLockRef.current = false;
      setIsAnalyzing(false);
    }
  }, [
    isPasteCapture,
    mode,
    navigate,
    pastedDocumentText,
    selectedDocumentId,
    selectedScenarioId,
    analysisDepth,
  ]);

  const resetDemo = useCallback(() => {
    setSelectedDocumentId(null);
    setSelectedScenarioId(null);
    setPasteCapture(false);
    setPastedDocumentText("");
    setAnalysisReady(false);
    setCachedAnalysis(null);
    setAnalysisError(null);
    setDemoFallbackUsed(false);
    setEngineOverride(null);
    setIsAnalyzing(false);
    runLockRef.current = false;
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (location.pathname === "/") {
      setEngineOverride(null);
    }
  }, [location.pathname]);

  const value = useMemo<DemoContextValue>(
    () => ({
      mode,
      setMode,
      selectedDocumentId,
      selectedScenarioId,
      isPasteCapture,
      pastedDocumentText,
      setPastedDocumentText,
      engineState,
      analysisReady,
      isAnalyzing,
      cachedAnalysis,
      analysisError,
      demoFallbackUsed,
      analysisDepth,
      setAnalysisDepth,
      setSelectedDocumentId: setSelectedDocumentIdWrapped,
      setSelectedScenarioId: setSelectedScenarioIdWrapped,
      setPasteCapture: setPasteCaptureWrapped,
      runSimulation,
      resetDemo,
    }),
    [
      analysisDepth,
      analysisError,
      analysisReady,
      cachedAnalysis,
      demoFallbackUsed,
      engineState,
      isAnalyzing,
      isPasteCapture,
      mode,
      pastedDocumentText,
      resetDemo,
      runSimulation,
      selectedDocumentId,
      selectedScenarioId,
      setAnalysisDepth,
      setMode,
      setPasteCaptureWrapped,
      setSelectedDocumentIdWrapped,
      setSelectedScenarioIdWrapped,
    ],
  );

  return (
    <DemoResetContext.Provider value={resetDemo}>
      <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
    </DemoResetContext.Provider>
  );
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) {
    throw new Error("useDemo must be used within DemoProvider");
  }
  return ctx;
}

export function useDemoReset(): () => void {
  const fn = useContext(DemoResetContext);
  if (!fn) {
    throw new Error("useDemoReset must be used within DemoProvider");
  }
  return fn;
}
