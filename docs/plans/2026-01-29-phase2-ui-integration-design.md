# Phase 2 UI Integration Design

## Overview

Wire the new schema fields (`story_context`, `content_blocks`, 3D models) into the existing entity pages. Focus on simplicity - users should feel the system just works.

## Scope

### In Scope
1. **Story Context field** - Simple textarea on forms, display on detail pages
2. **Content Blocks Display** - Render existing blocks on entity detail pages
3. **Content Blocks Editor** - Basic add/edit for text and model blocks
4. **3D Model Embeds** - Use existing ModelEmbed component for model blocks

### Deferred to Phase 3 (Polish)
- @mentions autocomplete (complex UX)
- Media block uploads (needs storage setup)
- Content block reordering (drag-and-drop)

## Design Decisions

### 1. Story Context Field

**What it is:** A "Lore Link" field describing the narrative purpose of an entity.

**Implementation:**
- Add `Textarea` to `CharacterForm` with label "Story Context" 
- Placeholder: "How does this character fit into your story? What role do they play narratively?"
- Display on detail page as a highlighted card at the top (it's important narrative context)

### 2. Content Blocks Display

**Types:**
- `text` - Render as paragraph with whitespace preserved
- `media` - Render as image (URL in content field)
- `model` - Render using `ModelEmbed` component

**Display order:** Sorted by `order` field ascending

**UI:** Render in a "Content" card section below the structured fields

### 3. Content Blocks Editor

**Minimal MVP approach:**
- Add a "Content" section to the form
- Show existing blocks as editable cards
- "Add Text Block" button - adds a new text block with textarea
- "Add 3D Model" button - uses existing `AddModelButton` component
- No reordering for MVP (add at end)

**State Management:**
- Content blocks stored as JSON in a hidden field
- Client-side state tracks blocks
- On submit, serialize to JSON

### 4. Component Structure

```
components/
  content-blocks/
    ContentBlocksDisplay.tsx  # Read-only display for detail pages
    ContentBlocksEditor.tsx   # Edit interface for forms
    TextBlockEditor.tsx       # Single text block edit
    index.ts
```

## Implementation Order

1. Add `story_context` to CharacterForm and character detail page
2. Create `ContentBlocksDisplay` component
3. Add content blocks display to character detail page
4. Create `ContentBlocksEditor` component
5. Add content blocks editor to CharacterForm
6. Update character actions to handle content_blocks JSON
7. Apply same pattern to other entity types (locations, items, etc.)

## Entities to Update

Apply this pattern to all Phase 1 entities:
- Characters (first, as template)
- Locations
- Organizations
- Items
- Events
- Rules
- Stories
