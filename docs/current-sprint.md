# Current Sprint

**Active Plan:** [MVP Rebuild](./plans/2026-01-29-mvp-rebuild.md)
**Started:** 2026-01-29
**Goal:** Next.js app with auth + Characters CRUD

## Status

### Pre-Implementation
- [x] Update AGENTS.md with documentation rule
- [x] Create task tracking structure

### Implementation
- [x] Clean up old Vite/React code (deleted, uncommitted)
- [x] Initialize Next.js 15 project
- [x] Configure Supabase (client, server, middleware)
- [x] Migrate database types
- [x] Build auth flow (login/signup)
- [x] Build app shell (sidebar, header, world switcher)
- [x] Build design system (Button, Card, Input, etc.)
- [x] Build Characters feature (full CRUD)

### Post-Implementation
- [x] Update README
- [ ] Update roadmap (no changes needed)
- [ ] Deploy to Vercel (blocked: Vercel project not set up)

### Verification (2026-01-29)
- [x] TypeScript compiles (`tsc --noEmit` exit 0)
- [x] Dev server starts without errors
- [x] All routes return 200 (/, /login, /signup, /dashboard, /dashboard/characters)
- [x] Auth middleware protects dashboard routes
- [x] Supabase client initializes (after env var fix: VITE_* → NEXT_PUBLIC_*)

## Context for New Sessions

**IMPORTANT:** Fresh rebuild using Next.js 15 (App Router). 

- Old `src/` folder contains legacy React/Vite code - IGNORE IT
- New code goes in `app/`, `components/`, `lib/`
- Supabase schema in `supabase/schema.sql` is still valid
- Product docs in `product-plan/` are the source of truth

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Deployment | Vercel |

## Key Files

- `AGENTS.md` - Project rules for AI assistants
- `docs/current-sprint.md` - This file (active work tracker)
- `product-plan/product-overview.md` - Product vision
- `supabase/schema.sql` - Database schema
