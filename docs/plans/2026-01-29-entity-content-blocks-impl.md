# Entity Content Blocks Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add content_blocks and story_context columns to all entity tables, create entity_mentions table, and set up storage bucket for file uploads.

**Architecture:** Schema migration adds JSONB and TEXT columns to existing tables. New junction-style table tracks @mentions. Supabase Storage bucket for media files with RLS.

**Tech Stack:** PostgreSQL (Supabase), TypeScript types, Supabase Storage

---

## Task 1: Update Schema File - Add Columns to Characters

**Files:**
- Modify: `supabase/schema.sql`

**Step 1: Add content_blocks and story_context to characters table**

In `supabase/schema.sql`, find the characters table definition and add after `movement_notes TEXT,`:

```sql
  story_context TEXT,
  content_blocks JSONB DEFAULT '[]',
```

**Step 2: Verify syntax**

Run: `cat supabase/schema.sql | head -50`
Expected: Characters table includes new columns

**Step 3: Commit**

```bash
git add supabase/schema.sql
git commit -m "schema: Add content_blocks and story_context to characters"
```

---

## Task 2: Update Schema File - Add Columns to Remaining Entity Tables

**Files:**
- Modify: `supabase/schema.sql`

**Step 1: Add to locations table**

After `asset_requirements TEXT,` add:
```sql
  story_context TEXT,
  content_blocks JSONB DEFAULT '[]',
```

**Step 2: Add to organizations table**

After `history TEXT,` add:
```sql
  story_context TEXT,
  content_blocks JSONB DEFAULT '[]',
```

**Step 3: Add to events table**

After `consequences TEXT,` add:
```sql
  story_context TEXT,
  content_blocks JSONB DEFAULT '[]',
```

**Step 4: Add to items table**

After `material_notes TEXT,` add:
```sql
  story_context TEXT,
  content_blocks JSONB DEFAULT '[]',
```

**Step 5: Add to rules table**

After `examples TEXT,` add:
```sql
  story_context TEXT,
  content_blocks JSONB DEFAULT '[]',
```

**Step 6: Add to stories table**

After `status TEXT CHECK (status IN ('concept', 'outline', 'draft', 'complete')),` add:
```sql
  story_context TEXT,
  content_blocks JSONB DEFAULT '[]',
```

**Step 7: Commit**

```bash
git add supabase/schema.sql
git commit -m "schema: Add content_blocks and story_context to all entity tables"
```

---

## Task 3: Create entity_mentions Table

**Files:**
- Modify: `supabase/schema.sql`

**Step 1: Add entity_mentions table after the junction tables section**

Add before the RLS section:

```sql
-- Entity Mentions (tracks @mentions in content blocks)
CREATE TABLE entity_mentions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_entity_type TEXT NOT NULL CHECK (source_entity_type IN ('character', 'location', 'organization', 'event', 'item', 'rule', 'story')),
  source_entity_id UUID NOT NULL,
  target_entity_type TEXT NOT NULL CHECK (target_entity_type IN ('character', 'location', 'organization', 'event', 'item', 'rule', 'story')),
  target_entity_id UUID NOT NULL,
  context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_entity_id, target_entity_id)
);
```

**Step 2: Commit**

```bash
git add supabase/schema.sql
git commit -m "schema: Add entity_mentions table for @mention tracking"
```

---

## Task 4: Add RLS and Indexes for entity_mentions

**Files:**
- Modify: `supabase/schema.sql`

**Step 1: Enable RLS on entity_mentions**

In the RLS section, add:

```sql
ALTER TABLE entity_mentions ENABLE ROW LEVEL SECURITY;
```

**Step 2: Create RLS policy**

Add after other junction table policies:

```sql
-- Entity mentions: access through source entity ownership
CREATE POLICY "Users can access entity_mentions" ON entity_mentions
  FOR ALL USING (
    -- Check if source entity belongs to user's world (characters example)
    EXISTS (
      SELECT 1 FROM characters 
      JOIN worlds ON worlds.id = characters.world_id 
      WHERE characters.id = entity_mentions.source_entity_id 
      AND worlds.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM locations 
      JOIN worlds ON worlds.id = locations.world_id 
      WHERE locations.id = entity_mentions.source_entity_id 
      AND worlds.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM organizations 
      JOIN worlds ON worlds.id = organizations.world_id 
      WHERE organizations.id = entity_mentions.source_entity_id 
      AND worlds.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM events 
      JOIN worlds ON worlds.id = events.world_id 
      WHERE events.id = entity_mentions.source_entity_id 
      AND worlds.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM items 
      JOIN worlds ON worlds.id = items.world_id 
      WHERE items.id = entity_mentions.source_entity_id 
      AND worlds.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM rules 
      JOIN worlds ON worlds.id = rules.world_id 
      WHERE rules.id = entity_mentions.source_entity_id 
      AND worlds.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM stories 
      JOIN worlds ON worlds.id = stories.world_id 
      WHERE stories.id = entity_mentions.source_entity_id 
      AND worlds.user_id = auth.uid()
    )
  );
```

