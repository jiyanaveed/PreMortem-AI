# Cursor Execution Prompt — Phase 1 + Phase 2 UI MVP

Copy the full prompt below into Cursor Agent.

---

```md
You are working in a fresh project folder for a hackathon app called Meowvate PreMortem AI.

Before coding, read these files completely and use them as the source of truth:

- phase_1_product_shape_meowvate_premortem_ai.md
- phase_2_ui_plan_meowvate_premortem_ai.md
- ibm_public_docs_sample_spec.md

Goal:
Build the Phase 1 + Phase 2 UI-only MVP for PreMortem AI.

Important:
This is UI-only for now.
Do NOT build backend.
Do NOT add Gemini API.
Do NOT add auth.
Do NOT add database.
Do NOT scrape IBM pages.
Do NOT over-engineer.
Do NOT create weak placeholder UI.
Do NOT create generic SaaS dashboard styling.

Build a polished React + Vite + TypeScript + Tailwind app with mock data only.

Product:
PreMortem AI by Meowvate

Core concept:
An enterprise pre-mortem simulator that helps teams find operational failures before they happen.

Theme:
Sidewave-inspired cinematic enterprise flux.
Dark, premium, cinematic, abstract, technical.
The visual metaphor is:
chaos → signal → failure map → resolution path.

Main UI wow factor:
Create a signature component called FelineSignalEngine.
It must be an abstract tech cat face built using SVG/CSS, not an image.
It should feel like an AI simulation engine / risk radar, not a cute mascot.

The cat face should include:
- angular abstract cat ears
- glowing cyan eyes
- signal whiskers
- central nose/decision node
- radar rings
- subtle particles
- animated scanning/pulse effects
- amber/red risk nodes in failureDetected state

Avoid:
- cartoon cat
- childish mascot
- paws/tails
- emoji feel
- generic logo-only use

Required tech:
- React
- Vite
- TypeScript
- Tailwind CSS
- react-router-dom
- lucide-react
- framer-motion if useful
- clean reusable components
- strict typed mock data

Required screens:
1. Scenario Simulator
2. Failure Map
3. Fix Plan / Audit Trail

Routing:
- `/` → Scenario Simulator
- `/failure-map` → Failure Map
- `/fix-plan` → Fix Plan

Required app shell:
Create a premium layout with:
- left sidebar
- top bar
- main cinematic canvas
- dark abstract background
- subtle grid/noise/wave effect
- glowing accents
- responsive layout

Sidebar navigation labels:
- 01 / INPUT SIGNAL
- 02 / FAILURE MAP
- 03 / RESOLUTION PATH

Top bar:
Left:
PreMortem AI by Meowvate

Right:
FELINE SIGNAL ENGINE // ONLINE

Theme tokens:
Use Tailwind config and/or CSS variables for:

- void: #030406
- graphite: #0B0F14
- graphiteSoft: #111827
- signalBlue: #4D7CFE
- electricCyan: #39E7F5
- fluxViolet: #8B5CF6
- riskAmber: #FFB020
- criticalRed: #FF4D5E
- softWhite: #F4F7FB
- mutedGrey: #8A95A6

Fonts:
Use clean font stacks if external fonts are not set up.
Prefer:
- Space Grotesk style for headings
- Inter style for body
- JetBrains Mono style for metrics/logs

Create these components:

Layout:
- src/components/layout/AppShell.tsx
- src/components/layout/Sidebar.tsx
- src/components/layout/TopBar.tsx

UI:
- src/components/ui/GlassPanel.tsx
- src/components/ui/SectionLabel.tsx
- src/components/ui/GlowButton.tsx

Visual:
- src/components/visual/FelineSignalEngine.tsx

Risk:
- src/components/risk/RiskScoreOrb.tsx
- src/components/risk/FailureSignalCard.tsx
- src/components/risk/ImpactAreaCard.tsx
- src/components/risk/WowSummaryStrip.tsx

Resolution:
- src/components/resolution/FixPlanTable.tsx
- src/components/resolution/EvidenceChecklist.tsx
- src/components/resolution/AuditMemoryTimeline.tsx
- src/components/resolution/RecommendationCard.tsx

Data:
- src/data/sampleDocs.ts
- src/data/scenarios.ts
- src/data/mockAnalysis.ts

Types:
- src/types/analysis.ts

FelineSignalEngine props:

```ts
type FelineSignalEngineState =
  | "idle"
  | "documentLoaded"
  | "scenarioSelected"
  | "analyzing"
  | "failureDetected"
  | "resolved";

