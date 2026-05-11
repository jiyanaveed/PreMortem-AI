# PreMortem AI by Meowvate

**One-line pitch:** An AI-powered enterprise pre-mortem simulator that finds operational failure points before they become real incidents.

## Problem

Enterprise teams discover workflow failures too late — during audits, vendor outages, customer escalations, or governance reviews.

## Solution

PreMortem AI lets teams upload or select enterprise documents, choose a crisis scenario, and generate a **failure map**, **critical blockers**, **fix plan**, **evidence checklist**, **audit memory**, and **exportable executive brief** — so gaps surface before live incidents.

## Core features

- **Feline Signal Engine** — visual risk scanner for document → scenario → analysis flow  
- **Demo Intelligence mode** — full UI flow with mock analysis in the browser (no API key)  
- **Live Gemini mode** — local FastAPI backend + Google Gemini structured JSON  
- **Backend fallback mode** — deterministic analysis when the key is missing, JSON is invalid, schema validation fails, or **AI quality guardrails** reject the model output  
- **Scenario-specific failure mapping** — curated stress scenarios paired with IBM-style sample excerpts  
- **FastAPI + Gemini + Pydantic** — strict response contract aligned with the frontend  
- **Strict schema validation** — invalid model JSON never crashes the server; safe fallback  
- **AI quality guardrails** — rejects thin or ungrounded outputs that still parse as JSON  
- **One-pass quality retry** — a single stricter repair attempt before fallback  
- **Exportable executive brief** — Markdown download with source-aware disclaimer text  

## Tech stack

**Frontend:** React, Vite, TypeScript, Tailwind CSS  

**Backend:** FastAPI, Pydantic, Google Gemini API (via `google-generativeai`)  

**AI:** Gemini 2.5 Flash (configurable via `GEMINI_MODEL`), JSON MIME mode, quality guardrails, optional **Sharper** analysis depth (`analysisDepth: "strict"`)

## Local setup

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

On Windows, activate the venv with `.venv\Scripts\activate` instead of `source .venv/bin/activate`.

## Required environment variables

**Frontend** (repo root `.env` — copy from `.env.example`):

| Variable | Example |
|----------|---------|
| `VITE_API_BASE_URL` | `http://localhost:8000` |

**Backend** (`backend/.env` — copy from `backend/.env.example`):

| Variable | Example |
|----------|---------|
| `GEMINI_API_KEY` | your key from Google AI Studio (omit for deterministic fallback only) |
| `GEMINI_MODEL` | `gemini-2.5-flash` |
| `APP_ENV` | `dev` (optional — enables extra validation logging when set to `development`, `dev`, `local`, or `debug`; `NODE_ENV` works the same way) |

`ALLOWED_ORIGINS` defaults to local Vite URLs; override in `.env` if your dev origin differs.

## Demo flow (judges)

1. Open the app (`npm run dev`).  
2. Choose **Live Gemini** or **Demo intelligence** (Analysis source).  
3. Select **IBM Government Audit Simulation** (sample document).  
4. Select **Audit Tomorrow** (scenario).  
5. Click **Run PreMortem Simulation**.  
6. Review **Failure Map** (failure signals, blockers, impact topology).  
7. Open **Resolution Path** (fix plan, evidence, audit memory).  
8. **Export Executive Brief** (Markdown download).

For Live Gemini, ensure the backend is running and `VITE_API_BASE_URL` points at it; paste or select text that meets the minimum meaningful character count shown in the UI.

## Safety and fallback behavior

- If Gemini is **unavailable** (no key, network error, quota, or non-JSON response), the backend returns **HTTP 200** with `analysisSource: "backend_fallback"` and an explanatory `fallbackReason` when applicable.  
- If the model returns **JSON that fails Pydantic validation**, the server falls back the same way (with a short, sanitized validation summary in `fallbackReason`).  
- If output passes schema but **fails quality guardrails** (or fails again after **one** repair attempt), the response is still **safe deterministic fallback**, labeled in the UI as **Backend fallback used**.  
- If the **frontend** cannot reach the API or the payload is invalid, the app uses **demo mock analysis** and may show **Demo fallback used** plus a short error line.

You always get a usable narrative; labels distinguish **Live Gemini**, **backend fallback**, **demo fallback**, and **demo intelligence**.

## Hackathon positioning

- **Primary:** Track 4 — Data & Intelligence  
- **Secondary:** AI Agents, AI Governance  

## Disclaimer

This repository is a **hackathon prototype**. Outputs are **not** legal, audit, or compliance advice. Verify all recommendations against authoritative policies and your own risk program.

---

## Quality checks (developers)

```bash
npm run typecheck
npm run build
cd backend && python3 -m compileall -q app && python3 -c "from app.main import app; print('ok')"
```

## Quick API checks

```bash
curl -s http://localhost:8000/api/health
```

Example `POST /api/analyze` (minimal):

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

## Golden fixtures (backend)

| File | Scenario |
|------|----------|
| `backend/test_inputs/government_audit_readiness_sample.md` | Audit Tomorrow |
| `backend/test_inputs/supplier_failure_sample.md` | Critical Vendor Fails |
| `backend/test_inputs/ai_governance_deployment_sample.md` | AI Governance Failure |

```bash
cd backend
python3 scripts/run_golden_analysis.py test_inputs/government_audit_readiness_sample.md
python3 scripts/run_golden_analysis.py test_inputs/supplier_failure_sample.md --depth strict
```

Without `GEMINI_API_KEY`, golden runs still succeed using **backend_fallback**.

More API and guardrail detail: **`backend/README.md`**.
