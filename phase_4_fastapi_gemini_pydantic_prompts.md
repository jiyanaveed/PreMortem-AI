# Phase 4 — FastAPI + Gemini + Pydantic Integration Prompts

## Purpose

Phase 4 adds the real AI backend while protecting the polished UI demo already built in Phases 1–3.

The existing app must remain stable and demo-safe. The mock scenario-specific intelligence should stay available as fallback and demo mode. Real Gemini analysis should enhance the product, not replace the working demo.

## Locked Stack

| Layer | Decision |
|---|---|
| Frontend | Existing React + Vite + TypeScript + Tailwind app |
| Backend | FastAPI |
| AI | Gemini API |
| Schema validation | Pydantic |
| Demo safety | Existing mock analysis remains available |
| Initial storage | None |
| Auth | None |
| Database | None |
| Scraping | None |
| PDF parsing | Optional lightweight upload support only if safe; pasted/sample text is enough for first working version |

## Non-Negotiable Rules

- Do not weaken the existing UI.
- Do not rewrite the React app structure unnecessarily.
- Do not remove mock mode.
- Do not remove existing routes.
- Do not add auth, database, Supabase, scraping, RAG, or complex agents in Phase 4.
- Do not create one giant code blob.
- Keep backend modules small and purposeful.
- Use strong Pydantic models for request and response validation.
- Make Gemini return structured JSON only.
- If Gemini fails, frontend must gracefully fall back to mock analysis.
- Build and typecheck must pass.
- Backend should have clear error responses, not silent failures.

---

# Prompt 1 — Create FastAPI Backend Skeleton

```md
Create a clean FastAPI backend for this existing React/Vite app.

Read the current project first. Preserve the existing frontend and mock-data UI.

Goal:
Add a backend folder with a small, production-minded FastAPI structure that can later call Gemini for PreMortem analysis.

Do not integrate Gemini yet in this prompt.
Do not modify UI behavior yet except adding environment config if needed.
Do not add database/auth/scraping/RAG.

Create this backend structure:

backend/
  app/
    __init__.py
    main.py
    core/
      __init__.py
      config.py
    api/
      __init__.py
      routes/
        __init__.py
        health.py
        analyze.py
    models/
      __init__.py
      premortem.py
    services/
      __init__.py
      analysis_service.py
      demo_fallback_service.py
    utils/
      __init__.py
      text.py
  requirements.txt
  .env.example
  README.md

Backend requirements:
- FastAPI
- Uvicorn
- Pydantic / pydantic-settings if needed
- python-dotenv if needed
- google-generativeai or google-genai should be added later only if you are also wiring config safely in this skeleton
- CORS enabled for local Vite frontend
- Health route at GET /api/health
- Analyze route placeholder at POST /api/analyze

The POST /api/analyze route should accept the Pydantic request model and return a deterministic placeholder response that matches the response model.

Use strong Pydantic models in backend/app/models/premortem.py.

Request model should include:
- documentText: string
- documentTitle: string | optional
- documentId: string | optional
- scenarioId: string
- scenarioTitle: string | optional
- scenarioDescription: string | optional
- sourceType: string | optional
- isPasteCapture: boolean default false

Response model should align with the frontend PremortemAnalysis shape already used in src/types/analysis.ts.

Important:
Inspect src/types/analysis.ts and align names carefully. Do not invent mismatched keys.

Backend config:
- GEMINI_API_KEY optional for now
- GEMINI_MODEL default placeholder string
- ALLOWED_ORIGINS default includes http://localhost:5173

Add backend README with commands:
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

Add root or frontend environment example if useful:
VITE_API_BASE_URL=http://localhost:8000

Quality requirements:
- Keep files small.
- No giant route file.
- Use clear imports.
- Add basic docstrings only where useful.
- Run Python syntax check if possible.
- Do not break npm build/typecheck.

After implementation:
- Summarize created files.
- Provide backend run command.
- Confirm existing frontend still builds/typechecks if you run it.
```

---

# Prompt 2 — Add Gemini Service with Strict JSON Contract

