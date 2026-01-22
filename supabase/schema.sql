-- Vixio Worldbuilder Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Worlds
CREATE TABLE worlds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  genre TEXT,
  tone TEXT,
  themes TEXT[],
  logline TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Characters
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  world_id UUID NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  aliases TEXT[],
  role TEXT CHECK (role IN ('protagonist', 'antagonist', 'supporting', 'background')),
  species TEXT,
  appearance TEXT,
  personality TEXT,
  background TEXT,
  motivations TEXT,
  arc_potential TEXT,
  visual_references TEXT,
  voice_notes TEXT,
  movement_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations (self-referential for hierarchy)
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  world_id UUID NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  parent_location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('planet', 'continent', 'country', 'city', 'district', 'building', 'room')),
  description TEXT,
  atmosphere TEXT,
  climate TEXT,
  key_features TEXT,
  history TEXT,
  cultural_significance TEXT,
  visual_references TEXT,
  lighting_notes TEXT,
  sound_notes TEXT,
  asset_requirements TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  world_id UUID NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('government', 'religion', 'corporation', 'guild', 'family', 'military', 'secret_society')),
  purpose TEXT,
  structure TEXT,
  leadership TEXT,
  territory TEXT,
  resources TEXT,
  beliefs TEXT,
  symbols TEXT,
  history TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events (renamed to avoid SQL reserved word)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  world_id UUID NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  date TEXT,
  date_sort BIGINT,
  type TEXT CHECK (type IN ('historical', 'plot_point', 'scheduled', 'recurring')),
  description TEXT,
  causes TEXT,
  consequences TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  world_id UUID NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('weapon', 'vehicle', 'artifact', 'tool', 'document', 'clothing', 'technology')),
  description TEXT,
  function TEXT,
  origin TEXT,
  significance TEXT,
  rules TEXT,
  visual_references TEXT,
  scale TEXT,
  material_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rules
CREATE TABLE rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  world_id UUID NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  category TEXT CHECK (category IN ('physics', 'magic', 'technology', 'biology', 'social', 'political', 'economic', 'temporal', 'cosmological')),
  statement TEXT,
  scope TEXT,
  exceptions TEXT,
  consequences TEXT,
  examples TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stories
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  world_id UUID NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  logline TEXT,
  genre TEXT,
  tone TEXT,
  theme TEXT,
  status TEXT CHECK (status IN ('concept', 'outline', 'draft', 'complete')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scenes
CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  scene_number INTEGER NOT NULL,
  time TEXT,
  purpose TEXT,
  summary TEXT,
  emotional_beat TEXT,
  key_dialogue TEXT,
  action TEXT,
  props_needed TEXT,
  setup_payoff TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shots
CREATE TABLE shots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scene_id UUID NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
  shot_number INTEGER NOT NULL,
  shot_type TEXT CHECK (shot_type IN ('wide', 'medium', 'close_up', 'extreme_close_up', 'over_shoulder', 'pov', 'aerial')),
  camera_movement TEXT CHECK (camera_movement IN ('static', 'pan', 'tilt', 'dolly', 'crane', 'handheld', 'steadicam')),
  description TEXT,
  action TEXT,
  dialogue TEXT,
  mood TEXT,
  lighting_notes TEXT,
  duration_estimate INTEGER,
  visual_prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- JUNCTION TABLES
-- =====================================================

-- Character Relationships (self-join)
CREATE TABLE character_relationships (
  character_a_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  character_b_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  relationship_type TEXT CHECK (relationship_type IN ('ally', 'enemy', 'family', 'romantic', 'mentor', 'rival', 'friend', 'colleague')),
  description TEXT,
  PRIMARY KEY (character_a_id, character_b_id)
);

-- Character Organizations
CREATE TABLE character_organizations (
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT,
  status TEXT CHECK (status IN ('current', 'former', 'founding')),
  PRIMARY KEY (character_id, organization_id)
);

-- Character Locations
CREATE TABLE character_locations (
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  relationship_type TEXT CHECK (relationship_type IN ('resident', 'birthplace', 'workplace', 'frequent')),
  PRIMARY KEY (character_id, location_id)
);

-- Event Characters
CREATE TABLE event_characters (
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('participant', 'witness', 'victim', 'instigator')),
  PRIMARY KEY (event_id, character_id)
);

-- Scene Characters
CREATE TABLE scene_characters (
  scene_id UUID NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  PRIMARY KEY (scene_id, character_id)
);

-- Shot Characters
CREATE TABLE shot_characters (
  shot_id UUID NOT NULL REFERENCES shots(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  PRIMARY KEY (shot_id, character_id)
);

-- Story Characters
CREATE TABLE story_characters (
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('protagonist', 'antagonist', 'supporting')),
  PRIMARY KEY (story_id, character_id)
);

-- Item Owners
CREATE TABLE item_owners (
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  ownership_type TEXT CHECK (ownership_type IN ('current', 'former', 'creator')),
  PRIMARY KEY (item_id, character_id)
);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shots ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE scene_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE shot_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_owners ENABLE ROW LEVEL SECURITY;

-- Worlds: users can only access their own worlds
CREATE POLICY "Users can view own worlds" ON worlds
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own worlds" ON worlds
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own worlds" ON worlds
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own worlds" ON worlds
  FOR DELETE USING (auth.uid() = user_id);

