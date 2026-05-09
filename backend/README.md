# Meowvate PreMortem AI — Backend

FastAPI service for optional **Live Gemini** analysis. Demo intelligence remains in the React app.

## Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

- Health: `GET http://localhost:8000/api/health`
- Analyze: `POST http://localhost:8000/api/analyze`

## Environment

See `.env.example`. Frontend dev server URL must appear in `ALLOWED_ORIGINS`.

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

Responses always include `analysisSource`: `"gemini"` or `"backend_fallback"`, and optional `fallbackReason` when the server used its deterministic fallback.

Short text returns **400** with a clear `detail` message. Missing `GEMINI_API_KEY` returns deterministic fallback JSON with HTTP 200 and `analysisSource: "backend_fallback"`.

## Golden QA inputs

Synthetic enterprise excerpts live under `test_inputs/`:

- `test_inputs/government_audit_readiness_sample.md`
- `test_inputs/supplier_failure_sample.md`
- `test_inputs/ai_governance_deployment_sample.md`

Runner (no frontend):

```bash
python3 scripts/run_golden_analysis.py test_inputs/government_audit_readiness_sample.md
python3 scripts/run_golden_analysis.py test_inputs/ai_governance_deployment_sample.md --depth strict
```

Optional JSON field: `"analysisDepth": "standard"` (default) or `"strict"` (UI: Sharper).

After Gemini, **quality guardrails** may reject weak-but-valid JSON; response becomes deterministic fallback with `fallbackReason` like `Gemini output rejected: …`.
