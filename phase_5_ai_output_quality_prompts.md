# Phase 5 — AI Output Quality + Prompt Tuning Prompts

## Purpose

Phase 5 improves the intelligence quality of Meowvate PreMortem AI without adding unnecessary features.

The goal is to make Live Gemini output feel board-ready, grounded, specific, operationally useful, and demo-safe.

Do not redesign the UI. Do not remove demo mode. Do not add auth, database, scraping, RAG, or unrelated features.

---

## Phase 5 Rules

- Keep the existing FastAPI + Gemini + Pydantic architecture.
- Keep Demo Intelligence mode fully working.
- Keep frontend fallback and backend fallback behavior intact.
- Improve output quality through prompts, validation, scoring rules, and test fixtures.
- Avoid giant files and code blobs.
- Use small, focused modules/functions.
- Keep TypeScript and Python types strict.
- Run checks after each major step.

---

# Prompt 1 — Strengthen the Gemini Premortem Prompt

```md
Read the existing Phase 4 implementation and improve the Gemini prompt quality only.

Focus files likely include:
- backend/app/prompts/premortem_prompt.py
- backend/app/services/gemini_service.py
- backend/app/models/premortem.py

Goal:
Make Gemini behave like a senior enterprise operational risk analyst running a pre-mortem, not a generic summarizer.

Do not change frontend UI.
Do not add new backend endpoints.
Do not remove demo/backend fallback.
Do not weaken Pydantic validation.

Update the prompt so the model must:
1. Simulate failure under the selected scenario.
2. Extract concrete failure points from the provided document text.
3. Ground every failure point in document evidence.
4. Avoid vague generic risks.
5. Produce board-level executive language.
6. Include operational ownership, evidence gaps, audit readiness, delay exposure, and business impact.
7. Explain why each issue matters.
8. Generate a fix plan with actionable next steps.
9. Avoid inventing facts not supported by the provided document.
10. Return strict JSON only, matching the current Pydantic response model.

Add a clear risk scoring rubric inside the prompt:
- 0–30 Low: mostly mature controls, few gaps
- 31–60 Medium: some gaps but limited immediate exposure
- 61–80 High: meaningful operational/compliance exposure
- 81–100 Critical: likely failure under selected scenario unless action is taken

Add a severity rubric:
- Critical: could block audit, approval, delivery, security response, or executive decision
- High: likely delay/escalation/compliance gap
- Medium: process weakness requiring correction
- Low: improvement opportunity

Prompt requirements:
- Use the selected scenario title and crisis brief.
- Use document title/source context.
- If document evidence is thin, say so in the analysis rather than fabricating.
- Evidence snippets should be short and paraphrased if needed.
- Failure point titles should be specific and punchy.
- Fix plan actions should start with verbs.
- Output should be enterprise-ready and presentation-friendly.

Quality bar:
The output should feel like it could be shown to an operations leader, compliance lead, or executive sponsor.

After changes:
- Run backend syntax/import checks.
- If there are prompt tests or service tests, run them.
- Summarize changed files and the specific prompt improvements.
```

---

# Prompt 2 — Add AI Output Quality Guardrails

```md
Add backend-side quality guardrails for Live Gemini responses.

Goal:
If Gemini returns weak, vague, under-grounded, or malformed content that still technically passes schema validation, the backend should reject it and use backend_fallback with a clear fallbackReason.

Do not change UI layout.
Do not remove existing fallback metadata.
Do not add unrelated features.

Create or update a small quality validation module, for example:
- backend/app/services/quality_guardrail_service.py

The guardrail should validate a PremortemAnalysisResponse after Pydantic validation but before returning it as a successful Gemini result.

Minimum checks:
1. riskScore is between 0 and 100.
2. wowSummary failure point count aligns reasonably with failurePoints length.
3. There are at least 5 failure points.
4. There are at least 3 fix plan actions.
5. Each failure point has:
   - non-empty title
   - severity
   - area
   - evidenceFromDocument or equivalent evidence field
   - whyItMatters / business impact field
   - likely failure scenario / signal field
6. Reject failure points with vague evidence such as:
   - "not specified"
   - "N/A"
   - "no evidence"
   - "generic risk"
   unless the title explicitly says the risk is missing evidence and the explanation is specific.
7. Executive summary must be at least 2 meaningful sentences.
8. Fix plan actions must be action-oriented and not generic phrases like "review policy" only.
9. Confidence must be within the current expected range.

When quality fails:
- Raise a clean custom exception or ValueError with a short reason.
- analysis_service should catch it and return backend_fallback.
- fallbackReason should be specific, e.g. "Gemini output rejected: insufficient grounded failure points."

Code quality:
- Keep guardrail logic small and readable.
- Avoid giant regex-heavy code.
- Add helper functions where useful.
- Preserve current response shape and metadata.

After changes:
- Run python compile/import checks.
- Run a smoke path without API key and confirm backend_fallback still works.
- Run npm typecheck/build if frontend types were touched.
- Summarize changed files and guardrails added.
```

---

# Prompt 3 — Add Golden Test Inputs for Live AI QA

