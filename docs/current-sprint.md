# Current Sprint

**Status:** UX Foundation Overhaul In Progress
**Updated:** 2026-02-05

---

## In Progress: UX Foundation Overhaul (2026-02-05)

### Phase 1: Foundation (COMPLETE)

Implemented core UX infrastructure for professional design system.

| Component | Purpose |
|-----------|---------|
| `lib/theme/mantine-theme.ts` | Centralized Mantine theme with brand colors, virtual colors, shadows |
| `ColorSchemeToggle` | Header toggle for light/dark mode |
| `lib/animations/index.ts` | Motion variants (fadeIn, slideUp, staggerContainer, etc.) |
| `globals.css` | Cleaned up, dark scrollbars, Tailwind v4 dark mode config |

**Dependencies Added:**
- `motion` - Animation library (React)
- `@tabler/icons-react` - Icon library for Mantine

**Files Created:**
- `lib/theme/mantine-theme.ts`
- `lib/animations/index.ts`
- `components/shell/ColorSchemeToggle.tsx`

**Files Updated:**
- `components/providers/MantineClientProvider.tsx` - Uses new theme, auto color scheme
- `app/layout.tsx` - ColorSchemeScript with auto mode
- `components/shell/Header.tsx` - Dark mode classes, toggle button
- `components/shell/Sidebar.tsx` - Dark mode classes

**Known Issue:** Tailwind v4 `@custom-variant dark` with Mantine's `data-mantine-color-scheme` needs further debugging. Mantine components work correctly with dark mode; shell components using Tailwind dark: classes need refinement.

### Phase 2: In Progress

**Timeline Visualization:** ✅ COMPLETE
- Replaced grid layout with proper Mantine Timeline component
- Vertical timeline with date/period grouping
- Events grouped by year/period with sticky headers
- Type-based visual differentiation (icons + colors for historical/plot_point/scheduled/recurring)
- View toggle between Timeline and Grid modes
- Motion stagger animations on timeline items
- Dark mode support throughout

**Files Created:**
- `components/timeline/TimelineView.tsx` - Main timeline visualization component

**Files Updated:**
- `app/(dashboard)/timeline/page.tsx` - Added view toggle (timeline/grid)
- `components/timeline/EventCard.tsx` - Dark mode support, type-based icons
- `components/timeline/index.ts` - Export TimelineView

**Category Differentiation:** ✅ COMPLETE
- Each entity type gets distinctive visual treatment
- ✅ Characters: Profile-style cards with avatar prominence, role-based gradients, entrance animations
- ✅ Locations: Tree view with type hierarchy, gradient icons, atmosphere quotes
- ✅ Rules: Sidebar navigation with category grouping, accordion panels, category icons/badges

**Files Created:**
- `components/locations/LocationTreeView.tsx` - Hierarchical tree view with type icons
- `components/rules/RuleCategoryView.tsx` - Sidebar navigation with category grouping

**Files Updated:**
- `components/characters/CharacterCard.tsx` - Profile-style card with avatar, role badges, motion animations
- `app/(dashboard)/characters/page.tsx` - Dark mode text, passes index for stagger animations
- `components/locations/LocationCard.tsx` - Gradient icons, type badges, atmosphere quotes, motion animations
- `app/(dashboard)/locations/page.tsx` - View toggle (tree/grid), dark mode support
- `components/locations/index.ts` - Export LocationTreeView
- `components/rules/RuleCard.tsx` - Gradient icons, category badges, rule code/statement/scope, motion animations
- `app/(dashboard)/rules/page.tsx` - View toggle (sidebar/grid), dark mode support
- `components/rules/index.ts` - Export RuleCategoryView

**Motion Integration:**
- ✅ Apply stagger animations to entity lists (Timeline, Characters, Locations, Rules)
- Page transitions (pending)
- Card hover effects (via Mantine Paper hover styles)

---

## Recent Completion: AI Chat (2026-02-05)

### AI-Powered World Chat

