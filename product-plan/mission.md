# Product Mission

## Problem (Research-Validated)

### The Core Pain: Creator's Fatigue

> "It's very tiring to come up with a logical world while still letting creativity flow."

Creators can't be **creative** and **logically consistent** at the same time. Trying to do both causes burnout:

| Creative Mode | Logical Mode |
|---------------|--------------|
| "What if..." | "But that contradicts..." |
| Flow state | Checking consistency |
| Generative | Evaluative |
| Fun | Exhausting |

Existing tools make this worse by forcing structure upfront.

### Specific Problems

1. **Tool fragmentation** - Story ideas in Google Docs, worldbuilding in World Anvil, scripts in Final Draft, production in StudioBinder. Data re-entered multiple times.

2. **Manual data entry** - Most tools require filling out forms. Creators with existing content (messy notes, world bibles) don't want to re-type everything.

3. **Structure pressure** - World Anvil and Campfire push "hard worldbuilding" (forms, relationships, tracking). This blocks creative flow for many users.

4. **Gap between idea and production** - Worldbuilding tools stop at prose. Production tools start after the script is done. Nothing bridges the gap.

5. **Price barriers** - StudioBinder ($42-99+/month) prices out small teams and solo creators.

6. **No 3D support** - Users now generate 3D models with Tripo, Hunyuan, Meshy. No worldbuilding tool can display them.

7. **VP workflow ignorance** - Virtual Production inverts the traditional workflow. Existing tools don't understand this.

---

## Core Insights

### Insight 1: Assets Are the Organizing Metaphor

> **Assets are not attachments. Assets are the organizing unit.**

Creators think in terms of characters, locations, props—visual assets. But existing tools organize around text (wikis) or scripts (production tools). Vixio organizes around **visual assets**.

### Insight 2: The Lore Link is the Moat

> **Story context must travel with the asset.**

Production tools (ShotGrid, StudioBinder) track assets as technical files. Worldbuilding tools (World Anvil) track story but not production. Neither connects the two.

The **Lore Link** connects every asset to its story context:
- Why does this character exist?
- What scene does this prop appear in?
- What's the mood/tone?
- Who needs to know?

This solves the "Director says 'make it scarier,' artist asks 'roughness map or lighting?'" problem.

### Insight 3: Import is a Wedge, Integration is the Moat

> **Import gets users in the door. The bridge keeps them.**

"Paste docs, AI organizes" is a weekend build for any competitor. The real moat is the **Worldbuilder → Studio integration** - the seamless transition from creative development to production planning.

---

## Target Users

### Primary: Film & Video Productions

The core paying market. Users with real budgets and deadlines.

**Traditional Productions:**

| Segment | Description | Willingness to Pay |
|---------|-------------|-------------------|
| Independent filmmakers | Short films, features, documentaries | $15-35/month |
| Web series creators | YouTube, streaming platforms | $15-35/month |
| Screenwriters | Developing scripts for production | $15/month |
| Small production companies | 1-10 person teams | $35-79/month |

**Virtual Production Teams:**

| Segment | Description | Willingness to Pay |
|---------|-------------|-------------------|
| Indie VP creators | Green screen + Unreal Engine | $15-35/month |
| LED volume productions | Smaller scale VP | $35-79/month |
| Previz teams | Pre-visualization work | $35-79/month |
| VAD leads | Virtual Art Department managers | $35-79/month |

These users are priced out of StudioBinder/ShotGrid but need more than spreadsheets and Notion.

### Secondary: Writers & Worldbuilders

Shared pain points, more price-sensitive. Served via free/cheap Worldbuilder tiers.

| Segment | Description | Willingness to Pay |
|---------|-------------|-------------------|
| Novelists | Series writers managing continuity | $0-15/month |
| TTRPG creators | Dungeon masters, campaign managers | $0-12/month |
| Worldbuilders | Fantasy/sci-fi universe creators | $0-12/month |
| Game narrative designers | Story development for games | $12-25/month |

These users often use World Anvil/Campfire and complain about complexity and structure pressure.

