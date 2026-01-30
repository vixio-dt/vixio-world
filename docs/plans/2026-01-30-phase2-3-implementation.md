# Phase 2+3 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement @mentions, relationship graph, global search, export system, and UX polish to complete Worldbuilder core features.

**Architecture:** Component-based approach with server actions for data operations. @mentions will be integrated into ContentBlocksEditor. Graph uses react-force-graph-2d. Export uses @react-pdf/renderer for PDF generation. Global search uses a command palette pattern with Cmd+K shortcut.

**Tech Stack:** Next.js 16, React 19, TypeScript, Supabase, react-force-graph-2d, @react-pdf/renderer, jszip

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install graph and export dependencies**

Run:
```bash
npm install react-force-graph-2d @react-pdf/renderer jszip
npm install --save-dev @types/react-force-graph-2d
```

**Step 2: Verify installation**

Run: `npm ls react-force-graph-2d @react-pdf/renderer jszip`
Expected: Shows installed versions

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add dependencies for graph, PDF export, and zip"
```

---

## Task 2: Create Entity Search Server Action

**Files:**
- Create: `lib/actions/search.ts`
- Test: Manual testing in browser

**Step 1: Create search action**

Create `lib/actions/search.ts`:

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import type { EntityType } from '@/lib/types/database'

export interface SearchResult {
  id: string
  name: string
  type: EntityType
  description: string | null
}

/**
 * Search all entity types in a world by name.
 * Used for @mentions autocomplete and global search.
 */
export async function searchEntities(
  worldId: string,
  query: string,
  limit: number = 10
): Promise<SearchResult[]> {
  const supabase = await createClient()
  
  const entityTables: { table: string; type: EntityType; nameField: string; descField: string }[] = [
    { table: 'characters', type: 'character', nameField: 'name', descField: 'personality' },
    { table: 'locations', type: 'location', nameField: 'name', descField: 'description' },
    { table: 'organizations', type: 'organization', nameField: 'name', descField: 'purpose' },
    { table: 'events', type: 'event', nameField: 'name', descField: 'description' },
    { table: 'items', type: 'item', nameField: 'name', descField: 'description' },
    { table: 'rules', type: 'rule', nameField: 'name', descField: 'statement' },
    { table: 'stories', type: 'story', nameField: 'title', descField: 'logline' },
  ]

  const results: SearchResult[] = []
  const searchPattern = `%${query}%`

  for (const { table, type, nameField, descField } of entityTables) {
    const { data, error } = await supabase
      .from(table)
      .select(`id, ${nameField}, ${descField}`)
      .eq('world_id', worldId)
      .ilike(nameField, searchPattern)
      .limit(Math.ceil(limit / entityTables.length))

    if (error) {
      console.error(`Error searching ${table}:`, error)
      continue
    }

    if (data) {
      results.push(
        ...data.map((item: Record<string, unknown>) => ({
          id: item.id as string,
          name: (item[nameField] || item.title) as string,
          type,
          description: (item[descField] || null) as string | null,
        }))
      )
    }
  }

  // Sort by relevance (exact match first, then starts with, then contains)
  const lowerQuery = query.toLowerCase()
  results.sort((a, b) => {
    const aLower = a.name.toLowerCase()
    const bLower = b.name.toLowerCase()
    
    if (aLower === lowerQuery && bLower !== lowerQuery) return -1
    if (bLower === lowerQuery && aLower !== lowerQuery) return 1
    if (aLower.startsWith(lowerQuery) && !bLower.startsWith(lowerQuery)) return -1
    if (bLower.startsWith(lowerQuery) && !aLower.startsWith(lowerQuery)) return 1
    return aLower.localeCompare(bLower)
  })

  return results.slice(0, limit)
}

/**
 * Get all entities for a world (used for graph view).
 */
export async function getAllEntities(worldId: string): Promise<SearchResult[]> {
  return searchEntities(worldId, '', 1000)
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Exit 0

**Step 3: Commit**

```bash
git add lib/actions/search.ts
git commit -m "feat: add entity search server action for @mentions and global search"
```

---

## Task 3: Create MentionInput Component

**Files:**
- Create: `components/mentions/MentionInput.tsx`
- Create: `components/mentions/MentionDropdown.tsx`
- Create: `components/mentions/index.ts`

**Step 1: Create MentionDropdown component**

Create `components/mentions/MentionDropdown.tsx`:

```typescript
'use client'

import { useEffect, useRef } from 'react'
import { Users, MapPin, Building2, Calendar, Package, Scale, BookOpen } from 'lucide-react'
import type { SearchResult } from '@/lib/actions/search'
import type { EntityType } from '@/lib/types/database'

interface MentionDropdownProps {
  results: SearchResult[]
  selectedIndex: number
  onSelect: (result: SearchResult) => void
  position: { top: number; left: number }
  loading: boolean
}

const entityIcons: Record<EntityType, typeof Users> = {
  character: Users,
  location: MapPin,
  organization: Building2,
  event: Calendar,
  item: Package,
  rule: Scale,
  story: BookOpen,
}

const entityColors: Record<EntityType, string> = {
  character: 'text-sky-600 bg-sky-50',
  location: 'text-emerald-600 bg-emerald-50',
  organization: 'text-purple-600 bg-purple-50',
  event: 'text-rose-600 bg-rose-50',
  item: 'text-amber-600 bg-amber-50',
  rule: 'text-indigo-600 bg-indigo-50',
  story: 'text-cyan-600 bg-cyan-50',
}

