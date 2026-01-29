# Current Sprint

**Status:** Phase 1 (MVP) Complete. Planning session complete. Ready for Phase 2.
**Updated:** 2026-01-29

---

## Recent Completion: MVP Rebuild + Strategic Planning

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

### Strategic Planning ✅ Complete

**Session:** Market research and positioning validation (2026-01-29)

**Key Decisions Made:**

1. **Target Market:** Film/video productions primary, writers/worldbuilders secondary
2. **Positioning:** "Professional pre-production tools. Accessible to all."
3. **Pricing Model:** Core + Collaborators (no per-seat fees)
4. **AI Storyboards:** Demoted from differentiator to table stakes (commoditized)
5. **APAC:** Future phase, keep architecture flexible

**Documents Updated:**
- [x] `product-plan/product-overview.md` - New positioning, target markets
- [x] `product-plan/mission.md` - Refined problem/solution, user segments
- [x] `product-plan/pricing.md` - Created with Core + Collaborators model
- [x] `product-plan/competitive-analysis.md` - StudioBinder research details
- [x] `product-plan/roadmap.md` - Research-validated feature priorities

---

## Next Phase: Import & AI Organization

**Goal:** "Paste your messy docs, AI figures it out."

This is the **central differentiator** validated by research. Users with existing content (Google Docs, notes, world bibles) don't want to re-type everything into forms.

### Planned Features

1. **Import System**
   - Plain text / markdown paste
   - File upload (DOCX, PDF)
   - AI reads and comprehends content

2. **AI Organization**
   - Extract characters, locations, props, events
   - Map relationships
   - Track consistency (passive, on-demand)

3. **Post-Import Flow**
   - "Just Chat" mode (stay free-form)
   - "Extract & Organize" mode (create structured entities)

### Before Starting Phase 2

- [ ] Deploy MVP to Vercel (validate production works)
- [ ] Design import UX flow
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
- Full strategic planning with market research validation
- Product docs updated with new positioning

### What's Next
- Deploy to Vercel
- Start Phase 2: Import & AI Organization

### Key Files
- `AGENTS.md` - Project rules for AI assistants
- `docs/current-sprint.md` - This file
- `product-plan/product-overview.md` - Product vision and positioning
- `product-plan/pricing.md` - Pricing model
- `product-plan/roadmap.md` - Feature priorities
- `supabase/schema.sql` - Database schema

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Deployment | Vercel |