-- Characters: access through world ownership
CREATE POLICY "Users can access characters in own worlds" ON characters
  FOR ALL USING (
    EXISTS (SELECT 1 FROM worlds WHERE worlds.id = characters.world_id AND worlds.user_id = auth.uid())
  );

-- Locations: access through world ownership
CREATE POLICY "Users can access locations in own worlds" ON locations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM worlds WHERE worlds.id = locations.world_id AND worlds.user_id = auth.uid())
  );

-- Organizations: access through world ownership
CREATE POLICY "Users can access organizations in own worlds" ON organizations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM worlds WHERE worlds.id = organizations.world_id AND worlds.user_id = auth.uid())
  );

-- Events: access through world ownership
CREATE POLICY "Users can access events in own worlds" ON events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM worlds WHERE worlds.id = events.world_id AND worlds.user_id = auth.uid())
  );

-- Items: access through world ownership
CREATE POLICY "Users can access items in own worlds" ON items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM worlds WHERE worlds.id = items.world_id AND worlds.user_id = auth.uid())
  );

-- Rules: access through world ownership
CREATE POLICY "Users can access rules in own worlds" ON rules
  FOR ALL USING (
    EXISTS (SELECT 1 FROM worlds WHERE worlds.id = rules.world_id AND worlds.user_id = auth.uid())
  );

-- Stories: access through world ownership
CREATE POLICY "Users can access stories in own worlds" ON stories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM worlds WHERE worlds.id = stories.world_id AND worlds.user_id = auth.uid())
  );

-- Scenes: access through story -> world ownership
CREATE POLICY "Users can access scenes in own worlds" ON scenes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM stories 
      JOIN worlds ON worlds.id = stories.world_id 
      WHERE stories.id = scenes.story_id AND worlds.user_id = auth.uid()
    )
  );

-- Shots: access through scene -> story -> world ownership
CREATE POLICY "Users can access shots in own worlds" ON shots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM scenes 
      JOIN stories ON stories.id = scenes.story_id
      JOIN worlds ON worlds.id = stories.world_id 
      WHERE scenes.id = shots.scene_id AND worlds.user_id = auth.uid()
    )
  );

-- Junction tables: access through character ownership
CREATE POLICY "Users can access character_relationships" ON character_relationships
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM characters 
      JOIN worlds ON worlds.id = characters.world_id 
      WHERE characters.id = character_relationships.character_a_id AND worlds.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access character_organizations" ON character_organizations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM characters 
      JOIN worlds ON worlds.id = characters.world_id 
      WHERE characters.id = character_organizations.character_id AND worlds.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access character_locations" ON character_locations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM characters 
      JOIN worlds ON worlds.id = characters.world_id 
      WHERE characters.id = character_locations.character_id AND worlds.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access event_characters" ON event_characters
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events 
      JOIN worlds ON worlds.id = events.world_id 
      WHERE events.id = event_characters.event_id AND worlds.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access scene_characters" ON scene_characters
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM scenes 
      JOIN stories ON stories.id = scenes.story_id
      JOIN worlds ON worlds.id = stories.world_id 
      WHERE scenes.id = scene_characters.scene_id AND worlds.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access shot_characters" ON shot_characters
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM shots 
      JOIN scenes ON scenes.id = shots.scene_id
      JOIN stories ON stories.id = scenes.story_id
      JOIN worlds ON worlds.id = stories.world_id 
      WHERE shots.id = shot_characters.shot_id AND worlds.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access story_characters" ON story_characters
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM stories 
      JOIN worlds ON worlds.id = stories.world_id 
      WHERE stories.id = story_characters.story_id AND worlds.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access item_owners" ON item_owners
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM items 
      JOIN worlds ON worlds.id = items.world_id 
      WHERE items.id = item_owners.item_id AND worlds.user_id = auth.uid()
    )
  );

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_worlds_user_id ON worlds(user_id);
CREATE INDEX idx_characters_world_id ON characters(world_id);
CREATE INDEX idx_locations_world_id ON locations(world_id);
CREATE INDEX idx_locations_parent ON locations(parent_location_id);
CREATE INDEX idx_organizations_world_id ON organizations(world_id);
CREATE INDEX idx_events_world_id ON events(world_id);
CREATE INDEX idx_events_date_sort ON events(date_sort);
CREATE INDEX idx_items_world_id ON items(world_id);
CREATE INDEX idx_rules_world_id ON rules(world_id);
CREATE INDEX idx_rules_category ON rules(category);
CREATE INDEX idx_stories_world_id ON stories(world_id);
CREATE INDEX idx_scenes_story_id ON scenes(story_id);
CREATE INDEX idx_scenes_scene_number ON scenes(scene_number);
CREATE INDEX idx_shots_scene_id ON shots(scene_id);
CREATE INDEX idx_shots_shot_number ON shots(shot_number);

-- =====================================================
-- TRIGGERS FOR updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER worlds_updated_at BEFORE UPDATE ON worlds FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER characters_updated_at BEFORE UPDATE ON characters FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER items_updated_at BEFORE UPDATE ON items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER rules_updated_at BEFORE UPDATE ON rules FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER stories_updated_at BEFORE UPDATE ON stories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER scenes_updated_at BEFORE UPDATE ON scenes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER shots_updated_at BEFORE UPDATE ON shots FOR EACH ROW EXECUTE FUNCTION update_updated_at();
