# Reuse Vs Rebuild Map

## Reuse

These parts of the current app are valuable building blocks for the pivot:

### Application Foundation

- auth and protected routing
- project switching via current `world` context
- existing shell layout
- command palette

### Data Foundations

- `worlds` as transitional `projects`
- character, location, organization, item, rule, event, story entities
- existing `scenes` and `shots` tables
- content blocks and story context fields

### Utility Surfaces

- import flow
- agent chat foundation
- export foundation
- relationship graph

## Rebuild / Heavily Refactor

### Product Framing

- sidebar IA
- onboarding language
- overview page framing
- import as central differentiator

### Workflow Model

- move from entity-first to board-first navigation
- make canon and assets subordinate to workflow
- create stage-specific workspace surfaces
- introduce lineage and version thinking

### Copy And Naming

- `world` language in user-facing UI should shift to `project`
- `AI Chat` should become `Agent Chat`
- `World Bible` should become `Project Bible`

## Transitional Strategy

Do not rebuild the whole backend first.

Instead:

1. Reframe the product in docs and navigation
2. Add workflow-first surfaces
3. Reuse existing entities as canon and asset backplanes
4. Introduce deeper board and lineage behavior incrementally
