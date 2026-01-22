# Vixio Worldbuilder

Cloud-based worldbuilding tool for filmmakers creating virtual productions with Unreal Engine.

## Features

- **World Bible** — 9 element categories (Characters, Locations, Organizations, Events, Items, Rules, Stories, Scenes, Shots)
- **AI World Chat** — Natural language queries, consistency checking, story suggestions
- **Rule Enforcement** — Automatic conflict detection
- **Production Exports** — MetaHuman specs, environment briefs, storyboard prompts
- **Cloud Sync** — Access from anywhere via Supabase

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Deployment**: Railway.app

## Development

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env.local` file with:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_POE_API_KEY=your-poe-api-key  # Optional, for AI chat
```

## Database Setup

Run `supabase/schema.sql` in your Supabase SQL Editor to create all tables.

## Deployment (Railway)

1. Connect your GitHub repo to Railway
2. Add environment variables in Railway dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Railway auto-detects and builds with Nixpacks

## Design System

- **Primary**: Sky (#0ea5e9)
- **Secondary**: Cream
- **Neutral**: Slate
- **Fonts**: Space Grotesk (headings), Inter (body), JetBrains Mono (code)