Added AI chat feature for querying and exploring your world using natural language.

| Component | Purpose |
|-----------|---------|
| `/chat` route | Chat interface with message history |
| `ChatMessage` | Message display with source citations |
| `ChatInput` | Auto-resizing input with send on Enter |
| `QuickActions` | One-click commands (/status, /gaps, etc.) |
| `chat.ts` actions | Session management, AI queries |
| `ai-context.ts` | Serializes world data for AI context |

**Commands:**
- Natural language queries - "Who knows about the artifact?"
- `/check [statement]` - Check consistency against world rules
- `/gaps` - Find underdeveloped areas
- `/suggest story` - Get story ideas using your entities
- `/connections [name]` - Explore relationships
- `/status` - World statistics

**Database:**
- `chat_sessions` - One session per world
- `chat_messages` - Message history with metadata

**Files Created:**
- `app/(dashboard)/chat/page.tsx`
- `components/chat/ChatMessage.tsx`
- `components/chat/ChatInput.tsx`
- `components/chat/QuickActions.tsx`
- `components/chat/index.ts`
- `lib/actions/chat.ts`
- `lib/utils/ai-context.ts`
- `supabase/migrations/2026-02-05-chat.sql`

**Run migration:** Execute `supabase/migrations/2026-02-05-chat.sql` in Supabase SQL Editor.

---

## Recent Completion: Template World & World Isolation Fixes (2026-02-05)

### Template World ("Explore Demo World")

Added option to create a pre-populated demo world during onboarding, giving new users immediate content to explore.

| Component | Purpose |
|-----------|---------|
| `WorldOnboarding.tsx` | Added "Explore Demo World" button |
| `seed-template.ts` | Server action that creates "Neon Shadows" world with sample entities |

**Pre-populated Entities (Neon Shadows - Cyberpunk Noir):**
- 4 Characters (Kira Tanaka, Marcus Chen, ECHO, Sister Mercy)
- 4 Locations (Neon District, The Rust, Chrome Tower, The Sanctum)
- 3 Organizations (Nexus Corp, The Disconnected, Church of Chrome Dawn)
- 4 Rules (Memory Transfer, AI Legal Status, Augmentation Limits, The Grid)
- 3 Items (Echo's Core, Kira's Badge, Neural Spike)
- 2 Events (The Nexus Incident, First Contact with ECHO)
- 1 Story (Ghost in the System)

**Files Created:**
- `lib/actions/seed-template.ts`

### World Isolation Bug Fixes

Fixed critical bug where entity pages showed data from ALL worlds instead of just the selected world.

**Issues Fixed:**

1. **Cookie Name Mismatch** - Entity pages were reading `selected_world_id` cookie but `world-context.ts` sets `current_world_id`.

2. **Characters Not Filtered** - Characters page fetched all characters without world filter; now uses `getCharacters(worldId)`.

**Files Updated (Cookie Fix):**
- `app/(dashboard)/locations/page.tsx` + `new/page.tsx`
- `app/(dashboard)/organizations/page.tsx` + `new/page.tsx`
- `app/(dashboard)/timeline/page.tsx` + `new/page.tsx`
- `app/(dashboard)/items/page.tsx` + `new/page.tsx`
- `app/(dashboard)/rules/page.tsx` + `new/page.tsx`
- `app/(dashboard)/stories/page.tsx` + `new/page.tsx`
- `app/(dashboard)/characters/page.tsx` + `new/page.tsx`

---

## Recent Completion: Remote Headless Development (2026-02-05)

### Remote Development Skill

Added skill and scripts for controlling Cursor remotely from mobile devices using VS Code Remote Tunnels.

| Component | Purpose |
|-----------|---------|
| `remote-headless-development` skill | Quick reference for remote dev workflow |
| `keep-awake-windows.ps1` | Prevents Windows sleep while Cursor runs |
| `mobile-quickstart.md` | PWA setup guide for iOS/Android |
| `tunnel-setup-checklist.md` | One-time tunnel configuration |