```md
Now wire Gemini into the FastAPI backend using a clean service layer.

Do not change the UI yet.
Do not remove placeholder/fallback behavior.
Do not add database/auth/scraping/RAG.

Goal:
Create a Gemini analysis service that receives AnalyzeRequest and returns a validated PremortemAnalysis response using Pydantic.

Backend files to focus on:
- backend/app/core/config.py
- backend/app/services/analysis_service.py
- backend/app/services/demo_fallback_service.py
- backend/app/api/routes/analyze.py
- backend/app/models/premortem.py

Gemini requirements:
- Read GEMINI_API_KEY from environment.
- Use a model name from config, default to a current Gemini Flash model if no env value is set.
- If GEMINI_API_KEY is missing, return fallback analysis instead of crashing.
- If Gemini returns invalid JSON, return fallback analysis with a clear backend log message.
- If Gemini returns partial data, validate/normalize where safe; otherwise fallback.

Prompt quality:
The Gemini prompt must position the model as:
Enterprise risk simulation analyst + operational pre-mortem facilitator.

It must NOT simply summarize the document.
It must simulate failure under the selected crisis scenario.

Prompt must require:
- strict JSON only
- no markdown
- no commentary
- no code fences
- same keys as the Pydantic response model
- realistic enterprise language
- board-ready executive summary
- evidence-based failure points from the document text
- prioritization and actionability

The response should include:
- simulationTitle
- documentTitle
- scenarioTitle
- scenario
- riskScore
- riskLevel
- executiveSummary
- wowSummary
- failurePoints
- fixPlan
- auditTrail
- recommendation
- confidence

Failure point objects should include:
- id
- title
- severity
- area
- evidenceFromDocument
- whyItMatters
- likelyFailureScenario

Fix plan objects should include:
- id
- action
- ownerRole
- priority
- timeframe
- evidenceNeeded
- expectedImpact
- status if frontend expects it

Audit trail objects should include:
- timestamp
- event
- actor
- detail

Quality constraints:
- Keep document input bounded. Add a utility to trim extremely long document text to a safe length for Gemini.
- Preserve enough beginning/middle/end signal where possible instead of blindly taking only the first chunk.
- Add defensive parsing for Gemini JSON responses, including stripping accidental code fences if needed.
- Do not leak API keys.
- Do not log full documents.
- Keep fallback service deterministic and compatible with Pydantic models.

API behavior:
POST /api/analyze should:
1. Validate request.
2. If documentText is too short, return a 400 with a useful error message.
3. Try Gemini analysis if key exists.
4. Validate response with Pydantic.
5. Return validated JSON.
6. Fallback safely if Gemini/key/parsing fails.

After implementation:
- Run backend import/syntax checks if possible.
- Run npm build/typecheck to ensure frontend remains untouched and safe.
- Summarize changed files.
```

---

# Prompt 3 — Add Frontend API Client + Demo/Live Mode Switch

```md
Connect the existing React frontend to the FastAPI backend while preserving demo mode.

Do not redesign the UI.
Do not change the theme.
Do not remove mock analysis.
Do not make live AI the only path.

Goal:
Add a clean frontend API service and a simple mode switch:
- Demo Intelligence Mode: existing mock output
- Live Gemini Analysis: calls FastAPI /api/analyze

Files to inspect first:
- src/context/DemoContext.tsx
- src/data/mockAnalysis.ts
- src/types/analysis.ts
- src/pages/ScenarioSimulator.tsx
- src/pages/FailureMap.tsx
- src/pages/FixPlan.tsx
- src/components/layout/TopBar.tsx

Add:
- src/services/api.ts if not already present
- frontend env handling for VITE_API_BASE_URL
- a typed analyzePremortem function

API client requirements:
- POST to `${VITE_API_BASE_URL}/api/analyze`
- Send selected document text, document title/id, selected scenario id/title/description, source type, and paste-capture flag.
- Return typed PremortemAnalysis.
- Throw useful errors for non-2xx responses.
- Do not swallow errors silently.

Context behavior:
Update DemoContext carefully so it supports:
- mode: "demo" | "live"
- setMode
- isAnalyzing
- analysisError
- runSimulation should:
  - set engineState to analyzing
  - if mode is demo: use getMockAnalysis as now
  - if mode is live: call backend, validate shape lightly, and store returned analysis
  - if live fails: store analysisError and fall back to mock analysis so demo never breaks
  - navigate to /failure-map after analysis or fallback

UI controls:
Add a small polished toggle in the existing UI, preferably near the run section or TopBar:
- Demo Intelligence
- Live Gemini

It should be clear but not visually noisy.
Default should be Demo Intelligence unless configured otherwise.

When Live Gemini mode is selected:
- Show subtle text: “Uses local FastAPI backend + Gemini. Falls back to demo intelligence if unavailable.”

When running:
- Keep the existing FelineSignalEngine analyzing state.
- Disable the run button while analyzing.
- Show a short status line such as:
  “Simulating crisis conditions…”

Failure Map:
If live failed and fallback was used, show a subtle non-scary pill:
“Demo fallback used”
Do not make the app look broken.

Quality requirements:
- Keep code modular.
- Do not create a giant DemoContext file if it becomes too large; extract helpers if needed.
- Keep types aligned with src/types/analysis.ts.
- No unused imports.
- Build/typecheck must pass.

After implementation:
- Run npm run typecheck.
- Run npm run build.
- Summarize changed files and how to run frontend + backend locally.
```

---

# Prompt 4 — Add Document Text Handling + Quality Guardrails

