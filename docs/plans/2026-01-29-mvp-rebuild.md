# MVP Rebuild Plan

> **Status:** Implementation Complete, Pending Commit & Deploy
> **Started:** 2026-01-29
> **Tech Stack:** Next.js 15 + Supabase + Vercel

## Overview

Rebuild Vixio Worldbuilder from scratch using Next.js 15 (App Router). Keep product docs and Superpower framework, replace all implementation code.

## MVP Scope

- Auth (login/signup/logout)
- World creation and selection
- Characters: full CRUD (list, create, view, edit, delete)
- Basic design system
- Responsive layout

## Architecture

```
Client Browser
    ↓
Next.js on Vercel (App Router + Server Actions)
    ↓
Supabase (Auth + PostgreSQL + Storage)
```

## File Structure

```
vixio-world/
├── app/                      # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   └── (dashboard)/
│       ├── layout.tsx
│       ├── page.tsx
│       └── characters/
│           ├── page.tsx
│           ├── [id]/page.tsx
│           └── new/page.tsx
├── components/
│   ├── ui/                   # Design system
│   └── shell/                # App shell
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── actions/              # Server actions
│   └── types/
│       └── database.ts
└── middleware.ts             # Auth middleware
```

## Tasks

### Pre-Implementation
- [x] Update AGENTS.md with documentation rule
- [x] Create task tracking structure (docs/current-sprint.md)

### Implementation
- [x] Clean up old Vite/React code
- [x] Initialize Next.js 15 project
- [x] Configure Supabase (client, server, middleware)
- [x] Migrate database types
- [x] Build auth flow
- [x] Build app shell
- [x] Build design system
- [x] Build Characters feature

### Post-Implementation
- [x] Update documentation (current-sprint.md, plan)
- [ ] Deploy to Vercel

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| App Router vs Pages | App Router | Modern, better for server components |
| Server Actions vs API Routes | Server Actions | Simpler for CRUD |
| Tailwind vs CSS Modules | Tailwind | Faster development |

## References

- Database schema: `supabase/schema.sql`
- Product overview: `product-plan/product-overview.md`