**Why this approach:** Uses existing Cursor subscription with full skill system access. No extra API costs. Full agent mode, MCP servers, and codebase indexing available remotely.

**Files Created:**
- `.claude/skills/remote-headless-development/SKILL.md`
- `scripts/remote-dev/keep-awake-windows.ps1`
- `scripts/remote-dev/mobile-quickstart.md`
- `scripts/remote-dev/tunnel-setup-checklist.md`

---

## Recent Completion: Phase 2+3 Features (2026-01-30)

### @Mentions System

Inline @mentions for linking entities within content blocks.

| Component | Purpose |
|-----------|---------|
| `MentionInput` | Textarea with autocomplete dropdown for @mentions |
| `MentionDropdown` | Searchable entity picker grouped by type |
| `searchEntities` | Server action for cross-entity search |
| `syncEntityMentions` | Auto-saves mention relationships to database |

**Features:**
- Type `@` in any content block to trigger autocomplete
- Search filters by name across all entity types
- Mentions render as clickable links in read mode
- Relationships tracked in `entity_mentions` table

### Relationship Graph

Interactive force-directed graph visualization of world entities and connections.

| Component | Purpose |
|-----------|---------|
| `RelationshipGraph` | Force-directed graph using react-force-graph-2d |
| `GraphControls` | Filter by type, search, zoom controls |
| `/graph` route | Full-page graph view |

**Features:**
- Nodes colored by entity type
- Node size based on connection count
- Click to navigate to entity detail
- Filter toggles by entity type
- Search to highlight entities
- Fullscreen mode

### Global Search (Cmd+K)

Command palette for quick entity search accessible with keyboard shortcut.

| Component | Purpose |
|-----------|---------|
| `CommandPalette` | Modal search interface |
| `Cmd/Ctrl+K` | Keyboard shortcut to open |

**Features:**
- Real-time search across all entities
- Results grouped by type with icons
- Arrow key navigation
- Enter to select and navigate

### Export System

Export world data in multiple formats.

| Format | Use Case |
|--------|----------|
| JSON | Backups, migrations, API integration |
| Markdown | World Bible document for sharing |

**Features:**
- Select entity types to export
- Download as file
- `/export` route with format selection

### UX Polish

| Feature | Description |
|---------|-------------|
| Breadcrumbs | Navigation hierarchy on detail pages |
| Toast notifications | Success/error feedback system |
| Keyboard shortcuts | Ctrl+G (graph), Ctrl+E (export) |
| Loading skeletons | Placeholder content during load |
| Slide-in animations | Toast notification entrance |

### MCP Configuration Updates

Added new MCP servers to `.cursor/mcp.json`:
- **GitHub** - Repository management, PRs, issues
- **AntVis Chart** - 25+ visualization charts for export diagrams

---

## Recent Completion: Phase 2 UI Integration

### All Entity Pages (2026-01-29)

Implemented full CRUD for all entity types with Phase 2 features (story_context, content_blocks, 3D models).

**Design:** [Phase 2 UI Integration Design](./plans/2026-01-29-phase2-ui-integration-design.md)

| Entity Type | Routes | Color Theme |
|-------------|--------|-------------|
| Characters | `/characters/*` | Sky blue |
| Locations | `/locations/*` | Emerald green |
| Items | `/items/*` | Amber |
| Organizations | `/organizations/*` | Purple |
| Timeline/Events | `/timeline/*` | Rose |
| Rules | `/rules/*` | Indigo |
| Stories | `/stories/*` | Cyan |

**Each entity includes:**
- List page with cards
- Detail page with story_context highlight
- Create/Edit forms with content blocks editor
- Delete functionality
- 3D model support via Add Model button

**New Components:**
- `components/content-blocks/ContentBlocksDisplay.tsx` - Read-only block viewer
- `components/content-blocks/ContentBlocksEditor.tsx` - Block editing interface
- `components/{entity}/` - Card and Form components for each entity

