# Product Roadmap

## Philosophy

Build for yourself first. Dogfood everything. Focus on the **creative-to-production pipeline**. The moat isn't import - it's the integration between Worldbuilder and Studio.

**Key insight from strategic planning:** Import is a wedge (gets users in), not a moat (keeps them). The real differentiator is the Lore Link - connecting assets to their story context through Worldbuilder → Studio integration.

---

## Product Architecture

```
Phase 1-3: Worldbuilder MVP
Phase 4-5: Studio MVP  
Phase 6+:  Integration & Expansion
```

| Product | Focus | Target Users |
|---------|-------|--------------|
| **Worldbuilder** | Creative development, story, assets | Writers, directors, concept artists |
| **Studio** | Production planning, workflows | Producers, VAD leads, production teams |

---

## Phase 1: Foundation (MVP) ✅ Complete

**Goal:** Working app with auth + Characters CRUD. Validates tech stack.

### Core Structure
- [x] User authentication (Supabase Auth)
- [x] Multi-world support
- [x] Characters: full CRUD (list, create, view, edit, delete)
- [x] Basic design system
- [x] Responsive layout

**Status:** Implementation complete. See [docs/current-sprint.md](../docs/current-sprint.md).

---

## Phase 2: Worldbuilder Core ✅ Complete

**Goal:** Typed entity system with 3D support and AI-assisted import.

### Entity System
- [x] Entity types: Character, Location, Item, Organization, Story, Rule, Event
- [x] Entity pages with freeform content (text, images, files)
- [x] Relationship system (@mentions, explicit links)
- [x] Interactive force-directed graph showing connections

### 3D Model Viewer
- [x] External embed support (Sketchfab, Tripo AI share links)
- [x] Rotatable, zoomable preview in entity cards
- [ ] Upload .glb/.gltf files (model-viewer web component) - deferred to v1.5
- [ ] File storage setup (Supabase Storage) - deferred to v1.5

*Why 3D in MVP:* Users are already generating 3D with Tripo, Hunyuan, Meshy. Worldbuilder must support this from day one.

### AI-Assisted Import
- [x] Plain text / markdown paste
- [x] AI suggests entity extraction (user confirms)
- [x] Preview and select entities before creation
- [x] Cross-reference with existing world entities

### AI World Chat
- [x] Natural language queries about world
- [x] Special commands (/status, /gaps, /connections, /check, /suggest)
- [x] Session persistence per world
- [x] Template world for new users ("Explore Demo World")

### Story Context (Lore Link Foundation)
- [x] Each entity has a "Story Context" field
- [x] Free-form text describing narrative purpose
- [x] Related entities automatically linked via @mentions
- [ ] Scene/story association - deferred to Studio

**Status:** Complete. See [docs/current-sprint.md](../docs/current-sprint.md).

---

## Phase 3: Worldbuilder Polish ✅ Complete

**Goal:** Complete creative workspace with visualization and export basics.

### Visual Asset Graph
- [x] Interactive force-directed relationship map
- [x] Filter by entity type
- [x] Search to highlight entities
- [x] Zoom/pan navigation
- [ ] Timeline view for story events - deferred to v1.5

### Export Basics
- [x] Markdown export (World Bible document)
- [x] JSON data export
- [ ] World Bible PDF (formatted) - deferred to v1.5
- [ ] Character/Location briefs - deferred to v1.5

### UX Polish
- [x] Keyboard shortcuts (Cmd+K search, Ctrl+G graph, Ctrl+E export)
- [x] Search across all entities (Command Palette)
- [x] Breadcrumbs navigation
- [x] Toast notifications
- [x] Loading skeletons
- [ ] Drag-and-drop entity reordering - deferred
- [ ] Bulk operations - deferred

**Status:** Complete. See [docs/current-sprint.md](../docs/current-sprint.md).

---

## Phase 4: Studio MVP (Production Planning)

**Goal:** Asset lifecycle management for production teams.

### Status Pipeline
- [ ] Customizable workflow stages per entity type
- [ ] Default: Concept → Approved → In Production → Complete
- [ ] VP mode: Concept → Modeling → Texturing → Rigging → In-Engine
- [ ] Animation mode: Design → Approved → Rigged → Animated
- [ ] Visual kanban board view

### Production Metadata
- [ ] Assigned to (person/department)
- [ ] Due date
- [ ] Version history
- [ ] Technical specs field (for VP: poly count, texture res, etc.)
- [ ] Dependencies (blocks/blocked by)

### The Lore Link Integration
- [ ] Story context from Worldbuilder visible in Studio
- [ ] Two views of same data (creative vs production)
- [ ] Changes sync bidirectionally
- [ ] "Switch to Studio View" toggle

### Basic VP Support
- [ ] Asset status visibility (Concept → In-Engine)
- [ ] Technical metadata fields
- [ ] Dependency tracking
- [ ] Approval workflow

---

## Phase 5: Studio Production Features

**Goal:** Production-ready export and collaboration.

### Production Export
- [ ] Screenplay export (PDF, Fountain, FDX)
- [ ] Shot lists (CSV, PDF)
- [ ] Schedule CSV (StudioBinder/Celtx compatible)
- [ ] Character/Location production briefs

### Collaboration
- [ ] Creator vs Collaborator roles
- [ ] Commenting and suggestions
- [ ] Viewer links (no account required)
- [ ] Activity feed

### Integrations
- [ ] Google Drive import
- [ ] Notion/Obsidian export compatibility
- [ ] Arc Studio/Final Draft import

---

## Phase 6: VP-Specific Features

**Goal:** Full support for Virtual Production workflows.

