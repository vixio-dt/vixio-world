-- Migration: Add content_blocks and story_context to entity tables
-- Run this in Supabase SQL Editor

-- Add columns to characters
ALTER TABLE characters ADD COLUMN IF NOT EXISTS story_context TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT '[]';

-- Add columns to locations
ALTER TABLE locations ADD COLUMN IF NOT EXISTS story_context TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT '[]';

-- Add columns to organizations
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS story_context TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT '[]';

-- Add columns to events
ALTER TABLE events ADD COLUMN IF NOT EXISTS story_context TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT '[]';

-- Add columns to items
ALTER TABLE items ADD COLUMN IF NOT EXISTS story_context TEXT;
ALTER TABLE items ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT '[]';

-- Add columns to rules
ALTER TABLE rules ADD COLUMN IF NOT EXISTS story_context TEXT;
ALTER TABLE rules ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT '[]';

-- Add columns to stories
ALTER TABLE stories ADD COLUMN IF NOT EXISTS story_context TEXT;
ALTER TABLE stories ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT '[]';

-- Create entity_mentions table
CREATE TABLE IF NOT EXISTS entity_mentions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_entity_type TEXT NOT NULL CHECK (source_entity_type IN ('character', 'location', 'organization', 'event', 'item', 'rule', 'story')),
  source_entity_id UUID NOT NULL,
  target_entity_type TEXT NOT NULL CHECK (target_entity_type IN ('character', 'location', 'organization', 'event', 'item', 'rule', 'story')),
  target_entity_id UUID NOT NULL,
  context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_entity_id, target_entity_id)
);

-- Enable RLS on entity_mentions
ALTER TABLE entity_mentions ENABLE ROW LEVEL SECURITY;

-- RLS policy for entity_mentions
CREATE POLICY IF NOT EXISTS "Users can access entity_mentions" ON entity_mentions
  FOR ALL USING (
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

-- Indexes for entity_mentions
CREATE INDEX IF NOT EXISTS idx_entity_mentions_source ON entity_mentions(source_entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_mentions_target ON entity_mentions(target_entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_mentions_source_type ON entity_mentions(source_entity_type);
CREATE INDEX IF NOT EXISTS idx_entity_mentions_target_type ON entity_mentions(target_entity_type);
