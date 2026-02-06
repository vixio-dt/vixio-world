# Vixio - Product Overview

## Tagline

**"From messy ideas to production-ready."**

**"The only pre-production tool where your assets live alongside your story."**

## What It Is

Vixio is a **creative development and pre-production platform** built around two integrated products:

- **Vixio Worldbuilder** - Creative hub for ideation, worldbuilding, and story development
- **Vixio Studio** - Production planning for modern filmmaking (traditional, virtual production, animation)

Unlike text-first worldbuilding tools (World Anvil, Campfire) or script-first production tools (StudioBinder), Vixio treats **visual assets as the primary organizational unit** - and connects them to their story context through what we call the **Lore Link**.

**The core promise:** Take your messy ideas, organize them around characters and worlds, and walk out with production-ready docs—whether you're shooting on location, on an LED wall, or in animation.

---

## Product Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         VIXIO OS                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  WORLDBUILDER                      STUDIO                        │
│  ─────────────                     ──────                        │
│  Creative Hub                      Production Planning           │
│                                                                  │
│  • Entity creation                 • Status pipeline             │
│  • Freeform content                • Version tracking            │
│  • 3D model viewer                 • Assignments & scheduling    │
│  • Story context                   • Production metadata         │
│  • Relationship graph              • Export to formats           │
│                                                                  │
│        │                                  ▲                      │
│        │         THE LORE LINK            │                      │
│        └──────────────────────────────────┘                      │
│        (Assets connected to story context)                       │
│                                                                  │
│  [Writers, directors,              [Producers, VAD leads,        │
│   concept artists]                  production teams]            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Why Two Products?

| Single Product Problem | Two-Product Solution |
|------------------------|----------------------|
| "Who is this for?" confusion | Worldbuilder = creatives, Studio = production |
| One-size-fits-all pricing | Worldbuilder = accessible, Studio = professional |
| Competes with everyone | Worldbuilder ≠ StudioBinder, Studio ≠ World Anvil |
| VP features awkward for writers | Studio is VP-native by design |

### The Integration is the Moat

```
World Anvil → Manual export → StudioBinder → Manual asset prep → VP pipeline
                  ↑                              ↑
              [Friction]                     [Friction]

Vixio Worldbuilder → Native handoff → Vixio Studio → VP-ready asset specs
                          ↑                              ↑
                      [Seamless]                     [Built-in]
```

---

## Core Differentiator: The Lore Link

**The Lore Link connects every asset to its story context.**

This is what separates Vixio from both worldbuilding tools (which don't understand production) and production tools (which don't understand story).

```
┌─────────────────────────────────────────────────────────────────┐
│  STANDARD ASSET CARD (ShotGrid)                                  │
├─────────────────────────────────────────────────────────────────┤
│  File: Robot_Arm_v3.fbx                                          │
│  Status: Texturing                                               │
│  Assigned: Sarah                                                 │
│  Due: Oct 12                                                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  VIXIO ASSET CARD (with Lore Link)                               │
├─────────────────────────────────────────────────────────────────┤
│  Asset: Robot Arm                                                │
│  Status: Texturing                                               │
│  Assigned: Sarah                                                 │
│  Due: Oct 12                                                     │
├─────────────────────────────────────────────────────────────────┤
│  STORY CONTEXT:                                                  │
│  "Rusty from Sea Battle in Scene 4. Kael uses it to break       │
│   the prison door. Should look weathered, industrial."           │
│                                                                  │
│  Related: @Kael, @Scene 4, @Sea Battle, @The Prison              │
│  [Concept Art] [3D Preview] [Scene Script Link]                  │
└─────────────────────────────────────────────────────────────────┘
```

**Why this matters for production:**

The "Director says 'make it scarier,' artist asks 'roughness map or lighting?'" problem exists because **context is lost in translation**. With the Lore Link, the artist can see:
- The original concept art
- The scene where the asset appears
- The mood/tone notes
- The narrative purpose

They can make better decisions without constant clarification meetings.

---

## Production Styles

Vixio Studio supports three production workflows:

### Traditional (Live-Action)

Standard film/video production with physical locations, props, and actors.

- Location briefs
- Prop lists
- Call sheet data
- Screenplay export (PDF, Fountain, FDX)
- Shot lists

### Virtual Production

Modern filmmaking using LED walls, real-time engines, and digital assets.

Virtual Production **inverts the traditional workflow**:

```
Traditional:  Pre-production → Production → Post-production
                  (Plan)         (Shoot)      (VFX, edit)

Virtual:      Pre-production ←→ Post-production → Production
              [Both plan together]  [Final pixel]   (Capture on set)
```

**VP requires pre-production to answer post-production questions:**

| Traditional Pre-Pro | VP Pre-Pro Requirements |
|---------------------|------------------------|
| "What does the castle look like?" | "What does it look like at final render?" |
| Concept art | Real-time environment specs |
| Shot list | LED wall content briefs |
| Location scout | HDRI capture requirements |
| Storyboard | Previz with accurate lighting |

**Vixio Studio for VP:**
- Asset lifecycle management (Concept → Model → Texture → Rig → In-Engine)
- 3D viewer for approval without opening Unreal
- Technical metadata (poly count, texture resolution, render status)
- Dependency tracking (if TechVis isn't done, Shoot can't happen)

### Animation

Pre-production for animated content (2D, 3D, anime/donghua).

- Character design briefs
- Background art briefs
- Exposure sheets (future)
- Animation timing charts (future)

