-- Chat feature migration
-- Run this in Supabase SQL Editor

-- =====================================================
-- CHAT TABLES
-- =====================================================

-- Chat sessions (one per world, persists conversation)
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  world_id UUID NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(world_id)  -- One session per world
);

-- Chat messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  command TEXT CHECK (command IN ('query', 'check', 'suggest', 'gaps', 'connections', 'status')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Chat sessions: access through world ownership
CREATE POLICY "Users can access chat_sessions in own worlds" ON chat_sessions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM worlds WHERE worlds.id = chat_sessions.world_id AND worlds.user_id = auth.uid())
  );

-- Chat messages: access through session -> world ownership
CREATE POLICY "Users can access chat_messages in own worlds" ON chat_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      JOIN worlds ON worlds.id = chat_sessions.world_id 
      WHERE chat_sessions.id = chat_messages.session_id AND worlds.user_id = auth.uid()
    )
  );

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_chat_sessions_world_id ON chat_sessions(world_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER chat_sessions_updated_at BEFORE UPDATE ON chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