type FelineSignalEngineProps = {
  state?: FelineSignalEngineState;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
};
```

State behavior:
- idle: dim outline, slow breathing glow
- documentLoaded: eyes activate cyan
- scenarioSelected: whisker signal lines brighten
- analyzing: radar rings pulse and scan line moves
- failureDetected: amber/red risk nodes appear around face
- resolved: stable cyan/blue glow

Scenario Simulator screen:

Layout:
Left side:
- big headline
- short explanation
- IBM sample document selector
- scenario cards
- run simulation button

Right side:
- large FelineSignalEngine
- mini status panel

Hero copy:
FIND THE FAILURE
BEFORE IT FINDS YOU.

Subcopy:
Upload an enterprise policy, SOP, or governance document. PreMortem AI simulates crisis conditions and reveals where your operation breaks.

Sample IBM document buttons:
- IBM Government Audit Simulation
- IBM Supplier Failure Simulation
- IBM AI Governance Simulation

Scenario cards:
- Audit Tomorrow
- Critical Vendor Fails
- Sensitive Data Exposure
- Enterprise Client Escalates
- Approval Workflow Breaks

Interaction:
- Selecting a document changes engine state to documentLoaded
- Selecting a scenario changes engine state to scenarioSelected
- Clicking Run PreMortem Simulation changes state to analyzing for about 1.5 seconds, then navigates to /failure-map
- Use mock data only

Failure Map screen:

Layout:
Top:
- Wow summary strip

Center:
- large FelineSignalEngine in failureDetected state
- risk score orb beside/near it

Below:
- failure signal cards
- critical blocker cards
- impact area cards

Main wow text:
7 FAILURE SIGNALS DETECTED
3 CRITICAL BLOCKERS
14-DAY DELAY EXPOSURE

Use mockAnalysis data.

Fix Plan screen:

Layout:
Left:
- resolution action plan table/cards

Right:
- evidence checklist
- audit memory timeline
- small FelineSignalEngine in resolved state

Add local-only approve/edit/reject style controls visually, but no backend.

Mock data requirements:
Create realistic IBM-inspired public-document demo data, but do not copy long IBM text.
Use short sample metadata and simulated excerpts.

Sample docs:
1. IBM Government Client Guidelines
2. IBM Supply Chain Responsibility Requirements
3. IBM Responsible AI / Granite Responsible Use Guide

Mock analysis should include:
- riskScore: 82
- riskLevel: High
- 7 failure points
- 3 critical blockers
- 14 estimated delay days
- executive summary
- failure points with severity, area, signal, impact
- fix plan with priority, action, owner, evidence needed, timeframe, status
- audit trail events
- evidence checklist

Code quality rules:
- TypeScript types should be clean.
- Components should be reusable.
- No huge component files where avoidable.
- No hardcoded repeated card markup if data mapping works better.
- Keep styling elegant and consistent.
- Use semantic names.
- Keep state simple.
- Avoid unnecessary dependencies.
- No unused imports.
- App must run without backend.
- App must look polished at desktop size first and reasonably responsive on mobile.

Execution instructions:
1. Inspect the existing folder.
2. If no package.json exists, initialize a Vite React TypeScript app in this same folder without deleting the existing MD/PDF files.
3. Install needed dependencies.
4. Set up Tailwind properly.
5. Build the full UI-only MVP.
6. Run typecheck/build.
7. Fix any errors.
8. Give me a short summary of files created/changed and the local run command.

Do not stop after scaffolding.
Actually implement the screens and components.
```

---

## Short Cursor Prompt

Use this short prompt in Cursor if the full prompt is saved as this file in the project folder:

```md
Read `cursor_phase_1_2_execution_prompt.md` fully and execute it exactly.

Also read these source-of-truth docs before coding:
- phase_1_product_shape_meowvate_premortem_ai.md
- phase_2_ui_plan_meowvate_premortem_ai.md
- ibm_public_docs_sample_spec.md

Build the UI-only MVP in this same folder. Do not add backend, Gemini, auth, database, or scraping. Use mock data only. After implementation, run the build/typecheck, fix errors, and summarize changed files plus the local run command.
```
