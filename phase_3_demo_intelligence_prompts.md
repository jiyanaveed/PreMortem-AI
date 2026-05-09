# Phase 3 — Demo Intelligence Layer Cursor Prompts

## Purpose

Use these prompts sequentially in Cursor to upgrade the UI-only MVP from static mock pages into a connected, scenario-aware demo intelligence flow.

**Important:** Phase 3 is still UI/mock-data only. Do not add Gemini, backend, auth, database, scraping, or real IBM document fetching.

---

# Prompt 1 — Upgrade Mock Data Types + IBM Sample Docs

```md
You are working in the existing React + Vite + TypeScript + Tailwind app for Meowvate PreMortem AI.

Read the current files first, especially:
- src/types/analysis.ts
- src/data/sampleDocs.ts
- src/data/scenarios.ts
- src/data/mockAnalysis.ts
- src/pages/ScenarioSimulator.tsx
- src/pages/FailureMap.tsx
- src/pages/FixPlan.tsx

Task:
Upgrade the mock data foundation so the demo inputs feel credible and enterprise-ready.

Constraints:
- UI/mock-data only.
- Do NOT add backend.
- Do NOT add Gemini/API calls.
- Do NOT add auth/database/scraping.
- Do NOT fetch IBM pages live.
- Do NOT copy long IBM text.
- Keep existing routes and visual layout intact.
- Preserve the FelineSignalEngine behavior.

What to do:
1. Strengthen TypeScript types in src/types/analysis.ts if needed.
2. Upgrade src/data/sampleDocs.ts with richer IBM-inspired public-document sample metadata.
3. Keep content simulated and short. Use realistic excerpts but do not paste long real IBM policy text.
4. Each sample doc should include:
   - id
   - title
   - shortTitle
   - organization: IBM
   - sourceLabel
   - recommendedScenarioId
   - summary
   - simulatedExcerpt
   - signalThemes
   - demoReason

Required sample docs:
1. IBM Government Client Guidelines
   - Recommended scenario: audit-tomorrow
   - Themes: government client engagement, disclosure controls, evidence readiness, approval chains, conflict-of-interest risk

2. IBM Supply Chain Responsibility Requirements
   - Recommended scenario: critical-vendor-fails
   - Themes: supplier monitoring, corrective action, continuity assumptions, upstream dependency risk, breach notification

3. IBM Responsible AI / Granite Responsible Use Guide
   - Recommended scenario: ai-governance-failure
   - Themes: model oversight, responsible deployment, human review, AI decision logging, governance evidence

Also upgrade src/data/scenarios.ts if needed.

Required scenarios:
- audit-tomorrow
- critical-vendor-fails
- sensitive-data-exposure
- enterprise-client-escalates
- approval-workflow-breaks
- ai-governance-failure

Each scenario should include:
- id
- title
- subtitle
- crisisBrief
- boardQuestion
- primaryRiskAreas
- recommendedDocIds if useful

Quality bar:
The sample data should sound credible enough for a hackathon demo, but still clearly simulated/public-demo-safe.

After changes:
- Run npm run typecheck
- Fix errors
- Summarize changed files only
```

---

# Prompt 2 — Add Scenario-Specific Mock Analysis Outputs

