# Phase 2 — UI Plan: Meowvate PreMortem AI

## Phase Outcome

By the end of Phase 2, the project should have a polished UI-only MVP using mock data.

The app should visually demonstrate:

> Click IBM sample document → choose crisis scenario → Feline Signal Engine changes state → run simulation → Failure Map appears → Fix Plan + Audit Trail appears.

No backend, Gemini, PDF parsing, database, auth, or deployment work should be added in this phase.

---

## Locked Product UI Identity

| Item | Decision |
|---|---|
| Product name in UI | **PreMortem AI** |
| Brand signature | **by Meowvate** |
| Core tagline | **Find the failure before it finds you.** |
| Theme direction | **Sidewave-inspired cinematic enterprise flux** |
| Main UI metaphor | **Chaos → signal → order** |
| Wow factor | **Feline Signal Engine** |
| App type for this phase | **UI-only mock data demo** |
| Primary audience | Hackathon judges / enterprise board-style audience |

---

## Theme Direction

The UI should feel inspired by the mood of Sidewave-style cinematic creative-tech websites, but it must not copy Sidewave directly.

### Desired Feel

| Area | Direction |
|---|---|
| Mood | Cinematic, dark, premium, futuristic |
| Product feel | Enterprise AI command system |
| Visual metaphor | Waves, signals, entropy, risk fields |
| Layout | Full-screen sections, floating panels, editorial hierarchy |
| Motion | Smooth reveal, pulsing signals, subtle scanning |
| Personality | Serious first, playful only through the Meowvate brand signature |
| Cat branding | Abstract tech cat face only, not mascot-heavy |

### Avoid

- Generic SaaS dashboard look
- Cartoon cat branding
- Bright childish colors
- Overly complex navigation
- Too many screens
- Backend/API work during UI phase
- Auth or database setup

---

## Visual System

### Color Palette

| Token | Hex | Use |
|---|---|---|
| `void` | `#030406` | Main background |
| `graphite` | `#0B0F14` | Main panels |
| `graphiteSoft` | `#111827` | Raised cards / secondary panels |
| `signalBlue` | `#4D7CFE` | Primary CTA / active states |
| `electricCyan` | `#39E7F5` | AI glow / highlights |
| `fluxViolet` | `#8B5CF6` | Simulation / model reasoning glow |
| `riskAmber` | `#FFB020` | Warning / high risk |
| `criticalRed` | `#FF4D5E` | Critical blockers |
| `softWhite` | `#F4F7FB` | Primary text |
| `mutedGrey` | `#8A95A6` | Secondary text |

### Typography

| Use | Font |
|---|---|
| Hero / dramatic headings | **Space Grotesk** |
| UI / body | **Inter** |
| Risk scores / logs | **JetBrains Mono** |

### Language Style

Use dramatic but clear labels.

| Boring label | Better UI label |
|---|---|
| Analyze document | Decode operational signal |
| Risk analysis | Failure signal map |
| Recommendations | Resolution path |
| Audit log | Audit memory |
| Scenario | Stress condition |
| Issues | Failure points |
| Dashboard | Intelligence layer |

Important: do not overdo poetic language. The board must understand the product quickly.

---

# Locked UI Wow Factor — Feline Signal Engine

## Concept

The **Feline Signal Engine** is an abstract, artistic, tech-inspired cat face that acts as the AI simulation engine.

It should feel like:

> A cybernetic oracle watching enterprise workflows and detecting what will break.

The cat face is not decoration. It is the central product interaction.

---

## Visual Meaning

| Cat-face element | Meaning |
|---|---|
| Glowing eyes | AI detecting failure signals |
| Whiskers | Data streams / operational signals |
| Ears | Risk sensors / alert antennas |
| Face outline | Neural/radar field |
| Nose/mouth | Central decision node |
| Particles/waves | Chaos being decoded into order |
| Red/amber nodes | Detected failure points |

---

## Feline Signal Engine States

```ts
type FelineSignalEngineState =
  | "idle"
  | "documentLoaded"
  | "scenarioSelected"
  | "analyzing"
  | "failureDetected"
  | "resolved";
```