**Server Actions:**
- `lib/actions/locations.ts`
- `lib/actions/items.ts`
- `lib/actions/organizations.ts`
- `lib/actions/events.ts`
- `lib/actions/rules.ts`
- `lib/actions/stories.ts`

---

## Recent Completion: AI Import

### Entity Extraction (2026-01-29)

Added AI-powered entity extraction using OpenRouter (Deepseek V3.2). Users paste content, AI extracts entities, user reviews and confirms creation.

**Design:** [AI Import Design](./plans/2026-01-29-ai-import-design.md)

| Component | Purpose |
|-----------|---------|
| `/import` page | Paste content, preview extraction, create entities |
| `extractEntities` | Sends content to Deepseek, returns structured JSON |
| `createExtractedEntities` | Creates selected entities in database |

**Supported entity types:**
- Characters, Locations, Organizations, Items, Events

**Files Created:**
- `app/(dashboard)/import/page.tsx` - Import page UI
- `lib/ai/openrouter.ts` - OpenRouter client config
- `lib/ai/extract-entities.ts` - Extraction logic
- `lib/ai/types.ts` - Extracted entity types
- `lib/actions/import.ts` - Server actions

**Environment:** Requires `OPENROUTER_API_KEY` in `.env`

---

## Recent Completion: 3D Model Viewer

### Model Embed Components (2026-01-29)

Added 3D model embed support for Sketchfab and Tripo AI. Users can add model URLs to entities via the "Add 3D Model" button.

**Design:** [Model Viewer Design](./plans/2026-01-29-model-viewer-design.md)

| Component | Purpose |
|-----------|---------|
| `ModelEmbed` | Renders iframe for Sketchfab/Tripo URLs |
| `AddModelButton` | Button + modal for adding model URLs |
| `parseModelUrl` | Utility to parse and validate model URLs |

