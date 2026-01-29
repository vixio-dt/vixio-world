# Entity Content Blocks Design

> **Status:** Approved
> **Date:** 2026-01-29
> **Phase:** 2 (Worldbuilder Core)

## Overview

Extend the existing entity schema to support freeform content while preserving structured fields. This enables the "soft structure" philosophy: typed entities with freeform content inside.

## Design Principles

1. **User feels free** - They type naturally, use @mentions, drop images. No "block type" decisions.
2. **System handles complexity** - Type detection, mention extraction, relationship indexing all happen automatically.
3. **Keep what works** - Fixed fields (appearance, personality, etc.) remain for filtering/search.
4. **Enable Lore Link** - Each entity gets a story_context field for narrative purpose.

## Schema Changes

### New Columns on Entity Tables

Add to: `characters`, `locations`, `organizations`, `events`, `items`, `rules`, `stories`

| Column | Type | Purpose |
|--------|------|---------|
| `content_blocks` | JSONB | Freeform content (text, media) |
| `story_context` | TEXT | Lore Link - narrative purpose |

### Content Block Structure

```typescript
type ContentBlock = {
  id: string;           // UUID for editing/reordering
  type: 'text' | 'media'; // System-detected, not user-chosen
  content: string;      // Text content or media URL
  mentions: string[];   // Extracted entity UUIDs from @mentions
  order: number;        // For drag-and-drop reordering
  created_at: string;
  updated_at: string;
};
```

### New Table: entity_mentions

Tracks @mention relationships for querying the entity graph.

```sql
CREATE TABLE entity_mentions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_entity_type TEXT NOT NULL,
  source_entity_id UUID NOT NULL,
  target_entity_type TEXT NOT NULL,
  target_entity_id UUID NOT NULL,
  context TEXT,  -- Snippet where mention appears
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_entity_id, target_entity_id)
);

CREATE INDEX idx_mentions_source ON entity_mentions(source_entity_id);
CREATE INDEX idx_mentions_target ON entity_mentions(target_entity_id);
```

### Storage Bucket

For uploaded images/files in content blocks.

- **Bucket:** `entity-attachments`
- **Path convention:** `{world_id}/{entity_type}/{entity_id}/{filename}`
- **RLS:** Users can only access attachments in their own worlds

## How @Mentions Work

1. User types `@` in content area
2. Autocomplete shows entities from current world
3. Selection inserts: `@[Entity Name](character:uuid)`
4. On save, backend extracts mentions → populates `entity_mentions` table
5. Frontend renders as clickable links
6. AI uses `entity_mentions` for relationship suggestions

## Migration Strategy

1. **Additive only** - No existing columns removed or renamed
2. **Default values** - `content_blocks` defaults to `'[]'`, `story_context` defaults to `NULL`
3. **RLS unchanged** - Existing policies cover new columns automatically
4. **No data migration** - New columns start empty, users populate organically

## What Stays the Same

- All existing fixed fields (appearance, personality, background, etc.)
- All junction tables (character_relationships, character_organizations, etc.)
- All RLS policies
- All indexes

## Example Usage

**Character with content blocks:**

```json
{
  "id": "uuid-123",
  "name": "Aria",
  "role": "protagonist",
  "appearance": "Tall with silver hair",
  "story_context": "The reluctant hero who discovers her powers in Act 1. Drives the main plot.",
  "content_blocks": [
    {
      "id": "block-1",
      "type": "text",
      "content": "Aria grew up in @[Ironhold](location:uuid-456) under the watchful eye of @[Master Chen](character:uuid-789).",
      "mentions": ["uuid-456", "uuid-789"],
      "order": 0
    },
    {
      "id": "block-2", 
      "type": "media",
      "content": "https://storage.supabase.co/entity-attachments/world-1/characters/uuid-123/concept-art.jpg",
      "mentions": [],
      "order": 1
    }
  ]
}
```

## Implementation Tasks

See: `docs/plans/2026-01-29-entity-content-blocks-impl.md`