### Future: Animation Industry (APAC)

Attractive long-term vertical with high barriers. Requires regional infrastructure.

- Anime/donghua studios (Japan, China, Korea)
- Data residency and IP governance requirements
- Enterprise sales cycles

Architecture should remain flexible for future expansion.

---

## Philosophy

See [product-philosophy.md](./product-philosophy.md) for details.

**Key principles:**

1. **AI handles consistency, you stay creative** - The tool manages the "logical mode" burden so creators can stay in "creative mode"

2. **Soft structure** - Typed entities (Character, Location, etc.) with freeform content inside. Not pure canvas, not rigid forms.

3. **Visual assets as the organizing unit** - Think in characters and places, not wiki pages

4. **The Lore Link** - Story context travels with every asset

5. **3D-native** - Built for the Tripo/Hunyuan generation

6. **Professional quality, accessible pricing** - No per-seat fees, no feature gatekeeping

7. **Production-ready output** - Not just prose—scripts, shot lists, production briefs

8. **VP-aware** - Understands that modern filmmaking inverts the traditional workflow

---

## Solution

Vixio is two integrated products:

### Vixio Worldbuilder

The **creative development** side:

1. **Typed entity system** - Characters, Locations, Props, Stories with freeform content inside
2. **3D model viewer** - Display AI-generated models (.glb, embeds)
3. **AI-assisted import** - Paste docs, AI suggests structure (user confirms)
4. **Story context** - Each asset knows its narrative purpose
5. **Relationship graph** - Visual connections between entities

### Vixio Studio

The **production planning** side:

1. **Status pipeline** - Customizable workflows (Concept → Approved → In Production)
2. **Production metadata** - Assigned to, due date, version history, technical specs
3. **The Lore Link view** - Story context from Worldbuilder visible during production
4. **Export** - Screenplay, shot lists, production briefs
5. **VP workflows** - Asset lifecycle management for virtual production

### The Bridge

The integration between Worldbuilder and Studio is the moat:

- Same data, two views (creative vs production)
- Story context travels with assets
- Changes sync bidirectionally
- Seamless "switch to Studio view"

---

## Core Value Propositions

| For | Value |
|-----|-------|
| **Filmmakers priced out of StudioBinder** | Professional pre-production at accessible pricing |
| **VP teams drowning in Notion** | 3D-native asset management with story context |
| **Creators with existing content** | Import and immediately work—no re-typing |
| **Those experiencing creator's fatigue** | AI handles consistency so you can stay creative |
| **Visual thinkers** | Assets-first organization, 3D viewer, node-based visualization |
| **Soft worldbuilders** | Creative companion that doesn't enforce structure |
| **Small teams** | Collaboration without per-seat fees |

---

## What We're NOT

- Not a World Anvil clone (text-first, BB codes, feature bloat)
- Not a database you populate manually (import-first, AI-assisted)
- Not StudioBinder (no enterprise pricing, no per-seat fees)
- Not ShotGrid (no hostile UX, no Pipeline TD required)
- Not trying to do everything (focused on creative → pre-production pipeline)
- Not AI-generates-your-content (AI organizes and tracks, you create)
- Not file storage (we're the metadata layer, not Dropbox)

---

## Competitive Positioning

> "The only pre-production tool where your assets live alongside your story."

| vs World Anvil/Campfire | vs StudioBinder/ShotGrid |
|-------------------------|--------------------------|
| Import-first, not forms-first | Affordable, not enterprise-priced |
| Soft worldbuilding default | No per-seat fees |
| Production export, not just prose | Creative development included |
| AI handles consistency | Story context (Lore Link) |
| 3D model viewer | Indie-friendly UX |
| **→ Studio integration** | **→ Worldbuilder integration** |

---

## Success Metrics

1. **Primary:** Users successfully go from messy ideas to production-ready docs
2. **Validation:** Paying customers in the $15-35/month range
3. **Retention:** Users prefer Vixio over their previous tool stack
4. **Growth:** Word-of-mouth in indie film and VP communities
5. **Integration usage:** Users who use both Worldbuilder and Studio