### VP Asset Lifecycle
- [ ] Detailed pipeline: Concept → Model → Texture → Rig → In-Engine → Approved
- [ ] Technical metadata tracking (poly count, texture resolution, render status)
- [ ] Version comparison (history slider)
- [ ] "Greenlight" approval gating

### VP Documentation
- [ ] LED wall content briefs
- [ ] Environment asset specs
- [ ] HDRI requirements
- [ ] Real-time engine specifications

### AI 3D Generation (v1.5)
- [ ] Tripo AI API integration
- [ ] Meshy API integration
- [ ] Generate 3D from concept art in-app
- [ ] Credit/billing system for generations

---

## Future Phases

### Phase 7: AI-Assisted Storyboards

**Note:** AI image generation is **commoditized**. Table stakes, not a moat.

- [ ] Generate storyboard images from shot descriptions
- [ ] Style consistency controls
- [ ] Character/location reference images
- [ ] Export as frames, PDF, or animatic-ready sequence

### Phase 8: Animation-Specific Features (APAC Prep)

Requires APAC regional infrastructure to be valuable.

- [ ] Exposure sheet (摄影表) generation
- [ ] Animation timing charts (动画律表)
- [ ] Background art requirement briefs
- [ ] Character design briefs for artists

### Phase 9: APAC Regional Versions

**Not just translation - separate regional products.**

| Version | Market | Data Center | Key Features |
|---------|--------|-------------|--------------|
| Vixio CN | China | Alibaba/Tencent Cloud | Simplified Chinese, WeChat, PIPL compliance |
| Vixio JP | Japan | AWS Tokyo | Japanese, LINE, anime industry conventions |
| Vixio KR | Korea | AWS Seoul | Korean, KakaoTalk, webtoon templates |

### Phase 10: Advanced Production Integration

- [ ] MetaHuman character specs (JSON)
- [ ] Unreal Engine asset briefs
- [ ] Integration with production software APIs

### Phase 11: Mobile & Offline

- [ ] Progressive web app
- [ ] Offline mode with sync
- [ ] Mobile-optimized interface

---

## Not Planned (Intentionally)

| Feature | Why Not |
|---------|---------|
| BB codes / complex formatting | That's the problem, not the solution |
| Mandatory structure | Kills soft worldbuilding; validated by research |
| Public by default | Privacy first |
| Feature parity with World Anvil | Different approach entirely |
| Complex real-time collab (early) | Solve single-user first |
| Full production management | Focus on creative → pre-production; let StudioBinder handle call sheets |
| Per-seat pricing | Competitive wedge is "no per-seat fees" |
| File storage (heavy files) | Be the metadata layer, not Dropbox |

---

## Feature Priority Matrix (Research-Validated)

| Feature | Priority | Phase | Differentiator? | Research Support |
|---------|----------|-------|-----------------|------------------|
| **Typed entity system** | Critical | 2 | Yes | Soft structure approach |
| **3D model viewer** | Critical | 2 | **Yes** | Tripo/Hunyuan generation is common |
| **AI-assisted import** | Critical | 2 | Partial | Wedge, not moat |
| **Story context (Lore Link)** | Critical | 2-4 | **Yes** | Unique differentiator |
| **Visual asset graph** | High | 3 | Partial | Asset-driven positioning |
| **Status pipeline (Studio)** | High | 4 | Yes | Production workflow |
| **VP asset lifecycle** | High | 4-6 | **Yes** | Underserved market |
| **Production export** | High | 5 | Yes | Gap in market |
| **Collaboration** | Medium | 5 | Yes | No per-seat is wedge |
| AI storyboards | Medium | 7 | **No** | Commoditized |
| Animation exports | Low | 8 | Future | Requires APAC infrastructure |
| Regional versions | Low | 9 | Future | High barriers |
| Mobile/offline | Low | 11 | No | Not critical for core users |

---

## Target Market Alignment

| Phase | Product | Primary Market | Secondary Market |
|-------|---------|----------------|------------------|
| 1-3 | Worldbuilder | Writers, worldbuilders | Directors, concept artists |
| 4-5 | Studio | Small production teams | Indie VP creators |
| 6+ | Both | Larger productions, VP teams | Animation studios (APAC) |

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-28 | Visual asset-driven core | Unifying differentiator across markets |
| 2026-01-28 | Soft worldbuilding default | Hard mode limits creativity |
| 2026-01-28 | Import as central feature | Meet users where they are |
| 2026-01-28 | Production export as differentiator | Gap in market—competitors stop at prose |
| 2026-01-28 | APAC as future phase | High barriers, needs infrastructure |
| 2026-01-29 | AI storyboards demoted | Commoditized—not a differentiator |
| 2026-01-29 | Film/video-first positioning | Research validated higher WTP and clearer wedge |
| 2026-01-29 | Core + Collaborators pricing | Differentiates from StudioBinder per-seat model |
| 2026-01-29 | Free tier for writers | Captures secondary market without revenue dilution |
| 2026-01-29 | No production management | Focus on idea→script→export; let StudioBinder handle call sheets |
| 2026-01-29 | "Professional pre-production, accessible pricing" | Positioning validated by research |
| 2026-01-29 | **Product split: Worldbuilder + Studio** | Clearer market positioning, natural upsell path |
| 2026-01-29 | **Virtual Production as production style** | VP inverts traditional workflow; high-pain market |
| 2026-01-29 | **3D viewer in MVP (Option B)** | .glb upload + embeds; AI 3D gen is now common |
| 2026-01-29 | **Lore Link as core differentiator** | Story context with assets; ShotGrid/Kitsu lack this |
| 2026-01-29 | **Soft structure approach** | Typed entities with freeform content; not pure canvas |
| 2026-01-29 | **Import is wedge, not moat** | Integration is the real moat; import gets users in door |
