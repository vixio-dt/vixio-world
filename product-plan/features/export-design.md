# Feature Design: Export

## Overview

Export is where Vixio bridges the gap between **creative worldbuilding** and **production-ready output**. Most competitors stop at prose/document export. Vixio can go further.

## 5 Gaps We're Targeting

| Gap | What's Missing | How Vixio Solves It |
|-----|----------------|---------------------|
| **No Screenplay Formatting** | Can't auto-format dialogue, action lines, scene headings | AI converts narrative → industry-standard screenplay |
| **No Shot Planning** | No camera direction, shot types, angle specifications | AI analyzes scenes, suggests shot types and compositions |
| **No Production Integration** | Missing connectivity to shot lists, call sheets, storyboards | Direct export to production formats (CSV, PDF, templates) |
| **Limited Visual Tools** | Basic text/picture, no storyboard creation | Node visualization + **AI-generated storyboard frames** |
| **Workflow Disconnection** | Worldbuilding and screenwriting are separate processes | Single flow: import world → develop story → export production-ready |

## Market Gap

| Competitor | Best Export |
|------------|-------------|
| World Anvil | HTML, PDF (via print) |
| Campfire | DOCX, PDF, RTF |
| Plottr | MS Word |
| **Clapperbie** | Screenplay, storyboard, shot lists ← Only one |

**Opportunity**: Be the worldbuilding tool that exports directly to production formats.

## Export Categories

### 1. Document Exports (Basic)

For writers and general use.

| Format | Use Case |
|--------|----------|
| Plain Text / Markdown | Maximum compatibility, version control |
| PDF | Sharing, printing |
| DOCX | Editing in Word/Docs |
| World Bible (formatted) | Complete world documentation |

### 2. Screenplay Exports (Differentiator)

Industry-standard screenplay formatting.

| Format | Description |
|--------|-------------|
| PDF (screenplay format) | Industry sharing standard |
| Fountain (.fountain) | Plain text screenplay format |
| Final Draft (.fdx) | Professional software format |

**What this means**:
- Proper screenplay formatting (scene headings, action, dialogue, transitions)
- Export stories/scenes as properly formatted scripts
- AI can help convert narrative to screenplay format

### 3. Production Exports (Differentiator)

For filmmakers and production teams.

| Export | Contents |
|--------|----------|
| **Shot List** | Scene, shot number, shot type, description, notes |
| **Scene Breakdown** | Characters, locations, props, wardrobe per scene |
| **Storyboard Template** | Frame placeholders with shot descriptions |
| **Character Brief** | Physical description, costume notes, reference images |
| **Location Brief** | Description, mood, reference images, technical notes |
| **Props List** | All items mentioned, categorized by scene |

### 4. AI-Generated Storyboards (Key Differentiator)

Generate visual storyboard frames directly from scene/shot descriptions.

**How it works:**
```
Scene description → AI understands context → Image generation → Storyboard frame
```

**Example flow:**
1. User has scene: "Aria enters the throne room, crowd falls silent"
2. AI generates shot list with descriptions
3. For each shot, AI generates a storyboard frame image
4. Export as storyboard PDF with frames + descriptions

**What makes this powerful:**
- AI knows your world (characters, locations, visual style)
- Consistent character appearances across frames
- Reference images can guide style
- Much faster than manual storyboarding or hiring artist

**Output formats:**
| Format | Use |
|--------|-----|
| Individual frames (PNG) | For editing, import to other tools |
| Storyboard PDF | Traditional storyboard layout with frames + notes |
| Animatic-ready | Sequenced images for video timeline |

**Style consistency:**
- User can set visual style preferences (realistic, anime, noir, etc.)
- Character reference images maintain consistency
- Location style guides for environment shots

### 5. Visualization Exports

From the node-based visualization feature.

| Export | Format |
|--------|--------|
| Relationship Map | PNG, SVG, PDF |
| Timeline | PNG, SVG, PDF |
| Character Family Tree | PNG, SVG, PDF |

## Export Flows

### Story → Screenplay

```
┌─────────────────────────────────────────────┐
│  EXPORT: Story as Screenplay                │
│                                              │
│  Story: "The Fall of Ironhold"              │
│  Scenes: 12                                  │
│                                              │
│  Format:                                     │
│  ○ PDF (screenplay)                         │
│  ○ Fountain (.fountain)                     │
│  ○ Final Draft (.fdx)                       │
│                                              │
│  Options:                                    │
│  ☑ Include scene descriptions               │
│  ☑ Include character introductions          │
│  ☐ Include shot suggestions                 │
│                                              │
│  [ Export ]                                  │
└─────────────────────────────────────────────┘
```

### Scene → Shot List