```md
Continue in the existing Meowvate PreMortem AI app.

Task:
Replace the single generic mock analysis with scenario-specific mock analysis outputs.

Read first:
- src/data/mockAnalysis.ts
- src/data/sampleDocs.ts
- src/data/scenarios.ts
- src/types/analysis.ts
- src/pages/FailureMap.tsx
- src/pages/FixPlan.tsx
- src/components/risk/*
- src/components/resolution/*

Constraints:
- Mock data only.
- No backend.
- No Gemini/API calls.
- Do not change app layout heavily.
- Do not remove existing visual theme or FelineSignalEngine.
- Keep build/typecheck passing.

What to build:
In src/data/mockAnalysis.ts, create scenario-aware mock analysis data.

Implement either:
- a map like mockAnalysesByScenarioId
or
- a function getMockAnalysis({ documentId, scenarioId })

Preferred:
Create a typed helper:

getMockAnalysis(documentId: string | null, scenarioId: string | null): PremortemAnalysis

It should return a strong default if no selection exists.

Required scenario outputs:

1. Audit Tomorrow
Focus:
- evidence gaps
- approval matrix missing
- control-to-evidence mapping weak
- unclear owner for regulator response
- 14-day delay exposure

2. Critical Vendor Fails
Focus:
- tier-2 supplier blind spots
- no backup vendor trigger
- continuity runbook stale
- breach notification chain unclear
- revenue continuity risk

3. Sensitive Data Exposure
Focus:
- sensitive data shared through weak process
- unclear escalation owner
- access review evidence missing
- incident communication risk
- compliance exposure

4. Enterprise Client Escalates
Focus:
- SLA ownership gaps
- no client-facing resolution timeline
- fragmented communication record
- escalation playbook informal
- trust/transparency risk

5. Approval Workflow Breaks
Focus:
- single-threaded executive approval
- no fallback approver
- unclear delegation limits
- decision logs incomplete
- operational bottleneck

6. AI Governance Failure
Focus:
- AI decision logs incomplete
- human review path weak
- model monitoring evidence missing
- responsible-use attestation absent
- auditability risk

Each analysis should include:
- simulationTitle
- documentTitle
- scenarioTitle
- riskScore
- riskLevel
- executiveSummary
- wowSummary
- failurePoints
- criticalBlockers
- impactAreas
- fixPlan
- evidenceChecklist
- auditTrail
- recommendation
- confidence

Make outputs feel board-ready, specific, and realistic.

Important:
Use consistent field names with the existing components. If components need minor updates to consume richer data, do that carefully.

After changes:
- Run npm run typecheck
- Run npm run build
- Fix errors
- Summarize changed files only
```

---

# Prompt 3 — Connect Selected Document + Scenario Across Pages

```md
Continue in the existing Meowvate PreMortem AI app.

Task:
Connect the selected IBM document and selected crisis scenario across the full UI flow.

Current desired behavior:
- User selects an IBM sample document on /
- User selects a scenario on /
- FelineSignalEngine state updates as it already does
- User clicks Run PreMortem Simulation
- App navigates to /failure-map
- Failure Map displays the correct scenario-specific mock analysis
- Fix Plan displays the same selected context and analysis

Constraints:
- UI/mock-data only.
- No backend.
- No Gemini/API calls.
- No database.
- Do not add heavy state management libraries.
- Do not rewrite the full app.
- Keep current visual design intact.

Implementation preference:
Use a lightweight React Context or simple top-level state in App.tsx.

Create if needed:
- src/context/DemoContext.tsx

State should include:
- selectedDocumentId
- selectedScenarioId
- engineState
- analysisReady
- setSelectedDocumentId
- setSelectedScenarioId
- runSimulation
- resetDemo optional

State transitions:
- initial: engineState = idle
- document selected: documentLoaded
- scenario selected: scenarioSelected
- run clicked: analyzing
- after ~1.5s: analysisReady = true, engineState = failureDetected, navigate to /failure-map
- opening /fix-plan should show resolved engine state locally or via page prop without breaking failure page

FailureMap:
- Use getMockAnalysis(selectedDocumentId, selectedScenarioId)
- Display selected document title and scenario title somewhere visible but elegant
- Keep wow strip prominent

FixPlan:
- Use the same getMockAnalysis(selectedDocumentId, selectedScenarioId)
- Display same simulation title/context
- Keep approve/edit/reject local-only state

ScenarioSimulator:
- Selection should visually show active document and active scenario
- Run button should be disabled until at least a document and scenario are selected
- Button label can show “Run PreMortem Simulation”

Demo safety:
If user opens /failure-map directly with no selected context, show default Audit Tomorrow + IBM Government Audit Simulation mock result.

After changes:
- Run npm run typecheck
- Run npm run build
- Fix errors
- Summarize changed files only
```

---

# Prompt 4 — Add Exportable Executive Brief

