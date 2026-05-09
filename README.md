# Meowvate PreMortem AI

React + Vite frontend with an optional FastAPI + Gemini backend for hackathon demos.

## Phase 4 — Run locally

### Demo intelligence (mock only)

No backend required. Uses in-browser mock analysis.

```bash
cd /Users/javerianaveed/meowvate
npm install
npm run dev
```

Open the app, keep **Analysis source** on **Demo intelligence**, pick an IBM sample card (or paste 40+ characters) and a scenario, then run.

### Live Gemini (FastAPI)

Terminal 1 — backend:

```bash
cd /Users/javerianaveed/meowvate/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Optional: add GEMINI_API_KEY for real Gemini output
uvicorn app.main:app --reload --port 8000
```

Terminal 2 — frontend:

```bash
cd /Users/javerianaveed/meowvate
cp .env.example .env
npm install
npm run dev
```

In `.env`, set `VITE_API_BASE_URL=http://localhost:8000`. In the UI, switch **Analysis source** to **Live Gemini**, select a scenario, choose a sample doc or paste **80+ meaningful (non-whitespace) characters**, then run.

If the API is unreachable or returns an error, the UI falls back to mock output and shows **Demo fallback used** plus a short error line.

### Quick API check

```bash
curl -s http://localhost:8000/api/health
```

Example analyze payload:

```bash
curl -s -X POST http://localhost:8000/api/analyze \
  -H 'Content-Type: application/json' \
  -d '{
    "documentText": "Standards require documented approval chains and named evidence owners before contract execution under audit pressure.",
    "documentTitle": "Sample governance excerpt",
    "scenarioId": "audit-tomorrow",
    "scenarioTitle": "Audit Tomorrow",
    "scenarioDescription": "Audit lands in less than 24 hours.",
    "sourceType": "curl-test",
    "isPasteCapture": false,
    "analysisDepth": "standard"
  }'
```

### Checks

```bash
npm run typecheck
npm run build
```

```bash
cd backend && python3 -m compileall -q app && python3 -c "from app.main import app"
```

Successful responses include `analysisSource`: `"gemini"` for model output, or `"backend_fallback"` when the server used its deterministic fallback (with optional `fallbackReason`). The UI surfaces **Live Gemini**, **Backend fallback used**, **Demo fallback used** (browser mock after fetch/shape errors), or **Demo intelligence** accordingly.

---

## Phase 5 — AI output quality & QA

### Summary

- **Prompt**: Senior operational pre-mortem analyst framing; explicit risk-score and severity rubrics; grounded `signal` / `impact`; board-ready tone. **Sharper** (`analysisDepth: "strict"`) adds skeptical hidden-seams hunting and uses slightly lower temperature.
- **Guardrails**: Valid Gemini JSON can still be rejected for thin grounding, short executive summary, weak fix-plan verbs, etc.; server returns deterministic fallback with `fallbackReason` starting `Gemini output rejected:`.
- **Golden fixtures**: under `backend/test_inputs/` (paste into Live or run script).
- **API**: optional `"analysisDepth": "standard"` | `"strict"` (default `standard`).

### Golden test input paths

| Path | Scenario pairing |
|------|------------------|
| `backend/test_inputs/government_audit_readiness_sample.md` | Audit Tomorrow |
| `backend/test_inputs/supplier_failure_sample.md` | Critical Vendor Fails |
| `backend/test_inputs/ai_governance_deployment_sample.md` | AI Governance Failure |

### Golden script

```bash
cd /Users/javerianaveed/meowvate/backend
python3 scripts/run_golden_analysis.py test_inputs/government_audit_readiness_sample.md
python3 scripts/run_golden_analysis.py test_inputs/supplier_failure_sample.md --depth strict
```

Without `GEMINI_API_KEY`, expect `backend_fallback` (not model output).

### Manual Phase 5 QA

1. Frontend only: Demo intelligence — run simulation, Failure Map, Fix Plan, export brief.
2. Backend without key: Live mode — **Backend fallback used** when HTTP 200 fallback OR demo fallback if API unreachable.
3. Backend with key: Live / Sharper — **Live Gemini** when guardrails pass; otherwise **Backend fallback used** with rejection reason.
4. Paste a golden file, pick matching scenario, choose Sharper, verify labels and export.

### Checks run for Phase 5

```bash
npm run typecheck && npm run build
cd backend && python3 -m compileall -q app && python3 -c "from app.main import app"
```

### Limitations

- Guardrails require **≥5** failure points and **≥3** fix-plan rows; `wowSummary` must contain the failure-count **digit** matching `failureCount`. Outputs that use only words for counts may fail.
- Sharper mode does not add multi-pass reasoning or new endpoints.