**Step 3: Add indexes**

In the indexes section, add:

```sql
CREATE INDEX idx_entity_mentions_source ON entity_mentions(source_entity_id);
CREATE INDEX idx_entity_mentions_target ON entity_mentions(target_entity_id);
CREATE INDEX idx_entity_mentions_source_type ON entity_mentions(source_entity_type);
CREATE INDEX idx_entity_mentions_target_type ON entity_mentions(target_entity_type);
```

**Step 4: Commit**

```bash
git add supabase/schema.sql
git commit -m "schema: Add RLS and indexes for entity_mentions"
```

---

## Task 5: Add Storage Bucket Configuration

**Files:**
- Modify: `supabase/schema.sql`

**Step 1: Add storage bucket section at end of file**

```sql
-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Entity attachments bucket for content block media
-- Note: Run this in Supabase dashboard or via Supabase CLI
-- INSERT INTO storage.buckets (id, name, public) VALUES ('entity-attachments', 'entity-attachments', false);

-- Storage RLS: Users can only access attachments in their own worlds
-- CREATE POLICY "Users can access own world attachments"
-- ON storage.objects FOR ALL
-- USING (
--   bucket_id = 'entity-attachments' 
--   AND (storage.foldername(name))[1]::uuid IN (
--     SELECT id FROM worlds WHERE user_id = auth.uid()
--   )
-- );
```

**Step 2: Commit**

```bash
git add supabase/schema.sql
git commit -m "schema: Add storage bucket configuration comments"
```

---

## Task 6: Update TypeScript Types

**Files:**
- Modify: `lib/types/database.ts`

**Step 1: Add ContentBlock type**

Add at top of file:

```typescript
export type ContentBlock = {
  id: string;
  type: 'text' | 'media';
  content: string;
  mentions: string[];
  order: number;
  created_at: string;
  updated_at: string;
};
```

**Step 2: Add story_context and content_blocks to Character type**

Find the Character type and add:

```typescript
  story_context: string | null;
  content_blocks: ContentBlock[];
```

**Step 3: Add EntityMention type**

```typescript
export type EntityMention = {
  id: string;
  source_entity_type: 'character' | 'location' | 'organization' | 'event' | 'item' | 'rule' | 'story';
  source_entity_id: string;
  target_entity_type: 'character' | 'location' | 'organization' | 'event' | 'item' | 'rule' | 'story';
  target_entity_id: string;
  context: string | null;
  created_at: string;
};
```

**Step 4: Commit**

```bash
git add lib/types/database.ts
git commit -m "types: Add ContentBlock and EntityMention types"
```

---

## Task 7: Update current-sprint.md

**Files:**
- Modify: `docs/current-sprint.md`

**Step 1: Update to reflect entity schema work**

Add new section documenting the schema extension completion.

**Step 2: Commit**

```bash
git add docs/current-sprint.md
git commit -m "docs: Update sprint with entity content blocks schema"
```

---

## Task 8: Final Verification

**Step 1: Check TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Exit 0, no errors

**Step 2: Check lint passes**

Run: `npm run lint`
Expected: Exit 0, no errors

**Step 3: Review schema file**

Run: `wc -l supabase/schema.sql`
Expected: Line count increased (was ~467, should be ~550+)

**Step 4: Push all commits**

```bash
git push -u origin cursor/entity-schema-content-blocks-4f1f
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Add columns to characters table |
| 2 | Add columns to remaining entity tables |
| 3 | Create entity_mentions table |
| 4 | Add RLS and indexes for entity_mentions |
| 5 | Add storage bucket configuration |
| 6 | Update TypeScript types |
| 7 | Update documentation |
| 8 | Final verification and push |

**Estimated commits:** 7
**Risk level:** Low (additive schema changes only)
