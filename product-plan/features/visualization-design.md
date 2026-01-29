# Feature Design: Node-Based Visualization

## Overview

Visual representation of world elements and their relationships. Uses node-based diagrams for both **relationship maps** and **timelines**.

## Two Visualization Types

### 1. Relationship Maps
Shows connections between entities (characters, locations, organizations, etc.)

```
        ┌─────────┐
        │  Aria   │
        │ (Queen) │
        └────┬────┘
             │ rules
             ▼
        ┌─────────┐         ┌─────────┐
        │Ironhold │────────▶│ Kael    │
        │(Capital)│ guards  │(Ranger) │
        └────┬────┘         └────┬────┘
             │                   │
             │ enemy of          │ loves
             ▼                   ▼
        ┌─────────┐         ┌─────────┐
        │The Veil │         │  Mira   │
        │(Forest) │         │(Scholar)│
        └─────────┘         └─────────┘
```

### 2. Timeline Visualization
Shows events in temporal sequence with causal connections.

```
──┬────────────┬────────────┬────────────┬────────────┬──
  │            │            │            │            │
  ▼            ▼            ▼            ▼            ▼
┌─────┐    ┌─────┐     ┌─────┐     ┌─────┐     ┌─────┐
│Birth│───▶│Exile│────▶│ War │────▶│Peace│────▶│Death│
│Aria │    │Kael │     │Begin│     │Treaty│    │King │
└─────┘    └─────┘     └──┬──┘     └─────┘     └─────┘
                          │
                          │ causes
                          ▼
                     ┌─────────┐
                     │Ironhold │
                     │ Falls   │
                     └─────────┘
```

## Core Interactions

### Viewing
- Pan and zoom across the graph
- Click node to see entity details
- Hover for quick preview
- Filter by entity type (show only characters, etc.)

### Editing
- Drag nodes to reorganize
- Draw connections between nodes
- Edit relationship labels
- Create new nodes directly on canvas

### AI-Assisted
- "Show me all relationships for Aria"
- "Generate timeline from my world bible"
- "What's missing in this relationship map?"
- "Find characters who haven't been connected to anything"

## Generation Modes

### From Existing Entities
If user chose "Extract & Organize" during import:
- Entities already exist as structured data
- AI maps relationships based on entity data
- Initial layout generated automatically

### From Raw Content
If user stayed in "Just Chat" mode:
- AI generates visualization on demand
- "Show me a relationship map" triggers extraction
- Can be temporary (just for viewing) or saved

### Manual Creation
- Start with blank canvas
- Add nodes manually
- Draw relationships
- AI can suggest completions

## Node Types

### Entity Nodes
```
┌─────────────┐
│ [icon]      │
│  Name       │
│  (type)     │
│  brief desc │
└─────────────┘
```

Icons by type:
- 👤 Character
- 📍 Location
- 🏛️ Organization
- 📅 Event
- 🔮 Item
- 📜 Rule

### Relationship Edges
- Labeled connections ("rules", "loves", "enemy of")
- Directional or bidirectional
- Strength/importance (line thickness)
- Type (family, political, romantic, etc.)

## Timeline-Specific Features

### Time Axis
- Zoomable (years → months → days)
- Supports fuzzy dates ("early reign", "before the war")
- Multiple parallel tracks (different storylines)

### Causality
- Show cause/effect relationships between events
- "This led to that"
- AI can suggest missing causal links

### Filters
- Show events for specific character
- Show events in specific location
- Show events of specific type (battles, births, etc.)

## Technical Considerations

### Libraries to Consider
- React Flow (recommended for React)
- D3.js (more control, more complexity)
- Cytoscape.js (good for large graphs)
- vis.js (simpler, good enough for MVP)

### Performance
- Lazy loading for large graphs
- Clustering for dense areas
- Level-of-detail (show less detail when zoomed out)

### Persistence
- Save node positions
- Save zoom/pan state
- Export as image (PNG, SVG)

## User Stories

1. **As a writer**, I want to see all my characters and their relationships so I can spot missing connections.

2. **As a soft worldbuilder**, I want to generate a quick visualization without creating structured entities first.

3. **As a visual thinker**, I want to build my world by drawing nodes and connections, not filling forms.

4. **As a hard worldbuilder**, I want to see my timeline and check for inconsistencies in event ordering.

5. **As a storyteller**, I want to trace a character's journey through locations over time.

## MVP Scope

### Phase 1 (Basic)
- Simple relationship map
- Manual node creation
- Basic edge drawing
- Click to view entity

### Phase 2 (AI-Assisted)
- Generate from imported content
- AI suggests relationships
- Auto-layout improvements

### Phase 3 (Timeline)
- Temporal axis
- Event nodes
- Causality edges
- Zoom on time

### Phase 4 (Polish)
- Export to image
- Multiple views per world
- Filtering and search
- Mobile touch support
