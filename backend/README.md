# PreMortem AI by Meowvate — Backend

FastAPI service for **Live Gemini** analysis. Demo intelligence and browser-side fallback remain in the React app.

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

- **Health:** `GET /api/health`  
- **Analyze:** `POST /api/analyze` — body matches `AnalyzeRequest` (see `app/models/premortem.py`)

## Environment

Copy **`backend/.env.example`** to **`backend/.env`**.

| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | Optional. If unset, `/api/analyze` returns deterministic fallback with `analysisSource: "backend_fallback"`. |
| `GEMINI_MODEL` | Defaults to `gemini-1.5-flash` in code; set to e.g. `gemini-2.5-flash` in `.env` for current Gemini Flash. |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins (default includes `http://localhost:5173`). |
| `MIN_DOCUMENT_CHARS` | Minimum meaningful characters for `documentText` (default `80`). |
| `NODE_ENV` / `APP_ENV` | When set to `development`, `dev`, `local`, or `debug`, enables extra **dev-only** logs (e.g. schema validation paths, quality-retry success, guardrail signal rejections). Never logs the API key. |

## Responses

Every successful JSON body includes:

- `analysisSource`: `"gemini"` — model output passed schema + quality checks  
- `analysisSource`: `"backend_fallback"` — deterministic fallback (missing key, bad JSON, Pydantic errors, guardrail rejection, or post-retry guardrail failure)  
- `fallbackReason` — optional human-readable string (sanitized; no raw model dump)

Short `documentText` returns **400** with a clear `detail` message.

## Quality pipeline

1. **JSON extraction** — tolerates minor formatting issues; invalid JSON → fallback.  
2. **Pydantic** — strict `PremortemAnalysisResponse` validation; on failure, sanitized error summary in `fallbackReason`.  
3. **Quality guardrails** — grounded `signal` / `impact`, minimum failure points and fix-plan rows, executive summary and `wowSummary` checks, etc.  
4. **One quality retry** — same document/scenario/depth; repair instruction appended; slightly lower temperature. If the retry also fails, `fallbackReason` begins with `Gemini output rejected after retry:`.  
5. **Deterministic fallback** — same shape as live responses; scenario-aware content from `demo_fallback_service`.

## Example request

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

Optional field: `"analysisDepth": "standard"` (default) or `"strict"` (UI: **Sharper**).

## Golden QA inputs

Synthetic excerpts under `test_inputs/`:

- `test_inputs/government_audit_readiness_sample.md`  
- `test_inputs/supplier_failure_sample.md`  
- `test_inputs/ai_governance_deployment_sample.md`  

```bash
python3 scripts/run_golden_analysis.py test_inputs/government_audit_readiness_sample.md
python3 scripts/run_golden_analysis.py test_inputs/ai_governance_deployment_sample.md --depth strict
```

## Checks

```bash
cd backend && python3 -m compileall -q app && python3 -c "from app.main import app; print('ok')"
```
