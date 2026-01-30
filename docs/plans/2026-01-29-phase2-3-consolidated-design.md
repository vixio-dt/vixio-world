# Phase 2+3 Consolidated Design

**Status:** Design approved, ready for implementation
**Date:** 2026-01-29

## Overview

Combining Phase 2 remaining items with Phase 3 for a complete, impressive product release.

## Scope

| Category | Features |
|----------|----------|
| **Relationships** | @mentions autocomplete, Interactive node graph |
| **Visualization** | Force-directed graph, filters by type, zoom/pan |
| **Export** | World Bible PDF, Markdown, JSON |
| **UX Polish** | Search, keyboard shortcuts, better navigation |

---

## Section 1: @Mentions System

### User Flow
1. User edits a text block in any entity form
2. Types `@` anywhere in the text
3. Dropdown appears below cursor with entity search
4. Shows entities grouped by type (Characters, Locations, etc.)
5. User types to filter, arrow keys to navigate, Enter to select
6. Mention inserted as `@EntityName` with hidden ID reference
7. On save, mentions extracted and stored in `entity_mentions` table

### Display in Read Mode
- Mentions render as styled links: `@Queen Aria` with entity type icon
- Click navigates to that entity's detail page
- Hover shows mini preview card (name, type, first line of description)

### Technical Approach
- `MentionInput` component wrapping textarea with overlay dropdown
- Debounced search across all entity types in current world
- Store as `@[entity_type:entity_id:display_name]` in text, render cleanly

### Data Flow
```
User types @ → Search API → Results dropdown → Select → Insert marker
On save → Parse markers → Upsert entity_mentions rows
```

---

## Section 2: Interactive Relationship Graph

### Where it lives
- New route: `/graph` - full-page graph view of entire world
- Also embedded in entity detail pages as "Connections" tab/section

### Graph Features
- Force-directed layout using `react-force-graph-2d` (lightweight, performant)
- Nodes = entities, colored by type (same colors as entity cards)
- Edges = relationships (mentions, explicit links)
- Click node → navigate to entity detail page
- Hover node → tooltip with entity name, type, brief description

### Controls
- Filter toggles by entity type (show/hide Characters, Locations, etc.)
- Search box to highlight/focus specific entity
- Zoom slider + mouse wheel zoom
- "Center on" button to reset view
- Fullscreen toggle

### Visual Design
- Dark background (works well for graphs)
- Nodes: circles with entity type icons inside
- Node size based on connection count (more connections = larger)
- Edges: subtle lines, thicker for stronger relationships
- Selected node: highlighted ring, connected nodes emphasized

### Data Structure
```typescript
interface GraphNode {
  id: string;
  name: string;
  type: EntityType;
  connectionCount: number;
}

interface GraphEdge {
  source: string;
  target: string;
  type: 'mention' | 'explicit';
}
```

### API
- `GET /api/graph?worldId=xxx` returns nodes and edges for the world
- Server action fetches all entities + entity_mentions, transforms to graph format

---

## Section 3: Export System

### Export Formats

| Format | Content | Use Case |
|--------|---------|----------|
| **World Bible PDF** | All entities, formatted with headers, images, story context highlighted | Share with collaborators, print |
| **Markdown** | Clean .md files per entity or combined | Import to Notion/Obsidian |
| **JSON** | Raw data export | Backup, migration, API use |

### User Flow
1. Export button in sidebar (bottom nav, next to AI Chat)
2. `/export` page with format selection
3. Options: "All entities" or select specific types
4. Generate button → download file

### Technical Approach
- Server action generates export on demand
- PDF: Use `@react-pdf/renderer` for styled output
- Markdown: Template strings, zip multiple files
- JSON: Direct serialization of entities

### PDF Structure
- Cover page with world name, date
- Table of contents
- Section per entity type
- Each entity: name, type badge, story context (highlighted), fields, content blocks

---

## Section 4: UX Polish

### Global Search
- Keyboard shortcut: `Cmd/Ctrl + K` opens search modal
- Searches across all entity types in current world
- Results grouped by type with icons
- Recent searches shown when empty
- Arrow keys navigate, Enter to go to entity

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open search |
| `Cmd/Ctrl + N` | New entity (shows type picker) |
| `Cmd/Ctrl + G` | Go to graph view |
| `Cmd/Ctrl + E` | Export |
| `Escape` | Close modals/dropdowns |

### Navigation Improvements
- Breadcrumbs on all pages: `World > Characters > Queen Aria`
- "Back to list" links more prominent
- Sidebar highlights current section
- Quick-add button in header for new entities

### Empty State Improvements
- First-time user sees guided onboarding
- Empty entity lists show "Start by importing content or creating manually"
- Link to `/import` prominently featured

### Loading & Feedback
- Skeleton loaders for lists and detail pages
- Toast notifications for save/delete actions
- Optimistic UI updates where possible

---

## Implementation Order

1. **@mentions system** - Core relationship feature
2. **Relationship graph** - Visual representation
3. **Global search** - UX essential
4. **Export system** - Complete the workflow
5. **UX polish** - Keyboard shortcuts, breadcrumbs, loading states

## Dependencies

- `react-force-graph-2d` - Graph visualization
- `@react-pdf/renderer` - PDF generation
- `jszip` - Markdown multi-file export
- `cmdk` or custom - Command palette for search

## Next Steps

1. Create implementation plan using `writing-plans` skill
2. Implement in order above
3. Test each feature before moving to next
