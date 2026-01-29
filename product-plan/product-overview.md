# Vixio Worldbuilder - Product Overview

## What It Is

Vixio Worldbuilder is a **visual asset-driven creative platform** that connects worldbuilding to production.

Unlike text-first worldbuilding tools or script-first production tools, Vixio treats **visual assets as the primary organizational unit** - connecting characters, locations, and props from initial concept through to storyboards and production documents.

## Core Differentiator: Visual Asset-Driven

```
┌─────────────────────────────────────────────────────────────┐
│                  VISUAL ASSET-DRIVEN                         │
│                                                              │
│   Assets are the PRIMARY organizational unit                 │
│   Everything else flows FROM and TO assets                   │
│                                                              │
│   ┌─────────┐     ┌─────────┐     ┌─────────┐              │
│   │Character│     │Location │     │  Prop   │              │
│   │  Asset  │     │  Asset  │     │  Asset  │              │
│   └────┬────┘     └────┬────┘     └────┬────┘              │
│        │               │               │                    │
│        └───────────────┼───────────────┘                    │
│                        ▼                                     │
│   ┌─────────────────────────────────────────┐              │
│   │         Generates / Connects To          │              │
│   ├──────────────────────────────────────────┤              │
│   │ • World bible text                       │              │
│   │ • Character design briefs                │              │
│   │ • Storyboard frames                      │              │
│   │ • Shot lists & production docs           │              │
│   │ • Animation timing sheets                │              │
│   │ • Relationship visualizations            │              │
│   └─────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

## How This Differs From Others

| Tool | Primary Driver | Assets Are... |
|------|----------------|---------------|
| World Anvil / Campfire | Text (wiki) | Attachments to text |
| Clapperbie / StudioBinder | Script | Production metadata |
| Storyboard Pro | Drawings | Isolated files |
| **Vixio** | **Visual Assets** | **The organizing unit** |

## Philosophy

**Soft worldbuilding by default, hard mode when you want it.**

- AI serves the creator's intent, not the other way around
- Import existing content and start working immediately
- No mandatory forms, no forced structure
- Consistency checking is available, not enforced

See [product-philosophy.md](./product-philosophy.md) for details.

## Target Markets

### Primary: Storytellers with existing content
- Writers with world bibles
- Novelists managing series
- Solo creators developing original IPs

### Secondary: Production professionals
- Filmmakers (live-action)
- Screenwriters
- Virtual production teams (UE, etc.)

### Tertiary: Animation Industry (APAC Focus)
- Anime/donghua studios
- Animation pre-production teams
- Storyboard artists

See [markets/apac-regional.md](./markets/apac-regional.md) for APAC regional considerations.

## Regional Versions (Future)

APAC markets require **separate regional versions**, not just translation:

| Version | Market | Data Residency |
|---------|--------|----------------|
| **Vixio** (Global) | International | US/EU data centers |
| **Vixio CN** | China | China (Alibaba/Tencent Cloud) |
| **Vixio JP** | Japan | Japan (AWS Tokyo) |
| **Vixio KR** | Korea | Korea (AWS Seoul) |

**Why separate versions:**
- **IP Asset Governance**: Studios require assets stored in-region
- **Legal compliance**: Data protection laws differ (PIPL, APPI)
- **Cultural fit**: UI/UX conventions vary significantly
- **Ecosystem integration**: Local apps (WeChat, LINE, KakaoTalk)

## Core Features

### 1. AI-Powered Import (Central Feature)
Upload existing world bible (plain text, markdown). AI comprehends it. Start working immediately.

- **Macro import**: Full world bibles
- **Micro import**: Individual characters/elements
- **Your choice**: Extract structure OR just chat

### 2. Visual Asset Management
Assets are the core - characters, locations, props, organizations.

- Visual references attached to assets
- Assets appear across storyboards, timelines, relationships
- One update syncs everywhere

### 3. Context-Aware AI Chat
Query your world. Get suggestions. Explore possibilities.

- AI knows your entire world context
- Soft mode: Creative companion
- Hard mode: Consistency checker

### 4. Node-Based Visualization
See your world as connected nodes.

- **Relationship maps**: Characters, locations, factions
- **Timeline view**: Events in temporal sequence
- AI generates initial graphs from content

### 5. Production Export (Key Differentiator)
Export directly to production-ready formats.

- **Screenplay**: PDF, Fountain - AI converts narrative to script
- **Shot Lists**: AI-generated shot suggestions from scenes
- **Character/Location Briefs**: Production-ready asset documentation
- **Animation Exports**: Exposure sheets, timing charts (future)

### 6. AI Storyboard Generation (Major Differentiator)
Generate storyboard frames directly from scenes.

- AI knows your world (characters, locations, style)
- Consistent character appearances across frames
- Export as frames, PDF storyboard, or animatic-ready sequence

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + TypeScript + Tailwind CSS v4 |
| Backend | Supabase (PostgreSQL, Auth, Realtime) |
| AI | OpenAI / Anthropic APIs |
| Deployment | Railway.app |

## Business Context

Vixio Worldbuilder is one pillar of **Vixio Creatives Ltd** (Hong Kong).

See [vision.md](./vision.md) for the full company vision.

## Documents

| Document | Purpose |
|----------|---------|
| [vision.md](./vision.md) | Company vision, three pillars |
| [mission.md](./mission.md) | Product mission, target users |
| [product-philosophy.md](./product-philosophy.md) | Soft vs hard worldbuilding |
| [competitive-analysis.md](./competitive-analysis.md) | Market research, pain points |
| [roadmap.md](./roadmap.md) | Development phases |
| [markets/apac-animation.md](./markets/apac-animation.md) | APAC animation market analysis |
| [features/import-design.md](./features/import-design.md) | Import feature spec |
| [features/visualization-design.md](./features/visualization-design.md) | Node visualization spec |
| [features/export-design.md](./features/export-design.md) | Production export spec |