---

## How This Differs From Others

| Tool | Primary Driver | Assets Are... | Understands VP? |
|------|----------------|---------------|-----------------|
| World Anvil / Campfire | Text (wiki) | Attachments to text | No |
| StudioBinder | Script | Production metadata | No |
| ShotGrid / Ftrack | Tasks | Technical files | Partial |
| Notion / Trello | Lists | Generic items | No |
| **Vixio** | **Visual Assets** | **Connected to story** | **Yes** |

---

## Philosophy

**Soft structure: Typed entities with freeform content.**

We reject both extremes:

| Approach | Problem |
|----------|---------|
| Pure freeform canvas (Miro) | No structure for production consolidation |
| Rigid forms (World Anvil) | Blocks creative flow, feels like data entry |

**Our approach:**
- **Entities have types** (Character, Location, Prop, Story) - provides structure
- **Content within is freeform** (text, images, 3D, links) - preserves creativity
- **Relationships are explicit** (@mentions, drag-to-link) - enables graph
- **AI assists, doesn't dictate** - suggests structure, user confirms

See [product-philosophy.md](./product-philosophy.md) for details.

---

## Target Markets

### Primary: Film & Video Productions

The core paying market. Users with real budgets and deadlines.

**Traditional Productions:**
- Independent filmmakers (short films, features, documentaries)
- Web series and YouTube narrative creators
- Screenwriters developing scripts
- Small production companies (1-10 people)
- Production teams priced out of StudioBinder

**Virtual Production Teams:**
- Indie VP creators (green screen + Unreal)
- LED volume productions (smaller scale)
- Previz teams
- Virtual Art Department (VAD) leads

### Secondary: Writers & Worldbuilders

Shared pain points, more price-sensitive. Served via free/cheap Worldbuilder tiers.

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

See [markets/apac-regional.md](./markets/apac-regional.md) for APAC considerations.

---

## Core Features

### Worldbuilder (MVP)

**1. Typed Entity System**
Characters, locations, props, stories as the organizing unit.

- Entity pages with type (Character, Location, Prop, Story, Rule)
- Freeform content within each entity (text, images, 3D, files)
- Explicit relationships between entities (@mentions, links)
- Visual graph showing connections

**2. 3D Model Viewer**
Native support for AI-generated 3D assets.

- Upload .glb/.gltf files (Three.js / model-viewer)
- External embeds (Sketchfab, Tripo AI, Meshy share links)
- Rotatable, zoomable preview in entity cards
- Future: Direct AI generation (Tripo/Meshy API)

*Why this matters:* Users are already generating 3D with Tripo, Hunyuan, Meshy. If Worldbuilder can't display them, users will use other tools.

**3. AI-Assisted Import**
Paste your messy docs, AI helps organize.

- Plain text / markdown paste
- AI suggests entity extraction (user confirms)
- "Just Chat" OR "Extract & Organize" modes
- Cross-reference with existing world

*Positioning note:* Import is a **wedge** (gets users in), not a **moat** (keeps them). The real moat is the Worldbuilder → Studio integration.

**4. Story Context (The Lore Link)**
Every asset carries its narrative purpose.

- Why does this character exist?
- What scene does this prop appear in?
- What's the mood/tone?
- Who needs to know about this?

### Studio (v1.5+)

**5. Status Pipeline**
Customizable workflow stages per asset type.

- Default: Concept → Approved → In Production → Complete
- VP: Concept → Modeling → Texturing → Rigging → In-Engine
- Animation: Design → Approved → Rigged → Animated

**6. Production Metadata**
The "what happens to this asset" layer.

- Assigned to (person/department)
- Due date
- Version history
- Technical specs (for VP: poly count, texture res, etc.)
- Dependencies (blocks/blocked by)

**7. Production Export**
Output to industry formats.

- Screenplay (PDF, Fountain, FDX)
- Shot lists (CSV, PDF)
- Character/Location briefs
- Schedule CSV (importable to StudioBinder/Celtx)
- VP asset specs (future)

**8. Collaboration**
Teams without per-seat friction.

- Creator vs Collaborator roles
- Commenting and suggestions
- Viewer links (no account required)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AI | OpenAI / Anthropic APIs |
| 3D Viewer | model-viewer / Three.js |
| Deployment | Vercel |

---

## Business Context

Vixio is one pillar of **Vixio Creatives Ltd** (Hong Kong).

See [vision.md](./vision.md) for the full company vision.

---

## Pricing

See [pricing.md](./pricing.md) for the Core + Collaborators pricing model.

**Current model (Worldbuilder-focused):**
- **Free tier**: Hook users with import + basic AI + 3D viewer
- **Creator** ($15/mo): Solo creators, full features
- **Team** ($35/mo): Up to 3 creators + 15 collaborators
- **Studio** ($79/mo): Up to 10 creators + unlimited collaborators

No per-seat fees. No feature gatekeeping on core functionality.

**Future consideration:** Separate Worldbuilder/Studio pricing when Studio launches.

---

## Regional Versions (Future)

APAC markets require **separate regional versions**, not just translation:

| Version | Market | Data Residency |
|---------|--------|----------------|
| **Vixio** (Global) | International | US/EU data centers |
| **Vixio CN** | China | China (Alibaba/Tencent Cloud) |
| **Vixio JP** | Japan | Japan (AWS Tokyo) |
| **Vixio KR** | Korea | Korea (AWS Seoul) |

---

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
