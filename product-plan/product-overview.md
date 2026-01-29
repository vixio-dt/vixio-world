# Vixio - Product Overview

## Tagline

**"From messy ideas to production-ready."**

**"Professional pre-production tools. Accessible to all."**

## What It Is

Vixio is a **creative development and pre-production platform** that bridges the gap between story ideas and production-ready output.

Unlike text-first worldbuilding tools (World Anvil, Campfire) or script-first production tools (StudioBinder), Vixio treats **visual assets as the primary organizational unit** - connecting characters, locations, and props from initial concept through to scripts, shot lists, and production documents.

**The core promise:** Take your messy ideas, organize them around characters and worlds, and walk out with production-ready docs—without burning out on admin.

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

### Primary: Film & Video Productions
The core paying market. Users with real budgets and deadlines.

- Independent filmmakers (short films, features, documentaries)
- Web series and YouTube narrative creators
- Screenwriters developing scripts
- Small production companies (1-10 people)
- Production teams priced out of StudioBinder

### Secondary: Writers & Worldbuilders
Shared pain points, more price-sensitive. Served via free/cheap tiers.

- Novelists managing series continuity
- TTRPG creators and dungeon masters
- Fantasy/sci-fi worldbuilders
- Fan fiction writers with complex universes
- Game narrative designers

### Future: Animation Industry (APAC)
Attractive long-term vertical with high barriers. Requires regional infrastructure.

- Anime/donghua studios (Japan, China, Korea)
- Animation pre-production teams
- Storyboard artists

See [markets/apac-regional.md](./markets/apac-regional.md) for APAC considerations. Architecture should remain flexible for future expansion.

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

Features are prioritized based on market research validation. See [pricing.md](./pricing.md) for tier details.

### Tier 1: MVP (Must-Have)

**1. AI-Powered Import (Central Differentiator)**
Paste your messy Google Docs, markdown, or notes. AI comprehends and organizes.

- **Macro import**: Full world bibles, story documents
- **Micro import**: Individual characters, scenes, elements
- **Your choice**: "Just Chat" (stay free-form) OR "Extract & Organize" (create structured entities)

*Why this matters:* Most tools require manual form-filling. "Paste and go" is underserved.

**2. Visual Asset Graph**
Characters, locations, props as the organizing unit—not wiki pages or scripts.

- Entity pages with images, descriptions, relationships
- Simple visual graph showing connections
- Timeline view for story events
- One update syncs everywhere

*Why this matters:* Creators think in characters and places, not database fields.

**3. Creative Workspace**
Free-form notebook tied to assets. AI as consistency assistant, not content generator.

- "Just Chat" mode: Ask questions like "Where has Character X appeared?"
- AI tracks consistency so you don't have to (reduces creator's fatigue)
- Soft worldbuilding by default; hard mode optional

**4. Pre-Production Export (Key Differentiator)**
Export directly to production-ready formats.

- **Screenplay**: PDF, Fountain, FDX - AI converts narrative to script format
- **Shot Lists**: AI-generated suggestions from scenes
- **Character/Location Briefs**: Production-ready documentation
- **Schedule CSV**: Importable to StudioBinder/Celtx for teams using those tools

*Why this matters:* Worldbuilding tools stop at prose. Production tools start after script. We bridge the gap.

### Tier 2: v1.5 (Reinforce Differentiation)

**5. Consistency Assistant**
On-demand checks for contradictions. Per-asset "canon summary" auto-generated.

**6. Soft→Hard Worldbuilding Controls**
Toggle to enforce consistency rules once users shift from exploration to lock-down.

**7. Collaboration**
Commenting, suggestions, invite collaborators without per-seat penalty.

**8. Integrations**
Google Drive, Notion/Obsidian export, Arc Studio/Final Draft import.

### Future Phases

**9. AI-Assisted Storyboards**
Generate visual frames from scenes. Note: This is commoditized and not a differentiator—table stakes, not a moat.

**10. Animation Exports**
Exposure sheets, timing charts for animation pre-production. Requires APAC regional infrastructure.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AI | OpenAI / Anthropic APIs |
| Deployment | Vercel |

## Business Context

Vixio is one pillar of **Vixio Creatives Ltd** (Hong Kong).

See [vision.md](./vision.md) for the full company vision.

## Pricing

See [pricing.md](./pricing.md) for the Core + Collaborators pricing model.

**Summary:**
- **Free tier**: Hook users with import + basic AI
- **Creator** ($15/mo): Solo creators, full features
- **Team** ($35/mo): Up to 3 creators + 15 collaborators
- **Studio** ($79/mo): Up to 10 creators + unlimited collaborators

No per-seat fees. No feature gatekeeping on core functionality.

## Documents

| Document | Purpose |
|----------|---------|
| [vision.md](./vision.md) | Company vision, three pillars |
| [mission.md](./mission.md) | Product mission, target users |
| [product-philosophy.md](./product-philosophy.md) | Soft vs hard worldbuilding |
| [pricing.md](./pricing.md) | Pricing model and tiers |
| [competitive-analysis.md](./competitive-analysis.md) | Market research, pain points |
| [roadmap.md](./roadmap.md) | Development phases |
| [markets/apac-regional.md](./markets/apac-regional.md) | APAC regional considerations |
| [features/import-design.md](./features/import-design.md) | Import feature spec |
| [features/visualization-design.md](./features/visualization-design.md) | Node visualization spec |
| [features/export-design.md](./features/export-design.md) | Production export spec |
