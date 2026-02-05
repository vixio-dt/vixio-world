# Vixio Worldbuilder

Cloud-based worldbuilding tool for filmmakers and storytellers. Visual asset-driven approach for managing characters, locations, organizations, and narratives.

## Current Status

**Phase 2+3 Complete** — Full entity system with AI features. See [docs/current-sprint.md](docs/current-sprint.md) for details.

## Features

### Entity System (World Bible)
- **Characters** — Protagonists, antagonists, supporting cast with roles and arcs
- **Locations** — Places in your world with types and descriptions
- **Organizations** — Factions, groups, companies with purposes and structures
- **Items** — Objects, artifacts, weapons with types and significance
- **Rules** — World laws, magic systems, technology rules
- **Stories** — Narratives, plots, story arcs with genres and status
- **Timeline/Events** — Key moments and plot points with dates

### AI Features
- **AI Chat** — Natural language queries about your world (`/status`, `/gaps`, `/connections`)
- **AI Import** — Paste text, AI extracts entities for review and creation
- **Template World** — "Explore Demo World" creates pre-populated sample world

### Visualization & Export
- **Relationship Graph** — Interactive force-directed visualization of entity connections
- **Global Search (Cmd+K)** — Quick search across all entities
- **Export** — JSON and Markdown (World Bible) formats

### Core Platform
- **Authentication** — Login/signup with Supabase Auth
- **Multi-world support** — Switch between different world projects
- **3D Model Embeds** — Sketchfab and Tripo AI model viewers
- **@Mentions** — Link entities within content blocks
- **Responsive design** — Works on desktop and mobile

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AI | OpenRouter (Deepseek V3.2) |
| Deployment | Vercel |

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENROUTER_API_KEY=your-openrouter-key
```

Get Supabase credentials from [Supabase project settings](https://supabase.com/dashboard/project/_/settings/api).
Get OpenRouter API key from [OpenRouter](https://openrouter.ai/).

## Database Setup

1. Run `supabase/schema.sql` in your Supabase SQL Editor to create all tables
2. Run `supabase/migrations/2026-02-05-chat.sql` to add AI Chat tables

## Project Structure

```
vixio-world/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login, signup
│   └── (dashboard)/        # Protected app pages
│       ├── characters/     # Characters CRUD
│       ├── locations/      # Locations CRUD
│       ├── organizations/  # Organizations CRUD
│       ├── items/          # Items CRUD
│       ├── rules/          # Rules CRUD
│       ├── stories/        # Stories CRUD
│       ├── timeline/       # Events/Timeline CRUD
│       ├── chat/           # AI Chat interface
│       ├── graph/          # Relationship visualization
│       ├── import/         # AI entity extraction
│       └── export/         # JSON/Markdown export
├── components/
│   ├── ui/                 # Design system (Button, Card, Input, etc.)
│   ├── shell/              # App shell (Header, Sidebar, WorldSwitcher)
│   ├── chat/               # AI Chat components
│   ├── graph/              # Graph visualization
│   ├── content-blocks/     # Freeform content editor
│   ├── models/             # 3D model embeds
│   └── {entity}/           # Entity-specific components
├── lib/
│   ├── actions/            # Server actions (CRUD, AI, export)
│   ├── ai/                 # AI integration (OpenRouter)
│   ├── supabase/           # Supabase client config
│   ├── utils/              # Utilities (world context, AI context)
│   └── types/              # TypeScript types
├── docs/                   # Sprint tracking and plans
└── product-plan/           # Product documentation
```

## Documentation

- [Product Overview](product-plan/product-overview.md)
- [Roadmap](product-plan/roadmap.md)
- [Current Sprint](docs/current-sprint.md)
