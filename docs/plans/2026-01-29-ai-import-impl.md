# AI Import Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add AI-powered entity extraction using OpenRouter (Deepseek V3.2). Users paste text, preview extracted entities, create selected.

**Architecture:** Server action calls OpenRouter API, returns structured JSON. React components for import form and preview. No schema changes needed.

**Tech Stack:** OpenRouter API, openai npm package, React Server Actions

---

## Task 1: Install OpenAI Package

**Files:**
- Modify: `package.json`

**Step 1: Install the openai package**

```bash
npm install openai
```

**Step 2: Verify installation**

Run: `npm ls openai`
Expected: openai@x.x.x

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: Add openai package for OpenRouter API"
```

---

## Task 2: Create OpenRouter Client

**Files:**
- Create: `lib/ai/openrouter.ts`

**Step 1: Create the client**

```typescript
import OpenAI from 'openai';

if (!process.env.OPENROUTER_API_KEY) {
  console.warn('OPENROUTER_API_KEY not set - AI features disabled');
}

export const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'Vixio Worldbuilder',
  },
});

export const AI_MODEL = 'deepseek/deepseek-v3.2';
```

**Step 2: Verify TypeScript compiles**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: Exit 0

**Step 3: Commit**

```bash
git add lib/ai/openrouter.ts
git commit -m "feat: Add OpenRouter client configuration"
```

---

## Task 3: Create Extraction Types

**Files:**
- Create: `lib/ai/types.ts`

**Step 1: Create the types file**

```typescript
// Extracted entity types from AI

export interface ExtractedCharacter {
  name: string;
  role?: 'protagonist' | 'antagonist' | 'supporting' | 'background';
  species?: string;
  appearance?: string;
  personality?: string;
  background?: string;
  relationships?: string[];
}

export interface ExtractedLocation {
  name: string;
  type?: 'planet' | 'continent' | 'country' | 'city' | 'district' | 'building' | 'room';
  description?: string;
  atmosphere?: string;
}

export interface ExtractedOrganization {
  name: string;
  type?: 'government' | 'religion' | 'corporation' | 'guild' | 'family' | 'military' | 'secret_society';
  purpose?: string;
  description?: string;
}

export interface ExtractedItem {
  name: string;
  type?: 'weapon' | 'vehicle' | 'artifact' | 'tool' | 'document' | 'clothing' | 'technology';
  description?: string;
  significance?: string;
}

export interface ExtractedEvent {
  name: string;
  type?: 'historical' | 'plot_point' | 'scheduled' | 'recurring';
  description?: string;
  date?: string;
}

export interface ExtractedEntities {
  characters: ExtractedCharacter[];
  locations: ExtractedLocation[];
  organizations: ExtractedOrganization[];
  items: ExtractedItem[];
  events: ExtractedEvent[];
}

export interface ExtractionResult {
  success: boolean;
  entities?: ExtractedEntities;
  error?: string;
}
```

**Step 2: Commit**

```bash
git add lib/ai/types.ts
git commit -m "types: Add extracted entity types for AI import"
```

---

## Task 4: Create Entity Extraction Function

**Files:**
- Create: `lib/ai/extract-entities.ts`

**Step 1: Create the extraction function**

```typescript
import { openrouter, AI_MODEL } from './openrouter';
import { ExtractedEntities, ExtractionResult } from './types';

const SYSTEM_PROMPT = `You are an entity extraction assistant for worldbuilding content.

Your task: Extract characters, locations, organizations, items, and events from the provided text.

Rules:
1. Return ONLY valid JSON matching the exact schema
2. Only include entities explicitly mentioned in the text
3. Do not invent or assume information not present
4. Preserve the author's original names and descriptions
5. For relationships, use free text like "ally of [name]"
6. If uncertain about an entity type, omit it

Return JSON in this exact format:
{
  "characters": [{ "name": "...", "role": "protagonist|antagonist|supporting|background", "species": "...", "appearance": "...", "personality": "...", "background": "...", "relationships": ["..."] }],
  "locations": [{ "name": "...", "type": "planet|continent|country|city|district|building|room", "description": "...", "atmosphere": "..." }],
  "organizations": [{ "name": "...", "type": "government|religion|corporation|guild|family|military|secret_society", "purpose": "...", "description": "..." }],
  "items": [{ "name": "...", "type": "weapon|vehicle|artifact|tool|document|clothing|technology", "description": "...", "significance": "..." }],
  "events": [{ "name": "...", "type": "historical|plot_point|scheduled|recurring", "description": "...", "date": "..." }]
}

Only include fields that have values. Empty arrays are fine.`;