```md
Add three golden test inputs for manual Live Gemini QA and backend prompt testing.

Goal:
Create realistic, short enterprise document samples that can be pasted into the app or used by backend smoke scripts to evaluate output quality.

Do not scrape external websites.
Do not copy long IBM text.
Do not add database or RAG.
Do not change core UI layout.

Add a folder such as:
- backend/test_inputs/

Create three markdown or txt files:
1. government_audit_readiness_sample.md
2. supplier_failure_sample.md
3. ai_governance_deployment_sample.md

Each test input should be 500–900 words and intentionally contain realistic operational gaps.

Sample 1: Government audit readiness
Should include:
- decision approvals
- government-client handling
- disclosure rules
- evidence retention
- ambiguous escalation owner
- missing backup approver
- manual spreadsheet tracking
- audit tomorrow scenario relevance

Sample 2: Supplier failure
Should include:
- critical vendor dependency
- SLA references
- no backup vendor
- manual performance monitoring
- escalation timeline gaps
- continuity risk
- evidence needed for procurement review

Sample 3: AI governance deployment
Should include:
- model approval workflow
- responsible AI review
- privacy/data risk
- monitoring and incident response
- unclear human override process
- missing post-deployment audit cadence

Also add a lightweight backend script if appropriate, for example:
- backend/scripts/run_golden_analysis.py

The script should:
- load one test input
- call the existing analysis service or endpoint-compatible function
- print analysisSource, riskScore, wowSummary, top failure points, and fallbackReason if any
- not require frontend
- work without API key by showing backend_fallback behavior

Do not overbuild testing infrastructure.
This is for manual QA and hackathon confidence.

Update README/backend README with how to use the golden inputs.

After changes:
- Run python compile/import checks.
- Confirm golden input files exist and are readable.
- Summarize changed files and usage commands.
```

---

# Prompt 4 — Add Optional “Sharper Analysis” Regeneration Path

```md
Add a controlled optional path for stricter analysis quality without changing the main demo flow.

Goal:
Allow Live Gemini mode to request a stricter, more critical analysis when needed, while keeping Demo mode and fallback behavior safe.

Do not redesign the app.
Do not add a new route.
Do not create a complex multi-agent system.
Do not remove existing run behavior.

Backend:
Extend the existing analyze request model with an optional field:
analysisDepth?: "standard" | "strict"

Default should be "standard".

When analysisDepth is "strict":
- Prompt should be more skeptical.
- It should look harder for hidden operational failure points.
- It should penalize missing ownership, vague evidence, manual handoffs, and unclear escalation paths.
- It should still not fabricate unsupported facts.
- It should return the same response schema.

Frontend:
Add a small, premium, non-intrusive control in the Scenario Simulator near the run button:
- label: Analysis depth
- options: Standard / Sharper

Behavior:
- Demo mode may keep using current mock data but should remember the selected depth visually.
- Live Gemini mode should send analysisDepth to backend.
- No need for a separate regenerate button unless it is already easy with existing state.

If adding the control risks UI mess, keep it compact and visually aligned with existing theme.

Quality:
- TypeScript request payload should include analysisDepth.
- Pydantic request model should include analysisDepth with validation.
- Existing API callers should continue working.
- Backend fallback should still include analysisSource metadata.

After changes:
- Run backend compile/import checks.
- Run npm typecheck/build.
- Summarize changed files and exact behavior.
```

---

# Prompt 5 — Final Phase 5 QA and Output Quality Pass

```md
Run a final Phase 5 QA pass focused on AI output quality, not new features.

Goals:
1. Confirm Demo Intelligence mode still works without backend.
2. Confirm Live Gemini mode sends the correct payload.
3. Confirm backend_fallback and frontend demo fallback labels still work.
4. Confirm analysisDepth standard/strict does not break existing behavior.
5. Confirm export brief works with both mock and live/backend fallback analysis.
6. Confirm Pydantic response model and TypeScript analysis types are aligned.
7. Confirm prompts demand grounded, board-level, scenario-specific output.
8. Confirm quality guardrails reject weak Gemini outputs and return backend_fallback.
9. Confirm golden test inputs are documented.

Do not add new features unless needed to fix a bug.
Do not redesign UI.
Do not weaken validation just to pass quickly.

Run checks:
Frontend:
- npm run typecheck
- npm run build

Backend:
- python3 -m compileall -q app
- python import smoke check for app.main
- if the golden script exists, run it once without API key and confirm backend_fallback works

Manual UI QA instructions to include in final summary:
- Start frontend only and verify Demo Intelligence.
- Start backend without GEMINI_API_KEY and verify Backend fallback used.
- Start backend with GEMINI_API_KEY and verify Live Gemini or clear fallback reason.
- Paste one golden test input and run Sharper analysis.

Final summary must include:
- Files changed
- Output-quality improvements
- Guardrails added
- Golden test input paths
- Run commands
- Any remaining limitations
```

---

## Expected Phase 5 Outcome

After Phase 5, the project should have:

- Better Gemini prompt quality.
- Clear risk/severity scoring rubric.
- Grounded failure-point requirements.
- Backend quality guardrails.
- Golden test inputs for live QA.
- Optional Standard / Sharper analysis depth.
- Full fallback safety preserved.
- Demo, backend fallback, and live Gemini modes all verified.

This phase is complete when Live Gemini output feels specific, executive-ready, and operationally useful — while still being safe if Gemini fails.
