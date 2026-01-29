# Product Roadmap

## Philosophy

Build for yourself first. Dogfood everything. Visual assets are the core. Extract value for others after it's proven useful.

---

## Phase 1: Foundation (MVP)

### Core Asset Structure
- Entity categories: Characters, Locations, Organizations, Events, Items, Rules, Stories
- **Visual asset focus** - Images/references attached to all entities
- Basic CRUD for all entities
- User authentication (Supabase Auth)
- Multi-world support

### Basic AI Integration
- AI World Chat - query your world
- Context-aware responses using world data

### Basic Export
- Plain text / Markdown
- PDF (basic formatting)

---

## Phase 2: Import & Soft Worldbuilding

### Import Feature (Central)

**Macro Import (World Bible)**
- Plain text paste/upload
- AI reads and comprehends content
- Identifies characters, locations, relationships
- Offers to extract entities OR just chat

**Micro Import (Character/Element)**
- Import individual character stories
- Import location descriptions
- AI integrates into existing world context

### Soft/Hard Toggle
- Setting for AI behavior
- Soft: Creative companion, builds on ideas
- Hard: Proactive consistency flagging

### Post-Import Flow
```
Import → AI reads → User chooses:
  ├── "Just Chat" (soft)
  └── "Extract & Organize" (structured)
```

---

## Phase 3: Visualization

### Node-Based Relationship Maps
- AI generates initial graph from content
- User can edit, expand, reorganize
- Click nodes to see asset details
- Drag to create new relationships

### Node-Based Timeline
- Events on temporal axis
- Connections show causality
- Zoom in/out on time periods

### Asset Views
- Card-based browsing for assets
- Visual-first presentation
- Generated from AI extraction

---

## Phase 4: Production Export

### Document Exports
- World Bible PDF (formatted)
- Character/Location briefs (production-ready)

### Screenplay Export
- PDF in screenplay format
- Fountain (.fountain) plain text screenplay
- AI converts narrative → screenplay format

### Shot List Generation
- AI-suggested shots from scenes
- Shot type, description, notes
- CSV/PDF export

---

## Phase 5: AI Storyboard Generation (Key Differentiator)

### AI-Generated Frames
- Generate storyboard images from shot descriptions
- AI knows your world (characters, locations, style)
- Consistent character appearances across frames

### Style Controls
- Visual style preferences (realistic, stylized, etc.)
- Character reference images guide consistency
- Location mood references

### Export Options
- Individual frames (PNG)
- Storyboard PDF (frames + descriptions)
- Animatic-ready sequence

---

## Future Phases (Post-MVP)

### Phase 6: Animation-Specific Features
- Exposure sheet (摄影表) generation
- Animation timing charts (动画律表)
- Background art requirement briefs
- Character design briefs for artists

### Phase 7: Advanced Production Integration
- Final Draft (.fdx) export
- MetaHuman character specs (JSON)
- Environment briefs for UE artists
- Integration with production software

### Phase 8: APAC Regional Versions

**Not just translation - separate regional products:**

| Version | Market | Data Center | Key Features |
|---------|--------|-------------|--------------|
| Vixio CN | China | Alibaba/Tencent Cloud | Simplified Chinese, WeChat, local compliance |
| Vixio JP | Japan | AWS Tokyo | Japanese, LINE, anime industry conventions |
| Vixio KR | Korea | AWS Seoul | Korean, KakaoTalk, webtoon templates |

**IP Asset Governance:**
- Dedicated data centers per region
- Assets never leave region unless exported
- Compliance with local data laws (PIPL, APPI, etc.)
- Clear data residency guarantees

**Regional customizations:**
- Local narrative templates (wuxia, xianxia, isekai, etc.)
- Regional app integrations (WeChat, LINE, KakaoTalk)
- Local payment methods
- UI/UX adapted to regional conventions

### Phase 9: Collaboration (Future)
- Real-time co-editing
- Task-based review workflows (@mentions)
- Version comparison tools
- Team workspaces
- Role-based permissions

### Phase 10: Mobile & Offline
- Progressive web app
- Offline mode with sync
- Mobile-optimized interface

### Phase 11: SaaS Validation
- Simple public version
- Free tier with reasonable limits
- Paid tier for full features
- Market validation

---

## Not Planned (Intentionally)

| Feature | Why Not |
|---------|---------|
| BB codes / complex formatting | That's the problem, not the solution |
| Mandatory structure | Kills soft worldbuilding |
| Public by default | Privacy first |
| Feature parity with World Anvil | Different approach entirely |
| Complex real-time collab (early) | Solve single-user first |

---

## Feature Priority Matrix

| Feature | Priority | Phase | Differentiator? |
|---------|----------|-------|-----------------|
| Asset management | Critical | 1 | Core |
| Import | Critical | 2 | Yes |
| AI chat | Critical | 1-2 | Yes |
| Node visualization | High | 3 | Yes |
| Screenplay export | High | 4 | Yes |
| AI storyboards | High | 5 | **Major** |
| Animation exports | Medium | 6 | Yes |
| **Regional versions (CN/JP/KR)** | Medium | 8 | **Yes (data residency)** |
| Real-time collab | Low | 9 | No |
| Mobile/offline | Low | 10 | No |

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-28 | Visual asset-driven core | Unifying differentiator across markets |
| 2026-01-28 | Soft worldbuilding default | Hard mode limits creativity |
| 2026-01-28 | Node-based visualization | Both relationships and timelines |
| 2026-01-28 | Import as central feature | Meet users where they are |
| 2026-01-28 | No explicit modes | AI can do both, user just asks |
| 2026-01-28 | Production export as differentiator | Gap in market - competitors stop at prose |
| 2026-01-28 | AI storyboard generation | No competitor offers this - major differentiator |
| 2026-01-28 | APAC animation market | Large opportunity, visual asset approach fits |
| 2026-01-28 | Real-time collab as future | Solve single-user first, complex to build |
| 2026-01-28 | Regional versions not translation | APAC needs separate products with data residency |
| 2026-01-28 | IP asset governance critical | Studios won't use tools storing IP outside jurisdiction |