export async function extractEntities(content: string): Promise<ExtractionResult> {
  if (!process.env.OPENROUTER_API_KEY) {
    return { success: false, error: 'AI features not configured' };
  }

  try {
    const response = await openrouter.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Extract entities from this text:\n\n${content}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 4000,
    });

    const text = response.choices[0]?.message?.content;
    if (!text) {
      return { success: false, error: 'No response from AI' };
    }

    const entities: ExtractedEntities = JSON.parse(text);
    
    // Ensure all arrays exist
    return {
      success: true,
      entities: {
        characters: entities.characters || [],
        locations: entities.locations || [],
        organizations: entities.organizations || [],
        items: entities.items || [],
        events: entities.events || [],
      },
    };
  } catch (error) {
    console.error('Entity extraction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Extraction failed',
    };
  }
}
```

**Step 2: Verify TypeScript compiles**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: Exit 0

**Step 3: Commit**

```bash
git add lib/ai/extract-entities.ts
git commit -m "feat: Add entity extraction function with Deepseek"
```

---

## Task 5: Create Import Server Action

**Files:**
- Create: `lib/actions/import.ts`

**Step 1: Create the server action**

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { extractEntities } from '@/lib/ai/extract-entities';
import { ExtractedEntities, ExtractionResult } from '@/lib/ai/types';
import { revalidatePath } from 'next/cache';

export async function extractFromContent(content: string): Promise<ExtractionResult> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  return extractEntities(content);
}

interface CreateEntitiesParams {
  worldId: string;
  entities: ExtractedEntities;
  selected: {
    characters: number[];
    locations: number[];
    organizations: number[];
    items: number[];
    events: number[];
  };
}

export async function createExtractedEntities(params: CreateEntitiesParams): Promise<{ success: boolean; error?: string; created?: number }> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { worldId, entities, selected } = params;
  let created = 0;

  try {
    // Create selected characters
    for (const idx of selected.characters) {
      const char = entities.characters[idx];
      if (char) {
        await supabase.from('characters').insert({
          world_id: worldId,
          name: char.name,
          role: char.role || null,
          species: char.species || null,
          appearance: char.appearance || null,
          personality: char.personality || null,
          background: char.background || null,
        });
        created++;
      }
    }

    // Create selected locations
    for (const idx of selected.locations) {
      const loc = entities.locations[idx];
      if (loc) {
        await supabase.from('locations').insert({
          world_id: worldId,
          name: loc.name,
          type: loc.type || null,
          description: loc.description || null,
          atmosphere: loc.atmosphere || null,
        });
        created++;
      }
    }

    // Create selected organizations
    for (const idx of selected.organizations) {
      const org = entities.organizations[idx];
      if (org) {
        await supabase.from('organizations').insert({
          world_id: worldId,
          name: org.name,
          type: org.type || null,
          purpose: org.purpose || null,
        });
        created++;
      }
    }

    // Create selected items
    for (const idx of selected.items) {
      const item = entities.items[idx];
      if (item) {
        await supabase.from('items').insert({
          world_id: worldId,
          name: item.name,
          type: item.type || null,
          description: item.description || null,
          significance: item.significance || null,
        });
        created++;
      }
    }

    // Create selected events
    for (const idx of selected.events) {
      const event = entities.events[idx];
      if (event) {
        await supabase.from('events').insert({
          world_id: worldId,
          name: event.name,
          type: event.type || null,
          description: event.description || null,
          date: event.date || null,
        });
        created++;
      }
    }

    revalidatePath('/dashboard');
    return { success: true, created };
  } catch (error) {
    console.error('Create entities error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create entities',
    };
  }
}
```