```md
Improve input quality for live Gemini analysis without overbuilding PDF parsing yet.

Do not add complex upload infrastructure.
Do not add OCR.
Do not scrape IBM pages.
Do not add database/storage.

Goal:
Make document text sent to the backend meaningful and safe.

Frontend requirements:
- Ensure selected IBM sample docs provide enough simulatedExcerpt/content to send meaningful text to backend.
- If user pastes custom text, send pasted text as documentText.
- If pasted text exists and is substantial, it should take priority over sample doc excerpt.
- Add lightweight validation before running live mode:
  - If no sample doc and pasted text is too short, show a clear inline message.
  - Do not call backend with empty/meaningless input.

Backend requirements:
- Add text cleaning utility:
  - normalize whitespace
  - remove repeated blank lines
  - cap excessive length safely
  - preserve beginning/middle/end for long text
- Add request validation:
  - documentText must have enough meaningful characters
  - scenarioId must exist as a non-empty string
- Add safe metadata handling:
  - documentTitle fallback to “Untitled enterprise document”
  - scenarioTitle fallback based on scenarioId if not provided

Output quality guardrails:
Update Gemini prompt/service so outputs are:
- specific, not generic
- evidence-linked to the document
- scenario-aware
- board-readable
- action-oriented

Add instruction to Gemini:
If the document lacks evidence for a risk, frame it as a “missing control signal” rather than pretending the document says something it does not.

Do not let Gemini produce vague filler like:
- “Improve communication”
- “Monitor regularly”
- “Ensure compliance”
Unless paired with concrete owner, evidence, and timeframe.

Fallback behavior:
- Keep fallback reliable.
- Add a response metadata field only if it does not break frontend types; otherwise use existing error/fallback state in context.

Quality requirements:
- Keep changes targeted.
- No giant prompt blobs inside route files; prompts belong in service/helper module.
- Build/typecheck must pass.
- Backend syntax/import checks should pass.

After implementation:
- Summarize exact frontend/backend files changed.
- Include test payload example for POST /api/analyze using curl.
```

---

# Prompt 5 — End-to-End QA, Error States, and Run Documentation

```md
Do a Phase 4 QA and hardening pass for the FastAPI + Gemini integration.

Do not add new features.
Do not redesign UI.
Do not add auth/database/scraping/RAG.

Goal:
Make the app reliable for a hackathon demo with both Demo Intelligence and Live Gemini modes.

Check these flows:
1. App loads with backend off.
   - Demo mode works.
   - No scary errors.

2. User selects IBM sample doc + scenario in Demo mode.
   - Simulation runs.
   - Failure Map shows scenario-specific mock analysis.
   - Fix Plan shows same context.
   - Export brief works.

3. Backend running, no Gemini key.
   - Live mode should not crash.
   - Backend returns fallback or frontend falls back gracefully.
   - UI indicates demo fallback subtly.

4. Backend running with Gemini key.
   - Live mode calls /api/analyze.
   - Analysis renders on Failure Map.
   - Fix Plan uses same returned analysis.
   - Export brief uses live analysis.

5. User pastes custom text.
   - Live mode sends pasted text.
   - Short/empty text is blocked with helpful inline message.

Frontend hardening:
- Add clear but subtle error/fallback UI if analysisError exists.
- Keep “Demo Intelligence” as default safe mode.
- Prevent double-click/race condition on Run button.
- Ensure resetDemo clears live errors and returns to safe state.
- Ensure navigation to /failure-map without analysis still shows safe preview/fallback.

Backend hardening:
- Confirm CORS works with Vite dev server.
- Confirm /api/health returns useful JSON.
- Confirm /api/analyze validates input.
- Confirm invalid JSON from Gemini cannot crash the server.
- Confirm no full document/API key is logged.

Documentation:
Update or create a concise Phase 4 run section in README or backend/README.md with:

Frontend:
cd /Users/javerianaveed/meowvate
npm install
npm run dev

Backend:
cd /Users/javerianaveed/meowvate/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# add GEMINI_API_KEY if using live mode
uvicorn app.main:app --reload --port 8000

Environment:
Frontend .env:
VITE_API_BASE_URL=http://localhost:8000

Backend .env:
GEMINI_API_KEY=...
GEMINI_MODEL=...
ALLOWED_ORIGINS=http://localhost:5173

Final checks:
- npm run typecheck
- npm run build
- python backend import/syntax check

Final response should include:
- what was verified
- files changed
- how to run demo mode
- how to run live Gemini mode
- any known limitations
```

---

# Suggested Cursor Execution Prompt

Use this short prompt in Cursor after saving this file:

```md
Read `phase_4_fastapi_gemini_pydantic_prompts.md` fully.

Execute Phase 4 prompts in order, one prompt at a time:
1. FastAPI backend skeleton
2. Gemini service with strict Pydantic JSON contract
3. Frontend API client + Demo/Live mode switch
4. Document text handling + quality guardrails
5. End-to-end QA, error states, and run documentation

Do not compromise code quality.
Do not create giant code blobs.
Do not rewrite the existing UI.
Do not remove mock/demo mode.
Do not add auth, database, scraping, RAG, or unrelated features.

After each major step, run the relevant checks and fix errors before moving on.
At the end, run:
- npm run typecheck
- npm run build
- backend Python import/syntax check

Then summarize changed files, verified flows, and exact local run commands for demo mode and live Gemini mode.
```
