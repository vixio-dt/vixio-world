# Current Sprint

**Status:** Phase 1 (MVP) Complete. Strategic pivot complete. Ready for Phase 2 (Worldbuilder Core).
**Updated:** 2026-01-29

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

- [ ] Deploy MVP to Vercel (validate production works)
- [ ] Design entity system data model
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
- Next.js 15 app with auth + Characters CRUD
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
| Framework | Next.js 15 (App Router) |
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