**Step 2: Verify TypeScript compiles**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: Exit 0

**Step 3: Commit**

```bash
git add lib/actions/import.ts
git commit -m "feat: Add import server actions for extraction and creation"
```

---

## Task 6: Create Import Page

**Files:**
- Create: `app/(dashboard)/import/page.tsx`

**Step 1: Create the import page**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { extractFromContent, createExtractedEntities } from '@/lib/actions/import';
import { ExtractedEntities } from '@/lib/ai/types';

export default function ImportPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [entities, setEntities] = useState<ExtractedEntities | null>(null);
  const [selected, setSelected] = useState<{
    characters: number[];
    locations: number[];
    organizations: number[];
    items: number[];
    events: number[];
  }>({ characters: [], locations: [], organizations: [], items: [], events: [] });

  const handleExtract = async () => {
    if (!content.trim()) {
      setError('Please paste some content to extract from');
      return;
    }

    setLoading(true);
    setError('');
    setEntities(null);

    const result = await extractFromContent(content);

    if (result.success && result.entities) {
      setEntities(result.entities);
      // Select all by default
      setSelected({
        characters: result.entities.characters.map((_, i) => i),
        locations: result.entities.locations.map((_, i) => i),
        organizations: result.entities.organizations.map((_, i) => i),
        items: result.entities.items.map((_, i) => i),
        events: result.entities.events.map((_, i) => i),
      });
    } else {
      setError(result.error || 'Extraction failed');
    }

    setLoading(false);
  };

  const toggleSelection = (type: keyof typeof selected, index: number) => {
    setSelected(prev => ({
      ...prev,
      [type]: prev[type].includes(index)
        ? prev[type].filter(i => i !== index)
        : [...prev[type], index],
    }));
  };

  const handleCreate = async () => {
    if (!entities) return;

    // TODO: Get actual worldId from context/cookies
    const worldId = 'placeholder-world-id';

    setLoading(true);
    const result = await createExtractedEntities({
      worldId,
      entities,
      selected,
    });

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Failed to create entities');
    }
    setLoading(false);
  };

  const totalSelected = Object.values(selected).flat().length;

  if (entities) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Extraction Results</h1>
          <Button variant="secondary" onClick={() => setEntities(null)}>
            ← Back
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Characters */}
          {entities.characters.length > 0 && (
            <Card>
              <h2 className="mb-3 text-lg font-semibold text-white">
                Characters ({entities.characters.length})
              </h2>
              <div className="space-y-2">
                {entities.characters.map((char, idx) => (
                  <label key={idx} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected.characters.includes(idx)}
                      onChange={() => toggleSelection('characters', idx)}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium text-white">{char.name}</span>
                      {char.role && (
                        <span className="ml-2 text-sm text-zinc-400">({char.role})</span>
                      )}
                      {char.appearance && (
                        <p className="text-sm text-zinc-400">{char.appearance}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </Card>
          )}

          {/* Locations */}
          {entities.locations.length > 0 && (
            <Card>
              <h2 className="mb-3 text-lg font-semibold text-white">
                Locations ({entities.locations.length})
              </h2>
              <div className="space-y-2">
                {entities.locations.map((loc, idx) => (
                  <label key={idx} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected.locations.includes(idx)}
                      onChange={() => toggleSelection('locations', idx)}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium text-white">{loc.name}</span>
                      {loc.type && (
                        <span className="ml-2 text-sm text-zinc-400">({loc.type})</span>
                      )}
                      {loc.description && (
                        <p className="text-sm text-zinc-400">{loc.description}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </Card>
          )}

          {/* Organizations */}
          {entities.organizations.length > 0 && (
            <Card>
              <h2 className="mb-3 text-lg font-semibold text-white">
                Organizations ({entities.organizations.length})
              </h2>
              <div className="space-y-2">
                {entities.organizations.map((org, idx) => (
                  <label key={idx} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected.organizations.includes(idx)}
                      onChange={() => toggleSelection('organizations', idx)}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium text-white">{org.name}</span>
                      {org.type && (
                        <span className="ml-2 text-sm text-zinc-400">({org.type})</span>
                      )}
                      {org.purpose && (
                        <p className="text-sm text-zinc-400">{org.purpose}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </Card>
          )}

          {/* Items */}
          {entities.items.length > 0 && (
            <Card>
              <h2 className="mb-3 text-lg font-semibold text-white">
                Items ({entities.items.length})
              </h2>
              <div className="space-y-2">
                {entities.items.map((item, idx) => (
                  <label key={idx} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected.items.includes(idx)}
                      onChange={() => toggleSelection('items', idx)}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium text-white">{item.name}</span>
                      {item.type && (
                        <span className="ml-2 text-sm text-zinc-400">({item.type})</span>
                      )}
                      {item.description && (
                        <p className="text-sm text-zinc-400">{item.description}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </Card>
          )}

          {/* Events */}
          {entities.events.length > 0 && (
            <Card>
              <h2 className="mb-3 text-lg font-semibold text-white">
                Events ({entities.events.length})
              </h2>
              <div className="space-y-2">
                {entities.events.map((event, idx) => (
                  <label key={idx} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected.events.includes(idx)}
                      onChange={() => toggleSelection('events', idx)}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium text-white">{event.name}</span>
                      {event.type && (
                        <span className="ml-2 text-sm text-zinc-400">({event.type})</span>
                      )}
                      {event.description && (
                        <p className="text-sm text-zinc-400">{event.description}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setEntities(null)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={loading || totalSelected === 0}>
            {loading ? 'Creating...' : `Create ${totalSelected} Selected`}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <Button variant="secondary" onClick={() => router.push('/dashboard')}>
          ← Back to Dashboard
        </Button>
      </div>

      <h1 className="mb-2 text-2xl font-bold text-white">Import Content</h1>
      <p className="mb-6 text-zinc-400">
        Paste your world bible, character notes, or story content below.
        AI will extract entities for you to review.
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste your content here...

Example:
Queen Aria rules Ironhold from the Crystal Palace. Her trusted advisor, Kael the Grey, has served the throne for thirty years. The city is protected by the Silver Guard, an elite military order founded after the Great War..."
        className="mb-4 min-h-[300px]"
      />

      <Button onClick={handleExtract} disabled={loading || !content.trim()}>
        {loading ? 'Extracting...' : 'Extract Entities'}
      </Button>
    </div>
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: Exit 0

**Step 3: Commit**

```bash
git add app/\(dashboard\)/import/page.tsx
git commit -m "feat: Add import page with extraction preview"
```

---

## Task 7: Update Environment Example

**Files:**
- Modify: `.env.example`

**Step 1: Add OpenRouter key to example**

Add line:
```
OPENROUTER_API_KEY=sk-or-your-key-here
```

**Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: Add OPENROUTER_API_KEY to env example"
```

---

## Task 8: Update Documentation

**Files:**
- Modify: `docs/current-sprint.md`

**Step 1: Update sprint docs**

Add section documenting AI import completion and update the checklist.

**Step 2: Commit**

```bash
git add docs/current-sprint.md
git commit -m "docs: Update sprint with AI import implementation"
```

---

## Task 9: Final Verification and Push

**Step 1: TypeScript check**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: Exit 0

**Step 2: Lint check**

Run: `npm run lint`
Expected: Exit 0 (or warnings only)

**Step 3: Push**

```bash
git push -u origin cursor/entity-schema-content-blocks-4f1f
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Install openai package |
| 2 | Create OpenRouter client |
| 3 | Create extraction types |
| 4 | Create entity extraction function |
| 5 | Create import server action |
| 6 | Create import page |
| 7 | Update environment example |
| 8 | Update documentation |
| 9 | Final verification and push |

**Estimated commits:** 8
**Risk level:** Medium (external API dependency)

**Note:** The import page has a placeholder `worldId`. Integration with world selection context is needed for full functionality.