export function MentionDropdown({
  results,
  selectedIndex,
  onSelect,
  position,
  loading,
}: MentionDropdownProps) {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const selectedElement = listRef.current?.children[selectedIndex] as HTMLElement
    selectedElement?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  if (loading) {
    return (
      <div
        className="absolute z-50 bg-white border border-slate-200 rounded-lg shadow-lg p-3"
        style={{ top: position.top, left: position.left }}
      >
        <p className="text-sm text-slate-500">Searching...</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div
        className="absolute z-50 bg-white border border-slate-200 rounded-lg shadow-lg p-3"
        style={{ top: position.top, left: position.left }}
      >
        <p className="text-sm text-slate-500">No entities found</p>
      </div>
    )
  }

  return (
    <ul
      ref={listRef}
      className="absolute z-50 bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-y-auto w-72"
      style={{ top: position.top, left: position.left }}
    >
      {results.map((result, index) => {
        const Icon = entityIcons[result.type]
        const colorClass = entityColors[result.type]
        return (
          <li
            key={`${result.type}-${result.id}`}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${
              index === selectedIndex ? 'bg-slate-100' : 'hover:bg-slate-50'
            }`}
            onClick={() => onSelect(result)}
          >
            <span className={`p-1.5 rounded ${colorClass}`}>
              <Icon className="w-4 h-4" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{result.name}</p>
              <p className="text-xs text-slate-500 capitalize">{result.type}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
```

**Step 2: Create MentionInput component**

Create `components/mentions/MentionInput.tsx`:

```typescript
'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Textarea } from '@/components/ui'
import { MentionDropdown } from './MentionDropdown'
import { searchEntities, type SearchResult } from '@/lib/actions/search'

interface MentionInputProps {
  id: string
  name: string
  label?: string
  value: string
  onChange: (value: string) => void
  worldId: string
  placeholder?: string
  className?: string
}

// Mention format: @[type:id:name]
const MENTION_REGEX = /@\[(\w+):([a-f0-9-]+):([^\]]+)\]/g

export function MentionInput({
  id,
  name,
  label,
  value,
  onChange,
  worldId,
  placeholder,
  className,
}: MentionInputProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const [mentionStartIndex, setMentionStartIndex] = useState<number | null>(null)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Search for entities when query changes
  useEffect(() => {
    if (!showDropdown || !searchQuery) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const searchResults = await searchEntities(worldId, searchQuery, 8)
        setResults(searchResults)
        setSelectedIndex(0)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      }
      setLoading(false)
    }, 150) // Debounce

    return () => clearTimeout(timer)
  }, [searchQuery, worldId, showDropdown])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % Math.max(results.length, 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1))
      } else if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault()
        handleSelect(results[selectedIndex])
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setShowDropdown(false)
      }
    },
    [showDropdown, results, selectedIndex]
  )

  const handleSelect = useCallback(
    (result: SearchResult) => {
      if (mentionStartIndex === null) return

      const beforeMention = value.slice(0, mentionStartIndex)
      const afterMention = value.slice(textareaRef.current?.selectionStart || mentionStartIndex)
      
      // Insert mention in format @[type:id:name]
      const mention = `@[${result.type}:${result.id}:${result.name}]`
      const newValue = beforeMention + mention + afterMention

      onChange(newValue)
      setShowDropdown(false)
      setSearchQuery('')
      setMentionStartIndex(null)

      // Focus back on textarea
      setTimeout(() => {
        const newCursorPos = beforeMention.length + mention.length
        textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos)
        textareaRef.current?.focus()
      }, 0)
    },
    [mentionStartIndex, value, onChange]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      const cursorPos = e.target.selectionStart

      onChange(newValue)

      // Check if user just typed @
      const charBeforeCursor = newValue[cursorPos - 1]
      const charBeforeAt = cursorPos > 1 ? newValue[cursorPos - 2] : ' '

      if (charBeforeCursor === '@' && (charBeforeAt === ' ' || charBeforeAt === '\n' || cursorPos === 1)) {
        setShowDropdown(true)
        setMentionStartIndex(cursorPos - 1)
        setSearchQuery('')
        
        // Calculate dropdown position
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect()
          setDropdownPosition({
            top: 24, // Below the cursor line
            left: 0,
          })
        }
      } else if (showDropdown && mentionStartIndex !== null) {
        // Update search query
        const textAfterAt = newValue.slice(mentionStartIndex + 1, cursorPos)
        
        // Close dropdown if user typed space or newline
        if (textAfterAt.includes(' ') || textAfterAt.includes('\n')) {
          setShowDropdown(false)
          setMentionStartIndex(null)
        } else {
          setSearchQuery(textAfterAt)
        }
      }
    },
    [onChange, showDropdown, mentionStartIndex]
  )

  // Close dropdown on blur (with delay to allow click)
  const handleBlur = useCallback(() => {
    setTimeout(() => setShowDropdown(false), 200)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <Textarea
        ref={textareaRef}
        id={id}
        name={name}
        label={label}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={className}
      />
      {showDropdown && (
        <MentionDropdown
          results={results}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
          position={dropdownPosition}
          loading={loading}
        />
      )}
    </div>
  )
}

/**
 * Parse mention markers and return array of mention references.
 */
export function parseMentions(text: string): { type: string; id: string; name: string }[] {
  const mentions: { type: string; id: string; name: string }[] = []
  let match

  while ((match = MENTION_REGEX.exec(text)) !== null) {
    mentions.push({
      type: match[1],
      id: match[2],
      name: match[3],
    })
  }

  return mentions
}

/**
 * Render text with mentions as styled spans (for display).
 */
export function renderMentions(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match

  const regex = new RegExp(MENTION_REGEX.source, 'g')

  while ((match = regex.exec(text)) !== null) {
    // Add text before mention
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    // Add styled mention
    const [, type, id, name] = match
    parts.push(
      <span
        key={`${type}-${id}-${match.index}`}
        className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-sky-50 text-sky-700 rounded text-sm font-medium"
      >
        @{name}
      </span>
    )

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}
```

**Step 3: Create index export**

Create `components/mentions/index.ts`:

```typescript
export { MentionInput, parseMentions, renderMentions } from './MentionInput'
export { MentionDropdown } from './MentionDropdown'
```

**Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Exit 0

**Step 5: Commit**

```bash
git add components/mentions/
git commit -m "feat: add MentionInput component with autocomplete dropdown"
```

---

## Task 4: Create Entity Mentions Server Actions

**Files:**
- Create: `lib/actions/mentions.ts`

**Step 1: Create mentions server action**

Create `lib/actions/mentions.ts`:

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import type { EntityType, EntityMention } from '@/lib/types/database'

interface MentionData {
  type: string
  id: string
  name: string
}

/**
 * Sync entity mentions for a given entity.
 * Parses content for @[type:id:name] markers and updates entity_mentions table.
 */
export async function syncEntityMentions(
  sourceEntityType: EntityType,
  sourceEntityId: string,
  content: string
): Promise<void> {
  const supabase = await createClient()

  // Parse mentions from content
  const mentionRegex = /@\[(\w+):([a-f0-9-]+):([^\]]+)\]/g
  const mentions: MentionData[] = []
  let match

  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push({
      type: match[1],
      id: match[2],
      name: match[3],
    })
  }

  // Delete existing mentions for this source entity
  const { error: deleteError } = await supabase
    .from('entity_mentions')
    .delete()
    .eq('source_entity_id', sourceEntityId)

  if (deleteError) {
    console.error('Error deleting existing mentions:', deleteError)
  }

  // Insert new mentions
  if (mentions.length > 0) {
    const mentionRows = mentions.map((m) => ({
      source_entity_type: sourceEntityType,
      source_entity_id: sourceEntityId,
      target_entity_type: m.type as EntityType,
      target_entity_id: m.id,
      context: m.name, // Store display name as context
    }))

    const { error: insertError } = await supabase
      .from('entity_mentions')
      .insert(mentionRows)

    if (insertError) {
      console.error('Error inserting mentions:', insertError)
    }
  }
}

/**
 * Get all mentions where this entity is the target (entities that mention this one).
 */
export async function getMentionsOf(
  entityId: string
): Promise<EntityMention[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('entity_mentions')
    .select('*')
    .eq('target_entity_id', entityId)

  if (error) {
    console.error('Error fetching mentions of entity:', error)
    return []
  }

  return data as EntityMention[]
}

/**
 * Get all mentions from this entity (entities this one mentions).
 */
export async function getMentionsFrom(
  entityId: string
): Promise<EntityMention[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('entity_mentions')
    .select('*')
    .eq('source_entity_id', entityId)

  if (error) {
    console.error('Error fetching mentions from entity:', error)
    return []
  }

  return data as EntityMention[]
}

/**
 * Get all mentions for a world (used for graph visualization).
 */
export async function getAllMentionsForWorld(worldId: string): Promise<EntityMention[]> {
  const supabase = await createClient()

  // We need to join through entity tables to filter by world_id
  // Since mentions can be from any entity type, we do multiple queries
  const entityTypes = ['characters', 'locations', 'organizations', 'events', 'items', 'rules', 'stories']
  const allMentions: EntityMention[] = []

  for (const table of entityTypes) {
    const { data: entities } = await supabase
      .from(table)
      .select('id')
      .eq('world_id', worldId)

    if (entities && entities.length > 0) {
      const entityIds = entities.map((e: { id: string }) => e.id)
      
      const { data: mentions } = await supabase
        .from('entity_mentions')
        .select('*')
        .in('source_entity_id', entityIds)

      if (mentions) {
        allMentions.push(...(mentions as EntityMention[]))
      }
    }
  }

  return allMentions
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Exit 0

**Step 3: Commit**

```bash
git add lib/actions/mentions.ts
git commit -m "feat: add entity mentions server actions for CRUD and graph data"
```

---

## Task 5: Integrate MentionInput into ContentBlocksEditor

**Files:**
- Modify: `components/content-blocks/ContentBlocksEditor.tsx`

**Step 1: Update ContentBlocksEditor to use MentionInput**

In `components/content-blocks/ContentBlocksEditor.tsx`, replace the Textarea for text blocks with MentionInput:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Button, Card, CardContent } from '@/components/ui';
import { AddModelButton } from '@/components/models';
import { MentionInput } from '@/components/mentions';
import { FileText, Box, Trash2 } from 'lucide-react';
import type { ContentBlock } from '@/lib/types/database';
import type { ModelPlatform } from '@/lib/utils/model-url';

interface ContentBlocksEditorProps {
  initialBlocks?: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  worldId: string;
}

/**
 * Editor for content blocks.
 * Allows adding/editing/removing text and model blocks.
 * Text blocks support @mentions.
 */
export function ContentBlocksEditor({ initialBlocks = [], onChange, worldId }: ContentBlocksEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks);

  useEffect(() => {
    onChange(blocks);
  }, [blocks, onChange]);

  const generateId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addTextBlock = () => {
    const newBlock: ContentBlock = {
      id: generateId(),
      type: 'text',
      content: '',
      mentions: [],
      order: blocks.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setBlocks([...blocks, newBlock]);
  };

  const addModelBlock = (url: string, platform: ModelPlatform) => {
    const newBlock: ContentBlock = {
      id: generateId(),
      type: 'model',
      content: url,
      platform,
      mentions: [],
      order: blocks.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(block => 
      block.id === id 
        ? { ...block, content, updated_at: new Date().toISOString() }
        : block
    ));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700">Content Blocks</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTextBlock}
          >
            <FileText className="w-4 h-4 mr-1" />
            Add Text
          </Button>
          <AddModelButton onAdd={addModelBlock} />
        </div>
      </div>

      {blocks.length === 0 ? (
        <p className="text-sm text-slate-500 italic py-4 text-center border border-dashed border-slate-200 rounded-lg">
          No content blocks yet. Add text or 3D models to enrich this entity.
        </p>
      ) : (
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <ContentBlockEditor
              key={block.id}
              block={block}
              index={index}
              onUpdate={updateBlock}
              onRemove={removeBlock}
              worldId={worldId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ContentBlockEditorProps {
  block: ContentBlock;
  index: number;
  onUpdate: (id: string, content: string) => void;
  onRemove: (id: string) => void;
  worldId: string;
}

function ContentBlockEditor({ block, index, onUpdate, onRemove, worldId }: ContentBlockEditorProps) {
  if (block.type === 'text') {
    return (
      <Card>
        <CardContent className="py-3">
          <div className="flex items-start gap-2">
            <div className="flex items-center gap-2 pt-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">#{index + 1}</span>
            </div>
            <div className="flex-1">
              <MentionInput
                id={`block-${block.id}`}
                name={`block-${block.id}`}
                value={block.content}
                onChange={(value) => onUpdate(block.id, value)}
                worldId={worldId}
                placeholder="Write content here... Use @ to mention other entities"
                className="min-h-[100px]"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(block.id)}
              className="text-slate-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (block.type === 'model') {
    return (
      <Card>
        <CardContent className="py-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">
                #{index + 1} · 3D Model ({block.platform || 'External'})
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(block.id)}
              className="text-slate-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
            <iframe
              src={block.content.includes('sketchfab.com') 
                ? block.content.replace('/models/', '/models/embed/').split('?')[0] + '?autostart=0'
                : block.content}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
              title="3D Model Preview"
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 truncate">{block.content}</p>
        </CardContent>
      </Card>
    );
  }

  return null;
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Exit 0

**Step 3: Commit**

```bash
git add components/content-blocks/ContentBlocksEditor.tsx
git commit -m "feat: integrate MentionInput into ContentBlocksEditor for @mentions support"
```

---

## Task 6: Update Entity Forms to Pass worldId

**Files:**
- Modify: `components/characters/CharacterForm.tsx`
- Modify: `components/locations/LocationForm.tsx`
- Modify: `components/items/ItemForm.tsx`
- Modify: `components/organizations/OrganizationForm.tsx`
- Modify: `components/rules/RuleForm.tsx`
- Modify: `components/stories/StoryForm.tsx`
- Modify: `components/timeline/EventForm.tsx`

**Step 1: Update CharacterForm**

In `components/characters/CharacterForm.tsx`, pass `worldId` to `ContentBlocksEditor`:

Find:
```typescript
<ContentBlocksEditor
  initialBlocks={character?.content_blocks || []}
  onChange={handleContentBlocksChange}
/>
```

Replace with:
```typescript
<ContentBlocksEditor
  initialBlocks={character?.content_blocks || []}
  onChange={handleContentBlocksChange}
  worldId={worldId}
/>
```

**Step 2: Repeat for all other entity forms**

Apply the same change to:
- `components/locations/LocationForm.tsx`
- `components/items/ItemForm.tsx`
- `components/organizations/OrganizationForm.tsx`
- `components/rules/RuleForm.tsx`
- `components/stories/StoryForm.tsx`
- `components/timeline/EventForm.tsx`

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Exit 0

**Step 4: Commit**

```bash
git add components/*/
git commit -m "feat: pass worldId to ContentBlocksEditor in all entity forms"
```

---

## Task 7: Update Server Actions to Sync Mentions on Save

**Files:**
- Modify: `lib/actions/characters.ts`
- Modify: `lib/actions/locations.ts`
- Modify: `lib/actions/items.ts`
- Modify: `lib/actions/organizations.ts`
- Modify: `lib/actions/rules.ts`
- Modify: `lib/actions/stories.ts`
- Modify: `lib/actions/events.ts`

**Step 1: Update characters.ts**

In `lib/actions/characters.ts`, add mention syncing after create and update:

Add import at top:
```typescript
import { syncEntityMentions } from './mentions'
```

In `createCharacter`, after the insert succeeds, add:
```typescript
// Sync mentions from content blocks
const allContent = content_blocks.map((b: { content: string }) => b.content).join('\n')
await syncEntityMentions('character', data.id, allContent)
```

In `updateCharacter`, after the update succeeds, add:
```typescript
// Sync mentions from content blocks
const allContent = content_blocks.map((b: { content: string }) => b.content).join('\n')
await syncEntityMentions('character', id, allContent)
```

**Step 2: Repeat for all other entity actions**

Apply the same pattern to:
- `lib/actions/locations.ts` (use 'location' type)
- `lib/actions/items.ts` (use 'item' type)
- `lib/actions/organizations.ts` (use 'organization' type)
- `lib/actions/rules.ts` (use 'rule' type)
- `lib/actions/stories.ts` (use 'story' type)
- `lib/actions/events.ts` (use 'event' type)

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Exit 0

**Step 4: Commit**

```bash
git add lib/actions/
git commit -m "feat: sync entity mentions on create/update for all entity types"
```

---

## Task 8: Create MentionDisplay Component

**Files:**
- Modify: `components/content-blocks/ContentBlocksDisplay.tsx`

**Step 1: Update ContentBlocksDisplay to render mentions**

In `components/content-blocks/ContentBlocksDisplay.tsx`, add mention rendering:

```typescript
'use client';

import { Card, CardContent } from '@/components/ui';
import { FileText, Box } from 'lucide-react';
import Link from 'next/link';
import type { ContentBlock } from '@/lib/types/database';

interface ContentBlocksDisplayProps {
  blocks: ContentBlock[];
}

// Entity type to URL path mapping
const entityPaths: Record<string, string> = {
  character: '/characters',
  location: '/locations',
  organization: '/organizations',
  event: '/timeline',
  item: '/items',
  rule: '/rules',
  story: '/stories',
}

/**
 * Render text with @mentions as clickable links.
 */
function renderTextWithMentions(text: string): React.ReactNode[] {
  const mentionRegex = /@\[(\w+):([a-f0-9-]+):([^\]]+)\]/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match

  while ((match = mentionRegex.exec(text)) !== null) {
    // Add text before mention
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    // Add mention as link
    const [, type, id, name] = match
    const path = entityPaths[type] || '/dashboard'
    
    parts.push(
      <Link
        key={`${type}-${id}-${match.index}`}
        href={`${path}/${id}`}
        className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded text-sm font-medium transition-colors"
      >
        @{name}
      </Link>
    )

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : [text]
}

/**
 * Display component for content blocks (read-only).
 * Renders text with @mentions as clickable links.
 */
export function ContentBlocksDisplay({ blocks }: ContentBlocksDisplayProps) {
  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-slate-700">Content</h3>
      <div className="space-y-3">
        {blocks.map((block, index) => (
          <ContentBlockView key={block.id} block={block} index={index} />
        ))}
      </div>
    </div>
  );
}

interface ContentBlockViewProps {
  block: ContentBlock;
  index: number;
}

function ContentBlockView({ block, index }: ContentBlockViewProps) {
  if (block.type === 'text') {
    return (
      <Card>
        <CardContent className="py-3">
          <div className="flex items-start gap-2">
            <div className="flex items-center gap-2 pt-1">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">#{index + 1}</span>
            </div>
            <div className="flex-1 prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
              {renderTextWithMentions(block.content)}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (block.type === 'model') {
    return (
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center gap-2 mb-2">
            <Box className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500">
              #{index + 1} · 3D Model ({block.platform || 'External'})
            </span>
          </div>
          <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
            <iframe
              src={block.content.includes('sketchfab.com')
                ? block.content.replace('/models/', '/models/embed/').split('?')[0] + '?autostart=0'
                : block.content}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
              title="3D Model Preview"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Exit 0

**Step 3: Commit**

```bash
git add components/content-blocks/ContentBlocksDisplay.tsx
git commit -m "feat: render @mentions as clickable links in ContentBlocksDisplay"
```

---

## Task 9: Create Graph Data Server Action

**Files:**
- Create: `lib/actions/graph.ts`

**Step 1: Create graph data action**

Create `lib/actions/graph.ts`:

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import type { EntityType } from '@/lib/types/database'

export interface GraphNode {
  id: string
  name: string
  type: EntityType
  connectionCount: number
}

export interface GraphEdge {
  source: string
  target: string
  type: 'mention'
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

/**
 * Get graph data (nodes and edges) for a world.
 * Nodes are entities, edges are mentions.
 */
export async function getGraphData(worldId: string): Promise<GraphData> {
  const supabase = await createClient()

  const nodes: GraphNode[] = []
  const nodeIds = new Set<string>()

  // Fetch all entities as nodes
  const entityTables: { table: string; type: EntityType; nameField: string }[] = [
    { table: 'characters', type: 'character', nameField: 'name' },
    { table: 'locations', type: 'location', nameField: 'name' },
    { table: 'organizations', type: 'organization', nameField: 'name' },
    { table: 'events', type: 'event', nameField: 'name' },
    { table: 'items', type: 'item', nameField: 'name' },
    { table: 'rules', type: 'rule', nameField: 'name' },
    { table: 'stories', type: 'story', nameField: 'title' },
  ]

  for (const { table, type, nameField } of entityTables) {
    const { data, error } = await supabase
      .from(table)
      .select(`id, ${nameField}`)
      .eq('world_id', worldId)

    if (error) {
      console.error(`Error fetching ${table} for graph:`, error)
      continue
    }

    if (data) {
      for (const item of data) {
        const name = (item as Record<string, unknown>)[nameField] || (item as Record<string, unknown>).title
        nodes.push({
          id: item.id,
          name: name as string,
          type,
          connectionCount: 0,
        })
        nodeIds.add(item.id)
      }
    }
  }

  // Fetch all mentions as edges
  const edges: GraphEdge[] = []
  const entityIds = Array.from(nodeIds)

  if (entityIds.length > 0) {
    const { data: mentions, error } = await supabase
      .from('entity_mentions')
      .select('source_entity_id, target_entity_id')
      .in('source_entity_id', entityIds)

    if (error) {
      console.error('Error fetching mentions for graph:', error)
    } else if (mentions) {
      for (const mention of mentions) {
        // Only include edges where both nodes exist
        if (nodeIds.has(mention.source_entity_id) && nodeIds.has(mention.target_entity_id)) {
          edges.push({
            source: mention.source_entity_id,
            target: mention.target_entity_id,
            type: 'mention',
          })
        }
      }
    }
  }

  // Calculate connection counts
  const connectionCounts = new Map<string, number>()
  for (const edge of edges) {
    connectionCounts.set(edge.source, (connectionCounts.get(edge.source) || 0) + 1)
    connectionCounts.set(edge.target, (connectionCounts.get(edge.target) || 0) + 1)
  }

  // Update node connection counts
  for (const node of nodes) {
    node.connectionCount = connectionCounts.get(node.id) || 0
  }

  return { nodes, edges }
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Exit 0

**Step 3: Commit**

```bash
git add lib/actions/graph.ts
git commit -m "feat: add graph data server action for relationship visualization"
```

---

## Task 10: Create Graph Page and Component

**Files:**
- Create: `components/graph/RelationshipGraph.tsx`
- Create: `components/graph/GraphControls.tsx`
- Create: `components/graph/index.ts`
- Create: `app/(dashboard)/graph/page.tsx`

**Step 1: Create GraphControls component**

Create `components/graph/GraphControls.tsx`:

```typescript
'use client'

import { Button, Input } from '@/components/ui'
import { Users, MapPin, Building2, Calendar, Package, Scale, BookOpen, Maximize2, Home } from 'lucide-react'
import type { EntityType } from '@/lib/types/database'

interface GraphControlsProps {
  typeFilters: Record<EntityType, boolean>
  onToggleType: (type: EntityType) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onCenter: () => void
  onFullscreen: () => void
}

const entityTypes: { type: EntityType; icon: typeof Users; label: string; color: string }[] = [
  { type: 'character', icon: Users, label: 'Characters', color: 'bg-sky-500' },
  { type: 'location', icon: MapPin, label: 'Locations', color: 'bg-emerald-500' },
  { type: 'organization', icon: Building2, label: 'Organizations', color: 'bg-purple-500' },
  { type: 'event', icon: Calendar, label: 'Events', color: 'bg-rose-500' },
  { type: 'item', icon: Package, label: 'Items', color: 'bg-amber-500' },
  { type: 'rule', icon: Scale, label: 'Rules', color: 'bg-indigo-500' },
  { type: 'story', icon: BookOpen, label: 'Stories', color: 'bg-cyan-500' },
]

export function GraphControls({
  typeFilters,
  onToggleType,
  searchQuery,
  onSearchChange,
  onCenter,
  onFullscreen,
}: GraphControlsProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-4">
      {/* Type filters */}
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur rounded-lg p-2 shadow-lg">
        {entityTypes.map(({ type, icon: Icon, label, color }) => (
          <button
            key={type}
            onClick={() => onToggleType(type)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-all ${
              typeFilters[type]
                ? `${color} text-white`
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
            title={`Toggle ${label}`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Search and actions */}
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur rounded-lg p-2 shadow-lg">
        <Input
          type="search"
          placeholder="Search entities..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-48 h-8 text-sm"
        />
        <Button variant="outline" size="sm" onClick={onCenter} title="Center view">
          <Home className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onFullscreen} title="Fullscreen">
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
```

**Step 2: Create RelationshipGraph component**

Create `components/graph/RelationshipGraph.tsx`:

```typescript
'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { GraphControls } from './GraphControls'
import type { GraphData, GraphNode, GraphEdge } from '@/lib/actions/graph'
import type { EntityType } from '@/lib/types/database'

// Dynamic import to avoid SSR issues with canvas
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false })

interface RelationshipGraphProps {
  data: GraphData
}

const entityColors: Record<EntityType, string> = {
  character: '#0ea5e9', // sky-500
  location: '#10b981', // emerald-500
  organization: '#a855f7', // purple-500
  event: '#f43f5e', // rose-500
  item: '#f59e0b', // amber-500
  rule: '#6366f1', // indigo-500
  story: '#06b6d4', // cyan-500
}

const entityPaths: Record<EntityType, string> = {
  character: '/characters',
  location: '/locations',
  organization: '/organizations',
  event: '/timeline',
  item: '/items',
  rule: '/rules',
  story: '/stories',
}

export function RelationshipGraph({ data }: RelationshipGraphProps) {
  const router = useRouter()
  const graphRef = useRef<{ centerAt: (x?: number, y?: number, ms?: number) => void; zoom: (k: number, ms?: number) => void } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  const [typeFilters, setTypeFilters] = useState<Record<EntityType, boolean>>({
    character: true,
    location: true,
    organization: true,
    event: true,
    item: true,
    rule: true,
    story: true,
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null)

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Filter nodes and edges based on type filters
  const filteredData = {
    nodes: data.nodes.filter((node) => typeFilters[node.type]),
    links: data.edges
      .filter((edge) => {
        const sourceNode = data.nodes.find((n) => n.id === edge.source)
        const targetNode = data.nodes.find((n) => n.id === edge.target)
        return sourceNode && targetNode && typeFilters[sourceNode.type] && typeFilters[targetNode.type]
      })
      .map((edge) => ({ ...edge })), // Clone for react-force-graph
  }

  // Highlight nodes matching search
  useEffect(() => {
    if (searchQuery) {
      const match = data.nodes.find((n) =>
        n.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setHighlightedNode(match?.id || null)
    } else {
      setHighlightedNode(null)
    }
  }, [searchQuery, data.nodes])

  const handleToggleType = useCallback((type: EntityType) => {
    setTypeFilters((prev) => ({ ...prev, [type]: !prev[type] }))
  }, [])

  const handleCenter = useCallback(() => {
    graphRef.current?.centerAt(0, 0, 500)
    graphRef.current?.zoom(1, 500)
  }, [])

  const handleFullscreen = useCallback(() => {
    containerRef.current?.requestFullscreen?.()
  }, [])

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      const path = entityPaths[node.type]
      router.push(`${path}/${node.id}`)
    },
    [router]
  )

  const nodeCanvasObject = useCallback(
    (node: GraphNode & { x?: number; y?: number }, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const label = node.name
      const fontSize = 12 / globalScale
      ctx.font = `${fontSize}px Sans-Serif`
      
      const nodeSize = Math.max(5, Math.min(15, 5 + node.connectionCount * 2))
      const isHighlighted = node.id === highlightedNode

      // Node circle
      ctx.beginPath()
      ctx.arc(node.x || 0, node.y || 0, nodeSize, 0, 2 * Math.PI)
      ctx.fillStyle = entityColors[node.type]
      ctx.fill()

      // Highlight ring
      if (isHighlighted) {
        ctx.strokeStyle = '#fbbf24'
        ctx.lineWidth = 3 / globalScale
        ctx.stroke()
      }

      // Label
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#334155'
      ctx.fillText(label, node.x || 0, (node.y || 0) + nodeSize + fontSize)
    },
    [highlightedNode]
  )

  return (
    <div ref={containerRef} className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden">
      <GraphControls
        typeFilters={typeFilters}
        onToggleType={handleToggleType}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCenter={handleCenter}
        onFullscreen={handleFullscreen}
      />

      {filteredData.nodes.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-slate-400 text-lg">
            No entities to display. Create some entities and add @mentions to see relationships.
          </p>
        </div>
      ) : (
        <ForceGraph2D
          ref={graphRef}
          graphData={filteredData}
          width={dimensions.width}
          height={dimensions.height}
          nodeId="id"
          nodeLabel={(node: GraphNode) => `${node.name} (${node.type})`}
          nodeCanvasObject={nodeCanvasObject}
          nodePointerAreaPaint={(node: GraphNode & { x?: number; y?: number }, color, ctx) => {
            const nodeSize = Math.max(5, Math.min(15, 5 + node.connectionCount * 2))
            ctx.fillStyle = color
            ctx.beginPath()
            ctx.arc(node.x || 0, node.y || 0, nodeSize, 0, 2 * Math.PI)
            ctx.fill()
          }}
          linkColor={() => 'rgba(148, 163, 184, 0.5)'}
          linkWidth={1}
          onNodeClick={handleNodeClick}
          backgroundColor="#0f172a"
          cooldownTicks={100}
          enableNodeDrag={true}
          enableZoomInteraction={true}
          enablePanInteraction={true}
        />
      )}
    </div>
  )
}
```

**Step 3: Create index export**

Create `components/graph/index.ts`:

```typescript
export { RelationshipGraph } from './RelationshipGraph'
export { GraphControls } from './GraphControls'
```

**Step 4: Create graph page**

Create `app/(dashboard)/graph/page.tsx`:

```typescript
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { RelationshipGraph } from '@/components/graph'
import { getGraphData } from '@/lib/actions/graph'

export default async function GraphPage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value

  if (!worldId) {
    redirect('/dashboard')
  }

  const graphData = await getGraphData(worldId)

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Relationship Graph</h1>
        <p className="text-slate-600">
          Visualize connections between entities. Click a node to view details.
        </p>
      </div>
      <div className="h-[calc(100%-5rem)]">
        <RelationshipGraph data={graphData} />
      </div>
    </div>
  )
}
```

**Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Exit 0

**Step 6: Commit**

```bash
git add components/graph/ app/(dashboard)/graph/
git commit -m "feat: add relationship graph page with interactive visualization"
```

---

## Task 11: Add Graph to Sidebar Navigation

**Files:**
- Modify: `components/shell/Sidebar.tsx`

**Step 1: Add graph link to navigation**

In `components/shell/Sidebar.tsx`, add the graph icon import and nav item:

Add to imports:
```typescript
import { Network } from 'lucide-react'
```

Add to `navItems` array after Stories:
```typescript
{ href: '/graph', label: 'Graph', icon: Network },
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Exit 0

**Step 3: Commit**

```bash
git add components/shell/Sidebar.tsx
git commit -m "feat: add graph link to sidebar navigation"
```

---

## Task 12: Create Global Search Command Palette

**Files:**
- Create: `components/search/CommandPalette.tsx`
- Create: `components/search/index.ts`
- Modify: `app/(dashboard)/layout.tsx`

**Step 1: Create CommandPalette component**

Create `components/search/CommandPalette.tsx`:

```typescript
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { Search, Users, MapPin, Building2, Calendar, Package, Scale, BookOpen, X } from 'lucide-react'
import { searchEntities, type SearchResult } from '@/lib/actions/search'
import type { EntityType } from '@/lib/types/database'

interface CommandPaletteProps {
  worldId: string | null
}

const entityIcons: Record<EntityType, typeof Users> = {
  character: Users,
  location: MapPin,
  organization: Building2,
  event: Calendar,
  item: Package,
  rule: Scale,
  story: BookOpen,
}

const entityPaths: Record<EntityType, string> = {
  character: '/characters',
  location: '/locations',
  organization: '/organizations',
  event: '/timeline',
  item: '/items',
  rule: '/rules',
  story: '/stories',
}

const entityColors: Record<EntityType, string> = {
  character: 'text-sky-600 bg-sky-50',
  location: 'text-emerald-600 bg-emerald-50',
  organization: 'text-purple-600 bg-purple-50',
  event: 'text-rose-600 bg-rose-50',
  item: 'text-amber-600 bg-amber-50',
  rule: 'text-indigo-600 bg-indigo-50',
  story: 'text-cyan-600 bg-cyan-50',
}

export function CommandPalette({ worldId }: CommandPaletteProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  // Open/close with Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setQuery('')
      setResults([])
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Search when query changes
  useEffect(() => {
    if (!isOpen || !worldId || !query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const searchResults = await searchEntities(worldId, query, 10)
        setResults(searchResults)
        setSelectedIndex(0)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      }
      setLoading(false)
    }, 200)

    return () => clearTimeout(timer)
  }, [query, worldId, isOpen])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % Math.max(results.length, 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1))
      } else if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault()
        handleSelect(results[selectedIndex])
      }
    },
    [results, selectedIndex]
  )

  const handleSelect = useCallback(
    (result: SearchResult) => {
      const path = entityPaths[result.type]
      router.push(`${path}/${result.id}`)
      setIsOpen(false)
    },
    [router]
  )

  if (!isOpen) return null

  const content = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative flex min-h-full items-start justify-center p-4 pt-[20vh]">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search entities..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 outline-none text-slate-900 placeholder-slate-400"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-100 rounded"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {!worldId ? (
              <p className="px-4 py-8 text-center text-slate-500">
                Select a world to search
              </p>
            ) : loading ? (
              <p className="px-4 py-8 text-center text-slate-500">Searching...</p>
            ) : query && results.length === 0 ? (
              <p className="px-4 py-8 text-center text-slate-500">
                No results found for "{query}"
              </p>
            ) : results.length > 0 ? (
              <ul className="py-2">
                {results.map((result, index) => {
                  const Icon = entityIcons[result.type]
                  const colorClass = entityColors[result.type]
                  return (
                    <li
                      key={`${result.type}-${result.id}`}
                      className={`flex items-center gap-3 px-4 py-2 cursor-pointer ${
                        index === selectedIndex ? 'bg-slate-100' : 'hover:bg-slate-50'
                      }`}
                      onClick={() => handleSelect(result)}
                    >
                      <span className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {result.name}
                        </p>
                        {result.description && (
                          <p className="text-xs text-slate-500 truncate">
                            {result.description}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 capitalize">
                        {result.type}
                      </span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="px-4 py-8 text-center text-slate-500">
                <p>Type to search entities</p>
                <p className="text-xs mt-2">
                  Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">↑</kbd>{' '}
                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">↓</kbd> to navigate,{' '}
                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">Enter</kbd> to select
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
            <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200">⌘K</kbd> to toggle
          </div>
        </div>
      </div>
    </div>
  )

  // Use portal to render at document root
  return typeof window !== 'undefined' ? createPortal(content, document.body) : null
}
```

**Step 2: Create index export**

Create `components/search/index.ts`:

```typescript
export { CommandPalette } from './CommandPalette'
```

**Step 3: Update dashboard layout to include CommandPalette**

In `app/(dashboard)/layout.tsx`, add the CommandPalette:

Add import:
```typescript
import { CommandPalette } from '@/components/search'
import { cookies } from 'next/headers'
```

Add to the layout component:
```typescript
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value || null

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
      <CommandPalette worldId={worldId} />
    </div>
  )
}
```

**Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Exit 0

**Step 5: Commit**

```bash
git add components/search/ app/(dashboard)/layout.tsx
git commit -m "feat: add global search command palette with Cmd+K shortcut"
```

---

## Task 13: Create Export Server Actions

**Files:**
- Create: `lib/actions/export.ts`

**Step 1: Create export actions**

Create `lib/actions/export.ts`:

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import type { EntityType } from '@/lib/types/database'

export interface ExportEntity {
  id: string
  name: string
  type: EntityType
  data: Record<string, unknown>
}

export interface ExportData {
  worldName: string
  exportedAt: string
  entities: ExportEntity[]
}

/**
 * Get all entities for export.
 */
export async function getExportData(
  worldId: string,
  entityTypes?: EntityType[]
): Promise<ExportData> {
  const supabase = await createClient()

  // Get world name
  const { data: world } = await supabase
    .from('worlds')
    .select('name')
    .eq('id', worldId)
    .single()

  const entities: ExportEntity[] = []

  const allTypes: { table: string; type: EntityType; nameField: string }[] = [
    { table: 'characters', type: 'character', nameField: 'name' },
    { table: 'locations', type: 'location', nameField: 'name' },
    { table: 'organizations', type: 'organization', nameField: 'name' },
    { table: 'events', type: 'event', nameField: 'name' },
    { table: 'items', type: 'item', nameField: 'name' },
    { table: 'rules', type: 'rule', nameField: 'name' },
    { table: 'stories', type: 'story', nameField: 'title' },
  ]

  const typesToFetch = entityTypes
    ? allTypes.filter((t) => entityTypes.includes(t.type))
    : allTypes

  for (const { table, type, nameField } of typesToFetch) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('world_id', worldId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error(`Error fetching ${table} for export:`, error)
      continue
    }

    if (data) {
      for (const item of data) {
        const record = item as Record<string, unknown>
        entities.push({
          id: record.id as string,
          name: (record[nameField] || record.title) as string,
          type,
          data: record,
        })
      }
    }
  }

  return {
    worldName: world?.name || 'Unknown World',
    exportedAt: new Date().toISOString(),
    entities,
  }
}

/**
 * Generate JSON export string.
 */
export async function generateJsonExport(
  worldId: string,
  entityTypes?: EntityType[]
): Promise<string> {
  const data = await getExportData(worldId, entityTypes)
  return JSON.stringify(data, null, 2)
}

/**
 * Generate Markdown export for a single entity.
 */
function entityToMarkdown(entity: ExportEntity): string {
  const { name, type, data } = entity
  const lines: string[] = []

  lines.push(`# ${name}`)
  lines.push('')
  lines.push(`**Type:** ${type}`)
  lines.push('')

  // Add story context if present
  if (data.story_context) {
    lines.push('## Story Context')
    lines.push('')
    lines.push(data.story_context as string)
    lines.push('')
  }

  // Add type-specific fields
  const skipFields = ['id', 'world_id', 'created_at', 'updated_at', 'content_blocks', 'story_context', 'name', 'title']
  
  lines.push('## Details')
  lines.push('')

  for (const [key, value] of Object.entries(data)) {
    if (skipFields.includes(key) || value === null || value === '') continue
    
    const label = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    
    if (typeof value === 'string' && value.length > 100) {
      lines.push(`### ${label}`)
      lines.push('')
      lines.push(value)
      lines.push('')
    } else if (Array.isArray(value)) {
      lines.push(`**${label}:** ${value.join(', ')}`)
    } else {
      lines.push(`**${label}:** ${value}`)
    }
  }

  // Add content blocks
  const contentBlocks = data.content_blocks as Array<{ type: string; content: string }> | undefined
  if (contentBlocks && contentBlocks.length > 0) {
    lines.push('')
    lines.push('## Content')
    lines.push('')
    
    for (const block of contentBlocks) {
      if (block.type === 'text') {
        // Clean mentions for markdown
        const cleanContent = block.content.replace(/@\[(\w+):([a-f0-9-]+):([^\]]+)\]/g, '**$3**')
        lines.push(cleanContent)
        lines.push('')
      } else if (block.type === 'model') {
        lines.push(`[3D Model](${block.content})`)
        lines.push('')
      }
    }
  }

  return lines.join('\n')
}

/**
 * Generate combined Markdown export.
 */
export async function generateMarkdownExport(
  worldId: string,
  entityTypes?: EntityType[]
): Promise<string> {
  const data = await getExportData(worldId, entityTypes)
  const lines: string[] = []

  lines.push(`# ${data.worldName} - World Bible`)
  lines.push('')
  lines.push(`*Exported: ${new Date(data.exportedAt).toLocaleDateString()}*`)
  lines.push('')
  lines.push('---')
  lines.push('')

  // Group by type
  const byType = new Map<EntityType, ExportEntity[]>()
  for (const entity of data.entities) {
    const list = byType.get(entity.type) || []
    list.push(entity)
    byType.set(entity.type, list)
  }

  const typeLabels: Record<EntityType, string> = {
    character: 'Characters',
    location: 'Locations',
    organization: 'Organizations',
    event: 'Events',
    item: 'Items',
    rule: 'Rules',
    story: 'Stories',
  }

  for (const [type, entities] of byType) {
    lines.push(`# ${typeLabels[type]}`)
    lines.push('')
    
    for (const entity of entities) {
      lines.push(entityToMarkdown(entity))
      lines.push('')
      lines.push('---')
      lines.push('')
    }
  }

  return lines.join('\n')
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Exit 0

**Step 3: Commit**

```bash
git add lib/actions/export.ts
git commit -m "feat: add export server actions for JSON and Markdown generation"
```

---

## Task 14: Create Export Page

**Files:**
- Create: `app/(dashboard)/export/page.tsx`
- Create: `app/(dashboard)/export/export-client.tsx`

**Step 1: Create export client component**

Create `app/(dashboard)/export/export-client.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { Button, Card, CardContent } from '@/components/ui'
import { Download, FileJson, FileText, Loader2 } from 'lucide-react'
import { generateJsonExport, generateMarkdownExport } from '@/lib/actions/export'
import type { EntityType } from '@/lib/types/database'

interface ExportClientProps {
  worldId: string
  worldName: string
}

const entityTypes: { type: EntityType; label: string }[] = [
  { type: 'character', label: 'Characters' },
  { type: 'location', label: 'Locations' },
  { type: 'organization', label: 'Organizations' },
  { type: 'event', label: 'Events' },
  { type: 'item', label: 'Items' },
  { type: 'rule', label: 'Rules' },
  { type: 'story', label: 'Stories' },
]

export function ExportClient({ worldId, worldName }: ExportClientProps) {
  const [selectedTypes, setSelectedTypes] = useState<Set<EntityType>>(
    new Set(entityTypes.map((e) => e.type))
  )
  const [loading, setLoading] = useState<'json' | 'markdown' | null>(null)

  const toggleType = (type: EntityType) => {
    const newSet = new Set(selectedTypes)
    if (newSet.has(type)) {
      newSet.delete(type)
    } else {
      newSet.add(type)
    }
    setSelectedTypes(newSet)
  }

  const selectAll = () => {
    setSelectedTypes(new Set(entityTypes.map((e) => e.type)))
  }

  const selectNone = () => {
    setSelectedTypes(new Set())
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleJsonExport = async () => {
    setLoading('json')
    try {
      const types = Array.from(selectedTypes)
      const content = await generateJsonExport(worldId, types.length === 7 ? undefined : types)
      const filename = `${worldName.toLowerCase().replace(/\s+/g, '-')}-export.json`
      downloadFile(content, filename, 'application/json')
    } catch (error) {
      console.error('Export error:', error)
    }
    setLoading(null)
  }

  const handleMarkdownExport = async () => {
    setLoading('markdown')
    try {
      const types = Array.from(selectedTypes)
      const content = await generateMarkdownExport(worldId, types.length === 7 ? undefined : types)
      const filename = `${worldName.toLowerCase().replace(/\s+/g, '-')}-world-bible.md`
      downloadFile(content, filename, 'text/markdown')
    } catch (error) {
      console.error('Export error:', error)
    }
    setLoading(null)
  }

  return (
    <div className="space-y-6">
      {/* Entity type selection */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-900">Select Entity Types</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={selectNone}>
                Clear
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {entityTypes.map(({ type, label }) => (
              <label
                key={type}
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedTypes.has(type)
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.has(type)}
                  onChange={() => toggleType(type)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span className="text-sm font-medium text-slate-700">{label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export formats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* JSON Export */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-50 rounded-lg">
                <FileJson className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-slate-900">JSON Export</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Raw data format. Great for backups, migrations, or API integrations.
                </p>
                <Button
                  className="mt-4"
                  onClick={handleJsonExport}
                  disabled={selectedTypes.size === 0 || loading !== null}
                >
                  {loading === 'json' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Download JSON
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Markdown Export */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-slate-900">World Bible (Markdown)</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Formatted document with all entities. Import to Notion, Obsidian, or share with collaborators.
                </p>
                <Button
                  className="mt-4"
                  onClick={handleMarkdownExport}
                  disabled={selectedTypes.size === 0 || loading !== null}
                >
                  {loading === 'markdown' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Download Markdown
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedTypes.size === 0 && (
        <p className="text-center text-slate-500">
          Select at least one entity type to export.
        </p>
      )}
    </div>
  )
}
```

**Step 2: Create export page**

Create `app/(dashboard)/export/page.tsx`:

```typescript
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ExportClient } from './export-client'

export default async function ExportPage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value

  if (!worldId) {
    redirect('/dashboard')
  }

  const supabase = await createClient()
  const { data: world } = await supabase
    .from('worlds')
    .select('name')
    .eq('id', worldId)
    .single()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Export</h1>
        <p className="text-slate-600">
          Export your world data in various formats.
        </p>
      </div>

      <ExportClient worldId={worldId} worldName={world?.name || 'World'} />
    </div>
  )
}
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Exit 0

**Step 4: Commit**

```bash
git add app/(dashboard)/export/
git commit -m "feat: add export page with JSON and Markdown download options"
```

---

## Task 15: Add UX Improvements - Breadcrumbs Component

**Files:**
- Create: `components/ui/Breadcrumbs.tsx`
- Modify: `components/ui/index.ts`

**Step 1: Create Breadcrumbs component**

Create `components/ui/Breadcrumbs.tsx`:

```typescript
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1 text-sm text-slate-500 mb-4">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-slate-700 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4 text-slate-400" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-slate-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-700 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
```

**Step 2: Export from ui index**

In `components/ui/index.ts`, add:
```typescript
export { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs'
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Exit 0

**Step 4: Commit**

```bash
git add components/ui/Breadcrumbs.tsx components/ui/index.ts
git commit -m "feat: add Breadcrumbs component for navigation hierarchy"
```

---

## Task 16: Add Breadcrumbs to Entity Detail Pages

**Files:**
- Modify: `app/(dashboard)/characters/[id]/page.tsx`
- Modify: `app/(dashboard)/locations/[id]/page.tsx`
- Modify: `app/(dashboard)/items/[id]/page.tsx`
- Modify: `app/(dashboard)/organizations/[id]/page.tsx`
- Modify: `app/(dashboard)/rules/[id]/page.tsx`
- Modify: `app/(dashboard)/stories/[id]/page.tsx`
- Modify: `app/(dashboard)/timeline/[id]/page.tsx`

**Step 1: Update character detail page**

In `app/(dashboard)/characters/[id]/page.tsx`, add breadcrumbs:

Add import:
```typescript
import { Breadcrumbs } from '@/components/ui'
```

Add after the return statement starts, before the main content:
```typescript
<Breadcrumbs
  items={[
    { label: 'Characters', href: '/characters' },
    { label: character.name },
  ]}
/>
```

**Step 2: Repeat for all other entity detail pages**

Apply similar changes to:
- `app/(dashboard)/locations/[id]/page.tsx` - "Locations"
- `app/(dashboard)/items/[id]/page.tsx` - "Items"
- `app/(dashboard)/organizations/[id]/page.tsx` - "Organizations"
- `app/(dashboard)/rules/[id]/page.tsx` - "Rules"
- `app/(dashboard)/stories/[id]/page.tsx` - "Stories" (use `story.title`)
- `app/(dashboard)/timeline/[id]/page.tsx` - "Timeline"

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Exit 0

**Step 4: Commit**

```bash
git add app/(dashboard)/*/[id]/page.tsx
git commit -m "feat: add breadcrumbs to all entity detail pages"
```

---

## Task 17: Add Toast Notification System

**Files:**
- Create: `components/ui/Toast.tsx`
- Create: `lib/hooks/useToast.ts`
- Modify: `components/ui/index.ts`
- Modify: `app/(dashboard)/layout.tsx`

**Step 1: Create Toast component**

Create `components/ui/Toast.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: string
  type: ToastType
  message: string
}

interface ToastProps {
  toast: ToastMessage
  onDismiss: (id: string) => void
}

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  info: AlertCircle,
}

const styles: Record<ToastType, string> = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-sky-50 border-sky-200 text-sky-800',
}

const iconStyles: Record<ToastType, string> = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-sky-500',
}

function Toast({ toast, onDismiss }: ToastProps) {
  const Icon = icons[toast.type]

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 5000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${styles[toast.type]} animate-slide-in`}
    >
      <Icon className={`w-5 h-5 ${iconStyles[toast.type]}`} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 hover:bg-black/5 rounded"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body
  )
}
```

**Step 2: Create useToast hook**

Create `lib/hooks/useToast.ts`:

```typescript
'use client'

import { useState, useCallback, createContext, useContext } from 'react'
import type { ToastMessage, ToastType } from '@/components/ui/Toast'

interface ToastContextValue {
  toasts: ToastMessage[]
  addToast: (type: ToastType, message: string) => void
  dismissToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function useToastState() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setToasts((prev) => [...prev, { id, type, message }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, addToast, dismissToast }
}
```

**Step 3: Export Toast from ui index**

In `components/ui/index.ts`, add:
```typescript
export { ToastContainer, type ToastMessage, type ToastType } from './Toast'
```

**Step 4: Update dashboard layout with toast provider**

The layout needs to be updated to include the toast container. Update `app/(dashboard)/layout.tsx`:

```typescript
import { Sidebar } from '@/components/shell'
import { CommandPalette } from '@/components/search'
import { ToastContainer } from '@/components/ui'
import { cookies } from 'next/headers'
import { ToastProvider } from './toast-provider'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value || null

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
        <CommandPalette worldId={worldId} />
      </div>
    </ToastProvider>
  )
}
```

**Step 5: Create toast provider component**

Create `app/(dashboard)/toast-provider.tsx`:

```typescript
'use client'

import { ToastContainer } from '@/components/ui'
import { ToastContext, useToastState } from '@/lib/hooks/useToast'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, addToast, dismissToast } = useToastState()

  return (
    <ToastContext.Provider value={{ toasts, addToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}
```

**Step 6: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Exit 0

**Step 7: Commit**

```bash
git add components/ui/Toast.tsx lib/hooks/useToast.ts components/ui/index.ts app/(dashboard)/layout.tsx app/(dashboard)/toast-provider.tsx
git commit -m "feat: add toast notification system for user feedback"
```

---

## Task 18: Add Keyboard Shortcuts Hook

**Files:**
- Create: `lib/hooks/useKeyboardShortcuts.ts`

**Step 1: Create keyboard shortcuts hook**

Create `lib/hooks/useKeyboardShortcuts.ts`:

```typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  meta?: boolean
  shift?: boolean
  action: () => void
  description: string
}

/**
 * Hook to register keyboard shortcuts.
 * Shortcuts are disabled when typing in input/textarea elements.
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : true
        const metaMatch = shortcut.meta ? e.metaKey : true
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()

        if (ctrlMatch && metaMatch && shiftMatch && keyMatch) {
          e.preventDefault()
          shortcut.action()
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

/**
 * Hook for common navigation shortcuts.
 */
export function useNavigationShortcuts() {
  const router = useRouter()

  useKeyboardShortcuts([
    {
      key: 'g',
      ctrl: true,
      action: () => router.push('/graph'),
      description: 'Go to graph view',
    },
    {
      key: 'e',
      ctrl: true,
      action: () => router.push('/export'),
      description: 'Go to export',
    },
    {
      key: 'n',
      ctrl: true,
      shift: true,
      action: () => {
        // Open new entity modal (future enhancement)
        console.log('New entity shortcut triggered')
      },
      description: 'New entity',
    },
  ])
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Exit 0

**Step 3: Commit**

```bash
git add lib/hooks/useKeyboardShortcuts.ts
git commit -m "feat: add keyboard shortcuts hook for navigation"
```

---

## Task 19: Add Loading Skeletons

**Files:**
- Create: `components/ui/Skeleton.tsx`
- Modify: `components/ui/index.ts`

**Step 1: Create Skeleton component**

Create `components/ui/Skeleton.tsx`:

```typescript
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse bg-slate-200 rounded', className)}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  )
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="w-20 h-20 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  )
}
```

**Step 2: Export from ui index**

In `components/ui/index.ts`, add:
```typescript
export { Skeleton, CardSkeleton, ListSkeleton, DetailSkeleton } from './Skeleton'
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Exit 0

**Step 4: Commit**

```bash
git add components/ui/Skeleton.tsx components/ui/index.ts
git commit -m "feat: add skeleton loading components"
```

---

## Task 20: Add Animation CSS

**Files:**
- Modify: `app/globals.css`

**Step 1: Add animation keyframes**

In `app/globals.css`, add the animation keyframes:

```css
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
```

**Step 2: Verify dev server runs**

Run: `npm run dev`
Expected: Dev server starts without errors

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add slide-in animation for toast notifications"
```

---

## Task 21: Update Current Sprint Documentation

**Files:**
- Modify: `docs/current-sprint.md`

**Step 1: Update current sprint**

Update `docs/current-sprint.md` to reflect the implemented features:

Add new section at the top:

```markdown
## Recent Completion: Phase 2+3 Features

### @Mentions System (2026-01-30)

Implemented inline @mentions for linking entities within content blocks.

| Component | Purpose |
|-----------|---------|
| `MentionInput` | Textarea with autocomplete dropdown for @mentions |
| `MentionDropdown` | Searchable entity picker grouped by type |
| `searchEntities` | Server action for cross-entity search |
| `syncEntityMentions` | Auto-saves mention relationships to database |

**Features:**
- Type `@` in any content block to trigger autocomplete
- Search filters by name across all entity types
- Mentions render as clickable links in read mode
- Relationships tracked in `entity_mentions` table

### Relationship Graph (2026-01-30)

Interactive force-directed graph visualization of world entities and their connections.

| Component | Purpose |
|-----------|---------|
| `RelationshipGraph` | Force-directed graph using react-force-graph-2d |
| `GraphControls` | Filter by type, search, zoom controls |
| `/graph` route | Full-page graph view |

**Features:**
- Nodes colored by entity type
- Node size based on connection count
- Click to navigate to entity detail
- Filter toggles by entity type
- Search to highlight entities
- Fullscreen mode

### Global Search (2026-01-30)

Command palette for quick entity search accessible with keyboard shortcut.

| Component | Purpose |
|-----------|---------|
| `CommandPalette` | Modal search interface |
| `Cmd/Ctrl+K` | Keyboard shortcut to open |

**Features:**
- Real-time search across all entities
- Results grouped by type with icons
- Arrow key navigation
- Enter to select and navigate

### Export System (2026-01-30)

Export world data in multiple formats.

| Format | Use Case |
|--------|----------|
| JSON | Backups, migrations, API integration |
| Markdown | World Bible document for sharing |

**Features:**
- Select entity types to export
- Download as file

### UX Polish (2026-01-30)

| Feature | Description |
|---------|-------------|
| Breadcrumbs | Navigation hierarchy on detail pages |
| Toast notifications | Success/error feedback |
| Keyboard shortcuts | Ctrl+G (graph), Ctrl+E (export) |
| Loading skeletons | Placeholder content during load |
```

**Step 2: Commit**

```bash
git add docs/current-sprint.md
git commit -m "docs: update current sprint with Phase 2+3 completed features"
```

---

## Task 22: Final Verification

**Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: Exit 0

**Step 2: Run linter**

Run: `npm run lint`
Expected: Exit 0 (or only pre-existing warnings)

**Step 3: Run build**

Run: `npm run build`
Expected: Build completes successfully

**Step 4: Start dev server and test**

Run: `npm run dev`
Expected: Server starts, all pages load without errors

**Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete Phase 2+3 implementation

- @mentions system with autocomplete
- Interactive relationship graph
- Global search command palette (Cmd+K)
- Export to JSON and Markdown
- UX polish: breadcrumbs, toasts, skeletons, keyboard shortcuts"
```

---

## Summary

This implementation plan adds:

1. **@Mentions System** - Inline autocomplete for linking entities
2. **Relationship Graph** - Visual representation of entity connections
3. **Global Search** - Command palette with Cmd+K shortcut
4. **Export System** - JSON and Markdown export options
5. **UX Polish** - Breadcrumbs, toasts, skeletons, keyboard shortcuts

All features integrate with the existing codebase patterns and use server actions for data operations.