```md
Continue in the existing Meowvate PreMortem AI app.

Task:
Add a mock export feature for an executive brief.

This should be a UI-only/local browser download. No backend.

Constraints:
- Do NOT add backend.
- Do NOT add PDF generation dependency.
- Do NOT add database/API/auth.
- Do NOT change the main layout heavily.
- Do NOT break build/typecheck.

Feature:
Add a button labeled:
Generate Executive Brief

Best placement:
- On Failure Map near the wow summary or risk score
- Also optionally on Fix Plan near the recommendation card

Behavior:
When clicked, generate and download a Markdown `.md` file or plain `.txt` file using the current mock analysis.

Filename example:
premortem-executive-brief-audit-tomorrow.md

Brief content should include:
- Product: PreMortem AI by Meowvate
- Simulation title
- Source document title
- Scenario title
- Risk score and risk level
- Wow summary
- Executive summary
- Critical blockers
- Top failure signals
- Recommended fix plan
- Evidence checklist
- Audit memory timeline
- Disclaimer: Demo intelligence output generated from simulated public-document excerpts.

Implementation preference:
Create a utility file:
- src/utils/exportBrief.ts

Function:
exportExecutiveBrief(analysis: PremortemAnalysis): void

Use browser Blob + URL.createObjectURL.

UI behavior:
- Button should feel premium and match current theme.
- Add a small success state if simple, such as changing label to “Brief Generated” for 1.5 seconds.
- Do not overbuild.

After changes:
- Run npm run typecheck
- Run npm run build
- Test clicking the button locally if possible
- Summarize changed files only
```

---

# Prompt 5 — Phase 3 QA, Polish, and Demo-Safe Labels

```md
Continue in the existing Meowvate PreMortem AI app.

Task:
Do a final Phase 3 QA/polish pass for the mock demo intelligence flow.

Constraints:
- No backend.
- No Gemini/API calls.
- No auth/database/scraping.
- No major redesign.
- Do not undo the current theme.
- Do not remove FelineSignalEngine.
- Do not change routes.

QA goals:
1. The flow should feel connected:
   Select doc → select scenario → run → Failure Map → Fix Plan.

2. Text should reflect selected scenario:
   Failure Map and Fix Plan should not look static/generic.

3. Add subtle demo-safe labeling:
   Use wording like:
   - Demo Intelligence Mode
   - Mock enterprise pre-mortem output
   - Simulated public-document excerpt

   Keep this subtle. Do not make the app feel fake or weak.

4. Improve empty/disabled states:
   - Run button disabled until document + scenario are selected
   - Helpful microcopy when no selection exists

5. Improve active states:
   - Selected document card is clearly selected
   - Selected scenario card is clearly selected

6. Improve readability:
   - Ensure warm theme still has high contrast
   - Tables/cards readable on desktop
   - No text clipped awkwardly

7. Responsiveness:
   - Basic mobile/tablet stacking should not break
   - Sidebar/mobile nav should remain usable

8. Clean code:
   - Remove unused imports
   - Avoid duplicated mapping logic where simple helpers are better
   - Keep TypeScript clean

9. Build verification:
   Run:
   npm run typecheck
   npm run build

10. Final response:
   Summarize:
   - What changed
   - Files changed
   - Local run command
   - Whether build/typecheck passed

Do not add new features beyond the Phase 3 mock intelligence/demo-safe polish.
```

---

# Short Cursor Execution Prompt

Paste this into Cursor after saving this file in the project root:

```md
Read `phase_3_demo_intelligence_prompts.md` fully.

Execute all five Phase 3 prompts in order:
1. Upgrade mock data types + IBM sample docs
2. Add scenario-specific mock analysis outputs
3. Connect selected document + scenario across pages
4. Add exportable executive brief
5. QA/polish/demo-safe labels

Important constraints:
- UI/mock-data only
- No backend
- No Gemini/API calls
- No auth/database/scraping
- Preserve the existing routes, layout, theme, and FelineSignalEngine
- Keep code strongly typed and clean
- Run npm run typecheck and npm run build after implementation
- Fix any errors before final summary

After completion, summarize changed files, what changed, local run command, and build/typecheck status.
```
