import { sampleDocs } from "../data/sampleDocs";
import { getScenarioById } from "../data/scenarios";

/** Matches backend default `min_document_chars` (meaningful non-whitespace). */
export const MIN_LIVE_MEANINGFUL_CHARS = 80;

/** Matches backend `AnalysisDepth`. UI label “Sharper” maps to `"strict"`. */
export type AnalysisDepth = "standard" | "strict";

export type AnalyzeRequestPayload = {
  documentText: string;
  documentTitle?: string | null;
  documentId?: string | null;
  scenarioId: string;
  scenarioTitle?: string | null;
  scenarioDescription?: string | null;
  sourceType?: string | null;
  isPasteCapture: boolean;
  analysisDepth?: AnalysisDepth;
};

export type LivePayloadInput = {
  pastedDocumentText: string;
  selectedDocumentId: string | null;
  selectedScenarioId: string;
  analysisDepth: AnalysisDepth;
};

export function normalizeWhitespace(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function meaningfulCharCount(text: string): number {
  return normalizeWhitespace(text).replace(/\s+/g, "").length;
}

export function buildLiveAnalyzePayload(
  input: LivePayloadInput,
):
  | { ok: true; payload: AnalyzeRequestPayload }
  | { ok: false; error: string } {
  const scenario = getScenarioById(input.selectedScenarioId);
  if (!scenario) {
    return {
      ok: false,
      error: "Select a stress condition before running live analysis.",
    };
  }

  const pasteNorm = normalizeWhitespace(input.pastedDocumentText);
  const pasteMeaningful = meaningfulCharCount(pasteNorm);

  if (pasteMeaningful >= MIN_LIVE_MEANINGFUL_CHARS) {
    return {
      ok: true,
      payload: {
        documentText: pasteNorm,
        documentTitle: "Local operational excerpt",
        documentId: null,
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        scenarioDescription: scenario.crisisBrief,
        sourceType: "paste",
        isPasteCapture: true,
        analysisDepth: input.analysisDepth,
      },
    };
  }

  if (input.selectedDocumentId) {
    const doc = sampleDocs.find((d) => d.id === input.selectedDocumentId);
    if (!doc) {
      return { ok: false, error: "Selected sample document is unavailable." };
    }
    const combined = normalizeWhitespace(
      `${doc.summary}\n\n${doc.simulatedExcerpt}`,
    );
    if (meaningfulCharCount(combined) < MIN_LIVE_MEANINGFUL_CHARS) {
      return {
        ok: false,
        error: `Live analysis needs at least ${MIN_LIVE_MEANINGFUL_CHARS} meaningful characters in the document excerpt.`,
      };
    }
    return {
      ok: true,
      payload: {
        documentText: combined,
        documentTitle: doc.title,
        documentId: doc.id,
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        scenarioDescription: scenario.crisisBrief,
        sourceType: "ibm-sample",
        isPasteCapture: false,
        analysisDepth: input.analysisDepth,
      },
    };
  }

  return {
    ok: false,
    error: `Select an IBM sample document or paste at least ${MIN_LIVE_MEANINGFUL_CHARS} non-whitespace characters for live analysis.`,
  };
}
