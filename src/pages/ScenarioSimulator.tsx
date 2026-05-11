import { useCallback, useMemo, type ChangeEvent } from "react";
import { GlassPanel } from "../components/ui/GlassPanel";
import { SectionLabel } from "../components/ui/SectionLabel";
import { GlowButton } from "../components/ui/GlowButton";
import { FelineSignalEngine } from "../components/visual/FelineSignalEngine";
import { sampleDocs } from "../data/sampleDocs";
import { scenarios } from "../data/scenarios";
import { useDemo } from "../context/DemoContext";
import { MIN_LIVE_MEANINGFUL_CHARS } from "../utils/documentText";
import { Play, Sparkles } from "lucide-react";

export function ScenarioSimulator() {
  const {
    mode,
    setMode,
    selectedDocumentId,
    selectedScenarioId,
    isPasteCapture,
    pastedDocumentText,
    setPastedDocumentText,
    engineState,
    isAnalyzing,
    analysisError,
    analysisDepth,
    setAnalysisDepth,
    setSelectedDocumentId,
    setSelectedScenarioId,
    setPasteCapture,
    runSimulation,
  } = useDemo();

  const hasDocSignal = selectedDocumentId !== null || isPasteCapture;
  const canRun =
    hasDocSignal && selectedScenarioId !== null && engineState !== "analyzing";

  const selectedDoc = useMemo(
    () => sampleDocs.find((d) => d.id === selectedDocumentId),
    [selectedDocumentId],
  );

  const selectDoc = useCallback(
    (id: string) => {
      setSelectedDocumentId(id);
      setPastedDocumentText("");
      setPasteCapture(false);
    },
    [setSelectedDocumentId, setPastedDocumentText, setPasteCapture],
  );

  const onPasteChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const v = e.target.value;
      setPastedDocumentText(v);
      const trimmed = v.trim();
      if (trimmed.length >= 40) {
        setPasteCapture(true);
      } else {
        setPasteCapture(false);
      }
    },
    [setPastedDocumentText, setPasteCapture],
  );

  const selectedScenarioTitle = useMemo(() => {
    if (!selectedScenarioId) return "None";
    return scenarios.find((x) => x.id === selectedScenarioId)?.title ?? "—";
  }, [selectedScenarioId]);

  return (
    <div className="px-4 py-8 md:px-10 lg:px-14">
      <p className="mb-6 max-w-2xl text-xs leading-relaxed text-mutedGrey/90">
        <span className="font-mono uppercase tracking-[0.2em] text-softLavender/90">
          {mode === "demo" ? "Demo intelligence mode" : "Live Gemini mode"}
        </span>
        {" · "}
        {mode === "demo" ? (
          <>
            Mock enterprise pre-mortem output from simulated public-document
            excerpts. Stays in your browser.
          </>
        ) : (
          <>
            Uses local FastAPI backend + Gemini. Falls back to demo
            intelligence if unavailable.
          </>
        )}
      </p>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-start">
        <div className="space-y-8">
          <div>
            <SectionLabel>Stress condition studio</SectionLabel>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-softWhite md:text-5xl">
              FIND THE FAILURE
              <br />
              BEFORE IT FINDS YOU.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-mutedGrey">
              Upload an enterprise policy, SOP, or governance document.
              PreMortem AI simulates crisis conditions and reveals where your
              operation breaks.
            </p>
          </div>

          <GlassPanel glow="cyan" className="p-5">
            <SectionLabel>Optional signal ingest</SectionLabel>
            <div className="mt-2 font-display text-lg text-softWhite">
              Paste operational context
            </div>
            <textarea
              value={pastedDocumentText}
              onChange={onPasteChange}
              placeholder={
                mode === "demo"
                  ? "Paste an excerpt to simulate document capture (mock-only, stays local)."
                  : `Paste policy or ops text (${MIN_LIVE_MEANINGFUL_CHARS}+ meaningful characters) or rely on an IBM sample card below.`
              }
              className="mt-4 min-h-[120px] w-full resize-y rounded-xl border border-warmBorder bg-warmGlass px-4 py-3 text-sm text-softWhite outline-none ring-fluxPink/20 placeholder:text-mutedGrey focus:border-fluxPink/45 focus:ring-2"
            />
            <div className="mt-2 font-mono text-[10px] uppercase tracking-wide text-mutedGrey">
              {mode === "demo"
                ? "Local-only · not transmitted · simulated excerpt"
                : `Live sends trimmed text to /api/analyze · min ${MIN_LIVE_MEANINGFUL_CHARS} meaningful chars`}
            </div>
          </GlassPanel>

          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-fluxViolet" />
              <SectionLabel>Run a public enterprise pre-mortem</SectionLabel>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-1">
              {sampleDocs.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => selectDoc(doc.id)}
                  className={[
                    "rounded-2xl border px-4 py-4 text-left transition-all",
                    selectedDocumentId === doc.id
                      ? "border-sunsetCoral/50 bg-gradient-to-r from-fluxPink/14 via-sunsetCoral/12 to-magentaViolet/14 shadow-glowWarm ring-1 ring-warmBorder/40"
                      : "border-warmBorder bg-warmGlass hover:border-peachGlow/35",
                  ].join(" ")}
                >
                  <div className="font-display text-base font-semibold text-softWhite">
                    {doc.buttonLabel}
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-mutedGrey">
                    {doc.title}
                  </div>
                  <p className="mt-3 text-sm text-mutedGrey">{doc.summary}</p>
                  <p className="mt-2 border-l-2 border-warmBorder/60 pl-3 text-xs italic leading-relaxed text-softLavender/85">
                    {doc.simulatedExcerpt}
                  </p>
                  <p className="mt-2 text-[11px] text-mutedGrey/90">
                    <span className="text-peachGlow/90">Why this demo: </span>
                    {doc.demoReason}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Stress conditions</SectionLabel>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {scenarios.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedScenarioId(s.id)}
                  className={[
                    "rounded-2xl border px-4 py-4 text-left transition-all",
                    selectedScenarioId === s.id
                      ? "border-fluxPink/50 bg-fluxPink/12 shadow-glowMagenta ring-1 ring-warmBorder/35"
                      : "border-warmBorder bg-warmGlassSoft hover:border-peachGlow/30",
                  ].join(" ")}
                >
                  <div className="font-display text-base font-semibold text-softWhite">
                    {s.title}
                  </div>
                  <div className="mt-2 text-sm text-mutedGrey">{s.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[rgba(244,114,208,0.28)] bg-[rgba(55,16,70,0.55)] px-3 py-2 backdrop-blur-sm">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-pink-300">
              Analysis source
            </span>
            <div className="flex rounded-xl border border-[rgba(244,114,208,0.22)] bg-black/25 p-0.5 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setMode("demo")}
                className={[
                  "rounded-lg px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide transition-all duration-200",
                  mode === "demo"
                    ? "bg-gradient-to-r from-[#F472D0] to-[#B45CFF] text-[#FFF7ED] shadow-[0_0_12px_rgba(180,92,255,0.35)] ring-1 ring-pink-400/40"
                    : "text-purple-200 hover:bg-[rgba(244,114,208,0.14)] hover:text-pink-100",
                ].join(" ")}
              >
                Demo intelligence
              </button>
              <button
                type="button"
                onClick={() => setMode("live")}
                className={[
                  "rounded-lg px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide transition-all duration-200",
                  mode === "live"
                    ? "bg-gradient-to-r from-[#F472D0] to-[#B45CFF] text-[#FFF7ED] shadow-[0_0_12px_rgba(180,92,255,0.35)] ring-1 ring-pink-400/40"
                    : "text-purple-200 hover:bg-[rgba(244,114,208,0.14)] hover:text-pink-100",
                ].join(" ")}
              >
                Live Gemini
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[rgba(244,114,208,0.28)] bg-[rgba(55,16,70,0.55)] px-3 py-2 backdrop-blur-sm">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-pink-300">
              Analysis depth
            </span>
            <div className="flex rounded-xl border border-[rgba(244,114,208,0.22)] bg-black/25 p-0.5 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setAnalysisDepth("standard")}
                className={[
                  "rounded-lg px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide transition-all duration-200",
                  analysisDepth === "standard"
                    ? "bg-gradient-to-r from-[#F472D0] to-[#B45CFF] text-[#FFF7ED] shadow-[0_0_12px_rgba(180,92,255,0.35)] ring-1 ring-pink-400/40"
                    : "text-purple-200 hover:bg-[rgba(244,114,208,0.14)] hover:text-pink-100",
                ].join(" ")}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => setAnalysisDepth("strict")}
                className={[
                  "rounded-lg px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide transition-all duration-200",
                  analysisDepth === "strict"
                    ? "bg-gradient-to-r from-[#F472D0] to-[#B45CFF] text-[#FFF7ED] shadow-[0_0_12px_rgba(180,92,255,0.35)] ring-1 ring-pink-400/40"
                    : "text-purple-200 hover:bg-[rgba(244,114,208,0.14)] hover:text-pink-100",
                ].join(" ")}
              >
                Sharper
              </button>
            </div>
            {mode === "live" ? (
              <span className="max-w-md font-mono text-[10px] leading-snug text-purple-200/95">
                Sharper sends stricter pre-mortem instructions; output still must
                pass quality checks or fall back.
              </span>
            ) : (
              <span className="font-mono text-[10px] text-purple-200/90">
                Saved for Live Gemini runs.
              </span>
            )}
          </div>

          <div className="space-y-2">
            <GlowButton
              variant="primary"
              disabled={!canRun}
              onClick={() => void runSimulation()}
              className="w-full sm:w-auto"
            >
              <Play className="h-4 w-4" />
              Run PreMortem Simulation
            </GlowButton>
            {isAnalyzing && (
              <p className="max-w-lg text-xs leading-relaxed text-softLavender/90">
                Simulating crisis conditions…
              </p>
            )}
            {mode === "live" && analysisError && (
              <p className="max-w-lg text-xs leading-relaxed text-mutedGrey">
                {analysisError}
              </p>
            )}
            {!canRun && (
              <p className="max-w-lg text-xs leading-relaxed text-mutedGrey">
                {!hasDocSignal && (
                  <>
                    Select an IBM sample document{" "}
                    <span className="text-softLavender/90">
                      or paste a simulated excerpt (40+ characters)
                    </span>{" "}
                    to enable run.
                  </>
                )}
                {hasDocSignal && !selectedScenarioId && (
                  <>Choose a stress condition to arm the simulation.</>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-28">
          <GlassPanel glow="blue" className="flex flex-col items-center px-6 py-10">
            <FelineSignalEngine state={engineState} size="lg" showLabels />
            <div className="mt-8 w-full rounded-xl border border-warmBorder bg-warmGlass px-4 py-4 font-mono text-xs text-mutedGrey backdrop-blur-sm">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em]">
                <span>Signal chain</span>
                <span className="text-peachGlow">Live preview</span>
              </div>
              <div className="mt-3 space-y-2 text-[11px]">
                <div>
                  Document lock:{" "}
                  <span className="text-softWhite">
                    {isPasteCapture
                      ? "Paste capture (simulated)"
                      : selectedDoc
                        ? selectedDoc.shortTitle
                        : hasDocSignal
                          ? "Captured"
                          : "Awaiting"}
                  </span>
                </div>
                <div>
                  Stress condition:{" "}
                  <span className="text-softWhite">
                    {selectedScenarioTitle}
                  </span>
                </div>
                <div>
                  Simulation core:{" "}
                  <span className="text-softWhite">
                    {engineState === "analyzing"
                      ? "Encoding failure field…"
                      : "Ready"}
                  </span>
                </div>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
