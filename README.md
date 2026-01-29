# Vixio Worldbuilder

Cloud-based worldbuilding tool for filmmakers and storytellers. Visual asset-driven approach for managing characters, locations, organizations, and narratives.

## Current Status

**MVP Phase** — Auth + Characters CRUD complete. See [docs/current-sprint.md](docs/current-sprint.md) for progress.

## Features (MVP)

- **Authentication** — Login/signup with Supabase Auth
- **Characters** — Full CRUD (create, read, update, delete)
- **Multi-world support** — Switch between different world projects
- **Responsive design** — Works on desktop and mobile

## Roadmap Features

- **World Bible** — Characters, Locations, Organizations, Events, Items, Rules, Stories
- **AI World Chat** — Natural language queries about your world
- **Import** — Paste/upload existing world documents, AI extracts entities
- **Visualization** — Node-based relationship maps and timelines
- **Production Exports** — Screenplay format, shot lists, storyboards

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
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
```

Get these from your [Supabase project settings](https://supabase.com/dashboard/project/_/settings/api).

## Database Setup

Run `supabase/schema.sql` in your Supabase SQL Editor to create all tables.

## Project Structure

```
vixio-world/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login, signup
│   └── (dashboard)/        # Protected app pages
├── components/
│   ├── ui/                 # Design system (Button, Card, Input, etc.)
│   ├── shell/              # App shell (Header, Sidebar, WorldSwitcher)
│   └── characters/         # Character-specific components
├── lib/
│   ├── actions/            # Server actions
│   ├── supabase/           # Supabase client config
│   └── types/              # TypeScript types
├── docs/                   # Sprint tracking and plans
└── product-plan/           # Product documentation
```

## Documentation

- [Product Overview](product-plan/product-overview.md)
- [Roadmap](product-plan/roadmap.md)
- [Current Sprint](docs/current-sprint.md)
