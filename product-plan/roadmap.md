# Product Roadmap

## Philosophy

Build for yourself first. Dogfood everything. Focus on the **idea-to-production pipeline**. Extract value for others after it's proven useful.

**Key insight from research:** The gap between "messy idea" and "production-ready" is underserved. Worldbuilding tools stop at prose. Production tools start after the script. We bridge this gap.

---

## Phase 1: Foundation (MVP) ✅ In Progress

**Goal:** Working app with auth + Characters CRUD. Validates tech stack.

### Core Structure
- [x] User authentication (Supabase Auth)
- [x] Multi-world support
- [x] Characters: full CRUD (list, create, view, edit, delete)
- [x] Basic design system
- [x] Responsive layout

### Tech Stack
- Next.js 15 (App Router)
- TypeScript + Tailwind CSS v4
- Supabase (PostgreSQL, Auth)
- Vercel deployment

**Status:** Implementation complete. See [docs/current-sprint.md](../docs/current-sprint.md).

---

## Phase 2: Import & AI Organization (Critical Differentiator)

**Goal:** "Paste your messy docs, AI figures it out." This is the central value proposition.

### Import Feature

**Macro Import (World Bible)**
- Plain text paste/upload
- AI reads and comprehends content
- Identifies characters, locations, relationships
- User chooses: "Just Chat" OR "Extract & Organize"

**Micro Import (Single Element)**
- Import individual character backstories
- Import location descriptions
- AI integrates into existing world context

### AI-Powered Organization
- Entity extraction (characters, locations, props, events)
- Relationship mapping
- Timeline detection
- Consistency tracking (passive, on-demand)

### Post-Import Flow
```
Import → AI reads → User chooses:
  ├── "Just Chat" (stay free-form, explore ideas)
  └── "Extract & Organize" (create structured entities)
```

**Why this matters:** Most tools require manual form-filling. Import-first is differentiated and validated by research.

---

## Phase 3: Visual Asset Graph

**Goal:** Characters, locations, props as the organizing unit—not wiki pages.

### Entity System
- Entity pages with images, descriptions, relationships
- Tags and custom attributes
- Cross-references between entities

### Visualization
- Simple visual graph showing connections
- Relationship maps (who knows who, where things happened)
- Timeline view for story events

### Asset-Driven Views
- Card-based browsing
- Visual-first presentation
- Filter by type, tag, timeline

---

## Phase 4: Pre-Production Export (Key Differentiator)

**Goal:** Bridge the gap between creative development and production.

### Document Exports
- World Bible PDF (formatted)
- Character briefs (production-ready)
- Location briefs (production-ready)

### Screenplay Export
- PDF in screenplay format
- Fountain (.fountain) plain text
- Final Draft (.fdx) format
- AI converts narrative → screenplay format

### Shot List Generation
- AI-suggested shots from scenes
- Shot type, description, notes
- CSV/PDF export
- Compatible with StudioBinder/Celtx import

**Why this matters:** Worldbuilding tools stop at prose. Production tools start after the script. We bridge this gap.

---

## Phase 5: Collaboration & Polish

**Goal:** Teams can work together without per-seat fee friction.

### Collaboration Features
- Creator vs Collaborator roles
- Commenting and suggestions
- Invite collaborators without per-seat penalty
- Viewer links (no account required)

### Consistency Assistant
- On-demand contradiction checks
- Per-asset "canon summary" auto-generated
- Soft→hard worldbuilding toggle

### Integrations
- Google Drive import
- Notion/Obsidian export compatibility
- Arc Studio/Final Draft import

---

## Future Phases

### Phase 6: AI-Assisted Storyboards

**Note:** AI image generation is now **commoditized** (Midjourney, DALL-E, etc.). This is table stakes, not a moat. Build it, but don't position as a differentiator.

- Generate storyboard images from shot descriptions
- Style consistency controls
- Character/location reference images
- Export as frames, PDF, or animatic-ready sequence

### Phase 7: Animation-Specific Features (APAC Prep)

Requires APAC regional infrastructure to be valuable.

- Exposure sheet (摄影表) generation
- Animation timing charts (动画律表)
- Background art requirement briefs
- Character design briefs for artists

### Phase 8: APAC Regional Versions

**Not just translation - separate regional products.**

| Version | Market | Data Center | Key Features |
|---------|--------|-------------|--------------|
| Vixio CN | China | Alibaba/Tencent Cloud | Simplified Chinese, WeChat, PIPL compliance |
| Vixio JP | Japan | AWS Tokyo | Japanese, LINE, anime industry conventions |
| Vixio KR | Korea | AWS Seoul | Korean, KakaoTalk, webtoon templates |

**Prerequisites:**
- Architecture supports multi-region deployment
- Legal/compliance research complete
- Local partnerships established

### Phase 9: Advanced Production Integration

- MetaHuman character specs (JSON)
- Environment briefs for UE artists
- Integration with production software APIs

### Phase 10: Mobile & Offline

- Progressive web app
- Offline mode with sync
- Mobile-optimized interface

---

## Not Planned (Intentionally)

| Feature | Why Not |
|---------|---------|
| BB codes / complex formatting | That's the problem, not the solution |
| Mandatory structure | Kills soft worldbuilding; validated by research |
| Public by default | Privacy first |
| Feature parity with World Anvil | Different approach entirely |
| Complex real-time collab (early) | Solve single-user first |
| Full production management | Let StudioBinder/Celtx handle call sheets, scheduling |
| Per-seat pricing | Competitive wedge is "no per-seat fees" |

---

## Feature Priority Matrix (Research-Validated)

| Feature | Priority | Phase | Differentiator? | Research Support |
|---------|----------|-------|-----------------|------------------|
| **Import-first** | Critical | 2 | **Yes** | High demand, clearly differentiated |
| **Visual asset graph** | Critical | 3 | Yes | Asset-driven is unique positioning |
| **Pre-production export** | Critical | 4 | **Yes** | Gap in market validated |
| **Soft worldbuilding** | Critical | 2-3 | Yes | Pain point validated (creator's fatigue) |
| **Collaboration** | High | 5 | Yes | No per-seat is competitive wedge |
| AI chat | High | 2 | Partial | RAG is common; context-awareness helps |
| Node visualization | Medium | 3 | Partial | Nice to have, not unique |
| AI storyboards | Medium | 6 | **No** | Commoditized |
| Animation exports | Low | 7-8 | Future | Requires APAC infrastructure |
| Regional versions | Low | 8 | Future | High barriers, long-term play |
| Mobile/offline | Low | 10 | No | Not critical for core users |

---

## Target Market Alignment

| Phase | Primary Market | Secondary Market |
|-------|----------------|------------------|
| 1-3 | Solo creators, screenwriters | Writers, worldbuilders |
| 4-5 | Small production teams | Web series creators |
| 6-8 | Larger productions | Animation studios (APAC) |

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