| State | Visual behavior |
|---|---|
| `idle` | Dim cat outline, slow breathing glow |
| `documentLoaded` | Eyes activate cyan |
| `scenarioSelected` | Whisker signal lines brighten |
| `analyzing` | Radar rings pulse, scan line rotates |
| `failureDetected` | Amber/red risk nodes orbit around face |
| `resolved` | Stable cyan/blue glow, reduced red |

---

## Component Spec

Create:

```txt
src/components/visual/FelineSignalEngine.tsx
```

Props:

```ts
type FelineSignalEngineProps = {
  state?: FelineSignalEngineState;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
};
```

### Visual Anatomy

| Part | Implementation |
|---|---|
| Cat outline | SVG strokes |
| Ears | Angular SVG paths |
| Eyes | Cyan glowing ellipses |
| Whiskers | Signal-line SVG paths |
| Nose node | Small central glowing dot |
| Radar rings | Absolute div/SVG circles |
| Particles | Small animated dots around face |
| Risk nodes | Amber/red dots only in failure state |

### Style Rules

| Do | Do not |
|---|---|
| Abstract line-art face | Cartoon mascot |
| Symmetric, mask-like | Cute expression |
| Cyan/violet glow | Bright playful colors |
| Thin elegant strokes | Thick childish icon |
| Tech/radar feeling | Cat paws, tails, meow jokes |

---

# Phase 2 UI Build Order

Build in controlled chunks. Do not give Cursor one generic prompt.

| Chunk | Build | Outcome |
|---|---|---|
| **UI-1** | Design tokens + global theme | App gets correct dark cinematic foundation |
| **UI-2** | App shell layout | Sidebar/header/main layout feels premium |
| **UI-3** | Feline Signal Engine base | Abstract cat face appears as hero visual |
| **UI-4** | Feline animation states | Cat face reacts to app state |
| **UI-5** | Scenario Simulator screen | Upload, sample docs, scenario cards, CTA |
| **UI-6** | Failure Map screen | Risk score, cat radar, failure signal cards |
| **UI-7** | Fix Plan screen | Action table, audit timeline, evidence cards |
| **UI-8** | Micro-polish | Loading, hover states, empty states, mobile cleanup |

The order matters:

> Theme first → layout second → signature visual third → screens after.

---

# UI-1 — Theme Foundation

## Files to touch

| File | Purpose |
|---|---|
| `tailwind.config.ts` | Add colors, fonts, shadows, animations |
| `src/index.css` | Global background, typography, grid/noise effects |
| `src/App.tsx` | Basic app wrapper if needed |

## Outcome

Before building screens, the app should already feel like a dark cinematic enterprise AI system.

No components yet. Just foundation.

---

# UI-2 — App Shell Layout

## Components to create

```txt
src/components/layout/AppShell.tsx
src/components/layout/Sidebar.tsx
src/components/layout/TopBar.tsx
src/components/ui/GlassPanel.tsx
src/components/ui/SectionLabel.tsx
```

## Layout

```txt
------------------------------------------------
| Sidebar | TopBar                              |
|         |-------------------------------------|
|         | Main content area                   |
|         |                                     |
------------------------------------------------
```

## Sidebar Navigation

| Route | Label |
|---|---|
| `/` | `01 / INPUT SIGNAL` |
| `/failure-map` | `02 / FAILURE MAP` |
| `/fix-plan` | `03 / RESOLUTION PATH` |

## TopBar Content

| Left | Right |
|---|---|
| `PreMortem AI by Meowvate` | `FELINE SIGNAL ENGINE // ONLINE` |

## Outcome

The app gets structure before detailed UI work.

---

# UI-3 — Feline Signal Engine Base

Build only this component first:

```txt
src/components/visual/FelineSignalEngine.tsx
```

## Outcome

The signature hero visual exists as a static abstract SVG/CSS component.

---

# UI-4 — Feline Signal Engine Animation States

Add visual behavior for each state.

| State | Required effect |
|---|---|
| `idle` | Dim outline + slow glow |
| `documentLoaded` | Eyes turn cyan |
| `scenarioSelected` | Whisker lines activate |
| `analyzing` | Radar pulse + scan motion |
| `failureDetected` | Red/amber nodes appear |
| `resolved` | Calm stable cyan glow |