**Supported platforms:**
- Sketchfab (https://sketchfab.com/3d-models/...)
- Tripo AI (https://www.tripo3d.ai/app/share/...)

**Files Created:**
- `components/models/ModelEmbed.tsx`
- `components/models/AddModelButton.tsx`
- `components/models/index.ts`
- `lib/utils/model-url.ts`

**Integration:** Models stored as `'model'` type in content_blocks JSONB.

---

## Recent Completion: Entity Content Blocks Schema

### Schema Extension (2026-01-29)

Extended entity schema to support freeform content while preserving structured fields. This enables the "soft structure" philosophy.

**Design:** [Entity Content Blocks Design](./plans/2026-01-29-entity-content-blocks-design.md)

| Change | Details |
|--------|---------|
| **New columns** | `story_context` (TEXT) + `content_blocks` (JSONB) on all entity tables |
| **New table** | `entity_mentions` for tracking @mention relationships |
| **Storage** | Bucket configuration for media attachments |
| **Types** | `ContentBlock`, `EntityMention` TypeScript types |

**Tables updated:**
- characters, locations, organizations, events, items, rules, stories

**Key concepts:**
- **Content Blocks**: Freeform content (text, media) stored as JSONB array
- **Story Context**: The "Lore Link" field for narrative purpose
- **@Mentions**: Link entities within content, tracked in `entity_mentions` table

**Files Changed:**
- `supabase/schema.sql` - Schema extensions
- `lib/types/database.ts` - TypeScript types
- `docs/plans/2026-01-29-entity-content-blocks-design.md` - Design doc
- `docs/plans/2026-01-29-entity-content-blocks-impl.md` - Implementation plan

---

## Recent Completion: Dashboard Route Fix

### Routing Fix (2026-01-29)

Fixed broken dashboard routing - the dashboard page existed but was unreachable due to route group misconfiguration.

| Issue | Fix |
|-------|-----|
| Dashboard at `(dashboard)/page.tsx` had no URL | Moved to `(dashboard)/dashboard/page.tsx` → `/dashboard` |
| Auth redirects went to non-existent route | Now redirect to `/dashboard` |
| Logo inverted on auth pages | Removed `invert` class |

**Routes now working:**
- `/` → Landing page (public)
- `/login`, `/signup` → Auth pages (public)
- `/dashboard` → Dashboard with entity counts (protected)
- `/characters/*` → Characters CRUD (protected)

---

## Recent Completion: Next.js 16 Upgrade

### Framework Upgrade (2026-01-29)

Upgraded from Next.js 15.1.7 to 16.1.6 to adopt latest features and stay current.

| Change | Details |
|--------|---------|
| **Next.js** | 15.1.7 → 16.1.6 |
| **eslint-config-next** | 15.1.0 → 16.1.6 |
| **Bundler** | Turbopack now default |
| **Middleware** | Renamed to `proxy.ts` (new convention) |
| **Linting** | Migrated from `next lint` to ESLint CLI |

**Files Changed:**
- `package.json` - Updated dependencies, lint script
- `middleware.ts` → `proxy.ts` - File renamed, function export changed
- `eslint.config.mjs` - Created (flat config format)
- `components/ui/Card.tsx` - Fixed empty interface lint error

**Verification:**
- Build: ✅ Exit 0
- Lint: ✅ Exit 0 (0 errors)
- Dev server: ✅ Ready in 975ms

---

## Recent Completion: Strategic Pivot

### Strategic Planning Session (2026-01-29)

A significant strategic evolution based on market analysis and product positioning discussions.

**Key Question Addressed:** "Import feature can be built in a weekend by competitors. What's the actual differentiator?"

**Answer:** The Lore Link - connecting assets to their story context through the Worldbuilder → Studio integration. Import is a wedge (gets users in), not a moat (keeps them).

### Strategic Decisions Made

| Decision | Rationale |
|----------|-----------|
| **Product split: Worldbuilder + Studio** | Clearer market positioning. Worldbuilder = creatives, Studio = production teams. Natural upsell path. |
| **Virtual Production as production style** | VP inverts traditional workflow (post-production decisions in pre-production). High-pain, underserved market. |
| **3D viewer in Worldbuilder MVP** | Users generate 3D with Tripo/Hunyuan/Meshy. Option B: .glb upload + external embeds. AI generation is v1.5. |
| **Lore Link as core differentiator** | Story context travels with assets. ShotGrid tracks files, not meaning. World Anvil tracks story, not production. We bridge both. |
| **Soft structure approach** | Typed entities (Character, Location, etc.) with freeform content inside. Not pure canvas (no consolidation), not rigid forms (blocks creativity). |
| **Import repositioned** | Import is a wedge, not a moat. The real moat is Worldbuilder → Studio integration. |

### New Product Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         VIXIO OS                                 │
├─────────────────────────────────────────────────────────────────┤
│  WORLDBUILDER                      STUDIO                        │
│  ─────────────                     ──────                        │
│  • Entity creation                 • Status pipeline             │
│  • Freeform content                • Version tracking            │
│  • 3D model viewer                 • Assignments                 │
│  • Story context                   • Production metadata         │
│  • Relationship graph              • Export to formats           │
│                                                                  │
│        └──────── THE LORE LINK ────────┘                        │
│        (Assets connected to story context)                       │
└─────────────────────────────────────────────────────────────────┘
```

### Documents Updated

- [x] `product-plan/product-overview.md` - Worldbuilder/Studio split, VP, 3D viewer, Lore Link
- [x] `product-plan/competitive-analysis.md` - VP market section, ShotGrid/Kitsu/generic tools
- [x] `product-plan/roadmap.md` - 3D viewer in MVP, VP phases, decision log
- [x] `product-plan/mission.md` - Lore Link positioning, VP market
- [x] `product-plan/pricing.md` - Note about future Worldbuilder/Studio pricing
- [x] `docs/current-sprint.md` - This file

---

## Previous Completion: MVP Implementation

### MVP Implementation ✅ Complete

**Plan:** [MVP Rebuild](./plans/2026-01-29-mvp-rebuild.md)
**Goal:** Next.js app with auth + Characters CRUD

| Task | Status |
|------|--------|
| Clean up old Vite/React code | ✅ |
| Initialize Next.js 15 project | ✅ |
| Configure Supabase (client, server, middleware) | ✅ |
| Build auth flow (login/signup) | ✅ |
| Build app shell (sidebar, header, world switcher) | ✅ |
| Build design system (Button, Card, Input, etc.) | ✅ |
| Build Characters feature (full CRUD) | ✅ |
| Update README | ✅ |
| Commit and push to GitHub | ✅ |

**Verification (2026-01-29):**
- TypeScript compiles (`tsc --noEmit` exit 0)
- Dev server starts without errors
- All routes return 200
- Auth middleware protects dashboard routes

---

## Next Phase: Studio MVP (Phase 4)

**Goal:** Asset lifecycle management for production teams.

### Planned Features

**1. Status Pipeline**
- Customizable workflow stages per entity type
- Default: Concept → Approved → In Production → Complete
- VP mode: Concept → Modeling → Texturing → Rigging → In-Engine
- Visual kanban board view

**2. Production Metadata**
- Assigned to (person/department)
- Due date
- Version history
- Technical specs field (for VP: poly count, texture res, etc.)
- Dependencies (blocks/blocked by)

**3. The Lore Link Integration**
- Story context from Worldbuilder visible in Studio
- Two views of same data (creative vs production)
- Changes sync bidirectionally

### Before Starting Phase 4

- [ ] Deploy to Vercel (validate production works)
- [ ] User testing feedback on Worldbuilder features
- [ ] Design status pipeline data model
- [ ] Research kanban board implementation

---

## Pending: Vercel Deployment

**Blocked:** Vercel project not set up yet.

When ready:
1. Import `vixio-dt/vixio-world` repo to Vercel
2. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENROUTER_API_KEY`
3. Deploy

---

## Context for New Sessions

### What's Done
- **Phase 1 (Foundation):** Auth + Characters CRUD ✅
- **Phase 2 (Worldbuilder Core):** All entity types, 3D embeds, AI import, AI chat ✅
- **Phase 3 (Worldbuilder Polish):** Graph visualization, export, global search, UX polish ✅
- **Template World:** Pre-populated "Neon Shadows" demo world for new users
- **World Isolation:** All entity pages correctly filter by selected world

### What's Next
- Deploy to Vercel
- User testing and feedback
- Start Phase 4: Studio MVP (status pipeline, production metadata)

### Key Files
- `AGENTS.md` - Project rules for AI assistants
- `docs/current-sprint.md` - This file
- `product-plan/product-overview.md` - Product vision (Worldbuilder + Studio)
- `product-plan/competitive-analysis.md` - Market research (including VP competitors)
- `product-plan/roadmap.md` - Feature priorities and decision log
- `product-plan/pricing.md` - Pricing model
- `supabase/schema.sql` - Database schema
- `supabase/migrations/2026-02-05-chat.sql` - AI Chat tables

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + Mantine UI |
| Animation | Motion (motion/react) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AI | OpenRouter (Deepseek V3.2) |
| 3D Viewer | Sketchfab / Tripo AI embeds |
| Deployment | Vercel |

### Key Strategic Concepts

**The Lore Link:** Every asset carries its story context - why it exists, what scene it appears in, what mood/tone it should convey. This is what differentiates from ShotGrid (tracks files, not meaning) and World Anvil (tracks story, not production).

**Soft Structure:** Typed entities (Character, Location, Item, Organization, Story, Rule, Event) with freeform content inside. Provides enough structure for production consolidation while preserving creative freedom.

**VP-Aware:** Virtual Production inverts the traditional workflow - post-production decisions happen during pre-production. Vixio Studio will support this workflow natively.

**AI Integration:** OpenRouter with Deepseek V3.2 powers both entity extraction (import) and world chat queries.