```
┌─────────────────────────────────────────────┐
│  EXPORT: Shot List                           │
│                                              │
│  Scene: "Aria's Coronation"                 │
│                                              │
│  AI-generated shots:                         │
│  ┌────┬──────────┬─────────────────────┐   │
│  │ #  │ Type     │ Description         │   │
│  ├────┼──────────┼─────────────────────┤   │
│  │ 1  │ Wide     │ Throne room, crowd  │   │
│  │ 2  │ Medium   │ Aria approaches     │   │
│  │ 3  │ Close-up │ Crown placed        │   │
│  │ 4  │ Reaction │ Kael watching       │   │
│  └────┴──────────┴─────────────────────┘   │
│                                              │
│  [ Edit ] [ Add Shot ] [ Export CSV/PDF ]   │
└─────────────────────────────────────────────┘
```

### World Bible → Production Package

```
┌─────────────────────────────────────────────┐
│  EXPORT: Production Package                  │
│                                              │
│  Include:                                    │
│  ☑ Character Briefs (5 characters)          │
│  ☑ Location Briefs (8 locations)            │
│  ☑ Props List (23 items)                    │
│  ☑ World Rules Summary                      │
│  ☐ Full World Bible                         │
│                                              │
│  Format:                                     │
│  ○ PDF (single document)                    │
│  ○ PDF (separate files)                     │
│  ○ ZIP (organized folders)                  │
│                                              │
│  [ Export ]                                  │
└─────────────────────────────────────────────┘
```

## AI-Assisted Export

### Narrative → Screenplay Conversion

User has narrative prose. AI converts to screenplay format:

**Input (narrative)**:
> Aria walked into the throne room, her footsteps echoing against the marble floor. The crowd fell silent. She could feel Kael's eyes on her from across the room.

**Output (screenplay)**:
```
INT. THRONE ROOM - DAY

Aria enters. Her footsteps ECHO against marble. The CROWD falls silent.

ACROSS THE ROOM - Kael watches her intently.
```

### Scene → Shot Suggestions

AI analyzes scene content and suggests shots:

- Identifies key moments
- Suggests shot types (wide, medium, close-up)
- Notes important details to capture
- Flags continuity considerations

### Character → Brief Generation

AI compiles character data into production-ready brief:

- Physical description
- Key costume elements
- Mannerisms and quirks
- Voice/accent notes
- Reference image suggestions

## Production Integration (Future)

### Unreal Engine / MetaHuman

For virtual production workflows:

| Export | Use |
|--------|-----|
| MetaHuman spec | Character physical attributes for MetaHuman creator |
| Environment brief | Location details for environment artists |
| Asset list | Props and items needed in scene |

### File Formats

| Target | Format |
|--------|--------|
| MetaHuman | JSON with facial parameters |
| USD/USDZ | Universal Scene Description |
| FBX notes | Accompanying documentation |

## Roadmap

### Phase 1 (MVP)
- Plain text / Markdown export
- PDF (basic formatting)
- Single entity export

### Phase 2 (Production Basics)
- Screenplay PDF export
- Fountain format
- Character/Location briefs

### Phase 3 (Full Production)
- Shot list generation
- Scene breakdowns
- Production package export

### Phase 4 (AI Storyboards)
- AI-generated storyboard frames from shot descriptions
- Style consistency controls
- Character/location reference image integration
- Storyboard PDF export

### Phase 5 (Integration)
- Final Draft format
- MetaHuman specs
- Animatic-ready export

### Phase 6 (Animation-Specific - Future)
- Exposure sheet (摄影表) generation
- Animation timing charts (动画律表)
- Background art requirement briefs
- Character design briefs for artists
- APAC localization (Chinese/Japanese/Korean)

### Phase 7+ (Advanced - Future)
- Real-time collaboration on exports
- Version comparison for production docs
- Integration with animation software
- Regional app integrations (WeChat, LINE)

## Competitive Positioning

| Feature | World Anvil | Campfire | Clapperbie | Vixio |
|---------|-------------|----------|------------|-------|
| Basic export | ✅ | ✅ | ✅ | ✅ |
| Screenplay | ❌ | ❌ | ✅ | ✅ (planned) |
| Shot list | ❌ | ❌ | ✅ | ✅ (planned) |
| AI conversion | ❌ | ❌ | ❌ | ✅ |
| Production package | ❌ | ❌ | ✅ | ✅ (planned) |
| **AI storyboard generation** | ❌ | ❌ | ❌ | ✅ (planned) |

**Vixio differentiators**:

1. **AI-generated storyboards** - No competitor does this. Generate visual frames from scene descriptions.
2. **AI-assisted conversion** - Narrative → screenplay, scene → shot list
3. **World context** - AI knows your characters, locations, visual style
4. **Consistent visuals** - Character/location reference images guide generation

Clapperbie does production export, but doesn't have:
- AI image generation for storyboards
- AI that understands world context
- Soft/hard worldbuilding modes
- Import-first workflow