## Outcome

The UI has its memorable interaction pattern.

---

# UI-5 — Scenario Simulator Screen

Create:

```txt
src/pages/ScenarioSimulator.tsx
```

## Layout

```txt
Left side:
- Big headline
- Short product explanation
- Upload/paste box
- IBM sample document buttons
- Scenario cards
- Run simulation button

Right side:
- Large FelineSignalEngine
- Mini status panel
```

## Hero Copy

```txt
FIND THE FAILURE
BEFORE IT FINDS YOU.

Upload an enterprise policy, SOP, or governance document.
PreMortem AI simulates crisis conditions and reveals where your operation breaks.
```

## IBM Sample Document Buttons

| Button |
|---|
| `IBM Government Audit Simulation` |
| `IBM Supplier Failure Simulation` |
| `IBM AI Governance Simulation` |

## Scenario Cards

| Card title | Subtitle |
|---|---|
| `Audit Tomorrow` | Regulator asks for evidence trail tomorrow |
| `Critical Vendor Fails` | Supplier outage threatens delivery |
| `Sensitive Data Exposure` | Confidential data flows through weak process |
| `Enterprise Client Escalates` | Client demands resolution visibility |
| `Approval Workflow Breaks` | Decision bottleneck delays operations |

## State Behavior

| User action | Engine state |
|---|---|
| Opens app | `idle` |
| Selects IBM doc | `documentLoaded` |
| Selects scenario | `scenarioSelected` |
| Clicks run | `analyzing` |

## Outcome

The first screen becomes demo-ready and visually impressive.

---

# UI-6 — Failure Map Screen

Create:

```txt
src/pages/FailureMap.tsx
```

## Layout

```txt
Top:
- Wow summary strip

Center:
- Large FelineSignalEngine in failureDetected state
- Risk score beside it

Bottom/grid:
- Failure signal cards
- Critical blocker cards
- Impact area cards
```

## Main Wow Text

```txt
7 FAILURE SIGNALS DETECTED
3 CRITICAL BLOCKERS
14-DAY DELAY EXPOSURE
```

## Components to create

```txt
src/components/risk/RiskScoreOrb.tsx
src/components/risk/FailureSignalCard.tsx
src/components/risk/ImpactAreaCard.tsx
src/components/risk/WowSummaryStrip.tsx
```

## Failure Card Structure

| Field | Example |
|---|---|
| Severity | `Critical` |
| Title | `No fallback decision owner` |
| Area | `Governance` |
| Signal | `Approval depends on a single role with no backup path.` |
| Impact | `Audit response may stall if owner is unavailable.` |

## Outcome

This becomes the screenshot-worthy screen.

---

# UI-7 — Fix Plan + Audit Trail Screen

Create:

```txt
src/pages/FixPlan.tsx
```

## Layout

```txt
Left:
- Resolution action plan table/cards

Right:
- Evidence checklist
- Audit memory timeline
- Small FelineSignalEngine resolved state
```

## Components to create

```txt
src/components/resolution/FixPlanTable.tsx
src/components/resolution/EvidenceChecklist.tsx
src/components/resolution/AuditMemoryTimeline.tsx
src/components/resolution/RecommendationCard.tsx
```

## Fix Plan Columns

| Column |
|---|
| Priority |
| Action |
| Owner |
| Evidence Needed |
| Timeframe |
| Status |

## Audit Timeline Examples

```txt
Document signal captured
Scenario selected: Audit Tomorrow
Failure simulation completed
3 critical blockers detected
Resolution path generated
Action approved by user
```

## Outcome

Judges see the product creates accountable enterprise action, not just a pretty dashboard.

---

# UI-8 — Micro-Polish

Do this last only.

| Area | Polish |
|---|---|
| Buttons | Hover glow, active press state |
| Cards | Subtle border gradient |
| Page transitions | Smooth fade/slide |
| Loading | Scanning animation |
| Empty states | Cat engine dim state |
| Mobile | Stack panels cleanly |
| Copy | Keep labels clear, not over-poetic |

## Outcome

The app feels premium, intentional, and hackathon-presentation ready.

