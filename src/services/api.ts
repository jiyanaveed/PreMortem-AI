import type { PremortemAnalysis } from "../types/analysis";
import type { AnalyzeRequestPayload } from "../utils/documentText";

function assertPremortemShape(raw: unknown): asserts raw is PremortemAnalysis {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid analysis response: expected JSON object");
  }
  const o = raw as Record<string, unknown>;
  if (typeof o.simulationTitle !== "string") {
    throw new Error("Invalid analysis response: missing simulationTitle");
  }
  if (!Array.isArray(o.failurePoints) || !Array.isArray(o.fixPlan)) {
    throw new Error("Invalid analysis response: missing arrays");
  }
  if (o.analysisSource !== "gemini" && o.analysisSource !== "backend_fallback") {
    throw new Error("Invalid analysis response: analysisSource");
  }
}

async function errorMessageFromResponse(res: Response): Promise<string> {
  try {
    const body: unknown = await res.json();
    if (body && typeof body === "object" && "detail" in body) {
      const d = (body as { detail: unknown }).detail;
      if (typeof d === "string") return d;
      if (Array.isArray(d)) {
        return d
          .map((item) =>
            item &&
            typeof item === "object" &&
            "msg" in item &&
            typeof (item as { msg: unknown }).msg === "string"
              ? (item as { msg: string }).msg
              : JSON.stringify(item),
          )
          .join("; ");
      }
    }
  } catch {
    /* ignore parse errors */
  }
  return `Analysis failed (${res.status})`;
}

export async function analyzePremortem(
  payload: AnalyzeRequestPayload,
): Promise<PremortemAnalysis> {
  const base = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!base) {
    throw new Error(
      "VITE_API_BASE_URL is not set. Add it to .env for Live Gemini mode.",
    );
  }
  const url = `${base.replace(/\/$/, "")}/api/analyze`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(await errorMessageFromResponse(res));
  }
  const raw: unknown = await res.json();
  assertPremortemShape(raw);
  return raw;
}
