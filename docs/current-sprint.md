# Current Sprint

**Status:** Phase 2 started. Entity content blocks schema designed and implemented.
**Updated:** 2026-01-29

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

## Next Phase: Worldbuilder Core (Phase 2)

**Goal:** Typed entity system with 3D support and AI-assisted import.

### Planned Features

**1. Entity System**
- Entity types: Character, Location, Prop, Story, Rule
- Entity pages with freeform content (text, images, files)
- Relationship system (@mentions, explicit links)
- Basic visual graph showing connections

**2. 3D Model Viewer**
- Upload .glb/.gltf files (model-viewer web component)
- External embed support (Sketchfab, Tripo AI, Meshy share links)
- Rotatable, zoomable preview in entity cards
- File storage setup (Supabase Storage)

**3. AI-Assisted Import**
- Plain text / markdown paste
- AI suggests entity extraction (user confirms)
- "Just Chat" OR "Extract & Organize" modes
- Cross-reference with existing world entities

**4. Story Context (Lore Link Foundation)**
- Each entity has a "Story Context" field
- Free-form text describing narrative purpose
- Related entities automatically linked

### Before Starting Phase 2

- [x] Deploy MVP to Vercel (validate production works)
- [x] Design entity system data model (content_blocks + story_context + entity_mentions)
- [ ] Research model-viewer implementation
- [ ] Plan AI integration (OpenAI/Anthropic API setup)

---

## Pending: Vercel Deployment

**Blocked:** Vercel project not set up yet.

When ready:
1. Import `vixio-dt/vixio-world` repo to Vercel
2. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy

---

## Context for New Sessions

### What's Done
- Next.js 16 app with auth + Characters CRUD (upgraded from 15)
- **Next.js 16 upgrade complete** (Turbopack default, proxy.ts convention, ESLint flat config)
- **Strategic pivot to Worldbuilder + Studio architecture**
- **Lore Link identified as core differentiator**
- **3D viewer added to MVP scope**
- **Virtual Production added as production style**
- All product docs updated with new positioning

### What's Next
- Deploy to Vercel
- Start Phase 2: Worldbuilder Core (entity system, 3D viewer, import)

### Key Files
- `AGENTS.md` - Project rules for AI assistants
- `docs/current-sprint.md` - This file
- `product-plan/product-overview.md` - Product vision (Worldbuilder + Studio)
- `product-plan/competitive-analysis.md` - Market research (including VP competitors)
- `product-plan/roadmap.md` - Feature priorities and decision log
- `product-plan/pricing.md` - Pricing model
- `supabase/schema.sql` - Database schema

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| 3D Viewer | model-viewer / Three.js |
| Deployment | Vercel |

### Key Strategic Concepts

**The Lore Link:** Every asset carries its story context - why it exists, what scene it appears in, what mood/tone it should convey. This is what differentiates from ShotGrid (tracks files, not meaning) and World Anvil (tracks story, not production).

**Soft Structure:** Typed entities (Character, Location, Prop) with freeform content inside. Provides enough structure for production consolidation while preserving creative freedom.

**VP-Aware:** Virtual Production inverts the traditional workflow - post-production decisions happen during pre-production. Vixio Studio will support this workflow natively.
