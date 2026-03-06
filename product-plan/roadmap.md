# Product Roadmap

## Roadmap Principle

Ship the **project-first workspace** before expanding feature depth.

The pivot changes the order of operations:

- old order: worldbuilder -> visualization -> studio
- new order: project intake -> boards -> canon/assets -> exports

## Current State

### Foundation Already Built

- Next.js 16 application shell
- authentication
- multi-project selection via current `worlds` model
- entity CRUD for characters, locations, organizations, items, rules, stories
- import, chat, graph, and export foundations

These are now treated as reusable building blocks for the Studio pivot, not the final product shape.

## Phase 1: Pivot Reset

**Goal:** Change the product identity from `worldbuilder-first` to `project-first`.

### Deliverables

- workflow-first shell and IA
- `Overview`, `Boards`, `Canon`, `Assets`, `Exports`, `Agent Chat` navigation
- rewritten product-plan docs
- onboarding updated to brief-first and script-first entry paths
- project language replacing worldbuilder-first copy

## Phase 2: Workspace Model

**Goal:** Establish the core Studio model inside the app.

### Deliverables

- project-first data model
- stage boards
- board blocks and elements
- lineage and version tracking model
- canon approval model
- first reusable `Core Agent` orchestration layer

## Phase 3: Intake And Breakdown

**Goal:** Make brief and script the two native starting paths.

### Deliverables

- project brief intake
- script breakdown intake
- extraction into stories, scenes, beats, and asset signals
- board seeding from intake results
- supporting reference intake for canon

## Phase 4: Design And Storyboard Flow

**Goal:** Help creators move from narrative structure into visual planning.

### Deliverables

- design board workflows
- asset-linked visual references
- storyboard planning surfaces
- shot intent and sequence handling
- stage-aware AI suggestions

## Phase 5: Delivery Exports

**Goal:** Turn the coordinated workflow into shareable outputs.

### Deliverables

- project bible export
- scene and shot exports
- storyboard-ready packages
- screenplay- and shotlist-oriented export paths
- better handoff packages for collaborators

## Phase 6: Collaboration And Review

**Goal:** Add review and lightweight team workflows after the single-user flow feels strong.

### Deliverables

- comments and review checkpoints
- shared viewer links
- activity history
- approval state on canon and board outputs

## Phase 7: Flagship Animation Layer

**Goal:** Deepen the strongest showcase vertical without narrowing the whole product to it.

### Deliverables

- stronger storyboard workflows
- animatic-oriented exports
- animation-specific board templates
- future alignment with APAC animation requirements

## Phase 8: Advanced Production Bridges

**Goal:** Expand outward once the core Studio workflow is stable.

### Deliverables

- richer screenplay and shotlist exports
- VP-aware specifications
- downstream production integrations
- selective 3D or technical asset metadata where it helps the workflow

## Not Planned Early

| Feature | Why Not |
|---------|---------|
| Wiki-scale worldbuilding depth | No longer the primary job to be done |
| Full production management suite | Outside the focus of preproduction workflow clarity |
| Enterprise workflow complexity | Solve solo and small-team coordination first |
| Feature parity with StudioBinder or ShotGrid | Compete on workflow fit, not checklist breadth |
| Autonomous end-to-end generation | Undermines traceability and creative control |

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-06 | Pivot to project-first Studio | Most creators need coordinated preproduction, not worldbuilding-first workflow |
| 2026-03-06 | Brief and script are equal entry points | Reduces friction for both concept-led and script-led projects |
| 2026-03-06 | Boards become the hero surface | Visualization and traceability are stronger differentiators than import |
| 2026-03-06 | Canon becomes a support layer | Worldbuilding still matters, but not as the product identity |
| 2026-03-06 | Core agent framed as coordinator | AI should manage continuity and next steps, not just generate output |