---

# UI Mock State Plan

Keep UI state simple.

```ts
type AppDemoState = {
  selectedDocumentId: string | null;
  selectedScenarioId: string | null;
  engineState:
    | "idle"
    | "documentLoaded"
    | "scenarioSelected"
    | "analyzing"
    | "failureDetected"
    | "resolved";
  analysisReady: boolean;
};
```

## State Transitions

| User action | Engine state |
|---|---|
| Opens app | `idle` |
| Selects IBM doc | `documentLoaded` |
| Selects scenario | `scenarioSelected` |
| Clicks run | `analyzing` |
| Analysis result shown | `failureDetected` |
| Opens fix plan | `resolved` |

---

# Mock Data Required for UI Phase

Use mock data only in Phase 2.

Suggested files:

```txt
src/data/sampleDocs.ts
src/data/scenarios.ts
src/data/mockAnalysis.ts
```

## Sample Documents

| ID | Label | Recommended scenario |
|---|---|---|
| `ibm-government-guidelines` | IBM Government Audit Simulation | Audit Tomorrow |
| `ibm-supplier-responsibility` | IBM Supplier Failure Simulation | Critical Vendor Fails |
| `ibm-ai-governance` | IBM AI Governance Simulation | Sensitive Data Exposure / AI Governance Failure |

## Mock Analysis Summary

```txt
7 failure signals detected
3 critical blockers
14-day delay exposure
Risk score: 82 / 100
Risk level: High
```

---

# Exact Cursor Strategy

Do not ask Cursor to build the whole UI in one prompt.

Use this sequence:

| Prompt number | Cursor task |
|---|---|
| Prompt 1 | Add theme tokens + global cinematic background |
| Prompt 2 | Build app shell layout |
| Prompt 3 | Build static FelineSignalEngine SVG component |
| Prompt 4 | Add FelineSignalEngine animation states |
| Prompt 5 | Build Scenario Simulator screen using mock data |
| Prompt 6 | Build Failure Map screen using mock data |
| Prompt 7 | Build Fix Plan screen using mock data |
| Prompt 8 | Polish spacing, responsiveness, hover/loading states |

Each prompt must include these guardrails:

```txt
Do not add backend.
Do not add Gemini/API logic.
Do not add authentication.
Do not add Supabase/database.
Do not rewrite unrelated files.
Use mock data only.
Keep changes limited to the requested UI chunk.
```

---

# Cursor Prompt Guardrails

Every Cursor prompt should specify:

1. Exact files to create or edit.
2. Exact components to build.
3. No backend/API work.
4. No broad refactor.
5. Mock data only.
6. Keep visual system consistent with Phase 2 spec.
7. Preserve existing working code unless explicitly told to change it.

---

# Technical UI Decisions Locked

| Item | Decision |
|---|---|
| UI framework | React + Vite |
| Styling | Tailwind CSS |
| Animation | CSS animations first; Framer Motion optional |
| Signature visual | SVG/CSS Feline Signal Engine |
| Build mode | Mock data first |
| Screens | Scenario Simulator, Failure Map, Fix Plan |
| Layout | Sidebar + TopBar + cinematic content canvas |
| Core interaction | Select doc → select scenario → run → see risk map → see fix plan |
| Backend | Not in Phase 2 |
| Database | Not in Phase 2 |
| AI integration | Not in Phase 2 |

---

# Definition of Done for Phase 2

Phase 2 is complete when:

- The app has a dark cinematic Sidewave-inspired visual foundation.
- The sidebar/topbar shell exists.
- The Feline Signal Engine exists and supports all states.
- The Scenario Simulator screen works with mock IBM samples and scenario cards.
- The Failure Map screen displays a strong mock risk result.
- The Fix Plan screen displays action plan, evidence checklist, and audit memory timeline.
- The UI flow works without backend or AI.
- The demo can be clicked through smoothly.
- The product has one memorable visual identity: the Feline Signal Engine.

---

# Final Phase 2 Lock

Build a polished UI-only mock MVP first.

The priority is not technical complexity. The priority is:

> A judge immediately remembers the AI cat-face radar that turns enterprise chaos into failure signals and resolution paths.
