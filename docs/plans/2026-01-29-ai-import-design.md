# AI Import Design

> **Status:** Approved
> **Date:** 2026-01-29
> **Phase:** 2 (Worldbuilder Core)

## Overview

Add AI-powered entity extraction to import content into worlds. Users paste text, AI extracts entities, user reviews and confirms creation.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Provider | OpenRouter | Works globally (HK), OpenAI-compatible API |
| Model | Deepseek V3.2 | Best cost/performance, #4 on OpenRouter |
| Scope | Entity extraction only | No chat for MVP, prove core value first |
| UI | World-level import page | Paste once, extract all entity types |
| Flow | Preview before create | User reviews extracted entities before confirming |

## Architecture

### File Structure

```
app/
  (dashboard)/
    import/
      page.tsx              # Import page UI
components/
  import/
    ImportForm.tsx          # Textarea + submit button
    ExtractionPreview.tsx   # Preview extracted entities
    EntityPreviewCard.tsx   # Single entity preview with checkbox
    index.ts
lib/
  ai/
    openrouter.ts           # OpenRouter client setup
    extract-entities.ts     # Entity extraction logic
    prompts.ts              # System prompts
  actions/
    import.ts               # Server action for import
```

### Environment Variables

```
OPENROUTER_API_KEY=sk-or-...
```

### Data Flow

1. User navigates to `/import` (within dashboard layout)
2. Pastes text content into textarea
3. Clicks "Extract Entities"
4. Server action sends content to OpenRouter (Deepseek V3.2)
5. AI returns structured JSON of extracted entities
6. UI shows preview with checkboxes for each entity
7. User reviews, unchecks unwanted entities
8. User clicks "Create Selected"
9. Server action creates entities in database
10. Redirect to dashboard

## Extraction Schema

### Input to AI

```typescript
interface ExtractionRequest {
  content: string;      // User's pasted text
  worldContext?: {      // Optional: existing world info
    name: string;
    genre?: string;
    existingCharacters?: string[];  // To avoid duplicates
  };
}
```

### Output from AI

```typescript
interface ExtractedEntities {
  characters: ExtractedCharacter[];
  locations: ExtractedLocation[];
  organizations: ExtractedOrganization[];
  items: ExtractedItem[];
  events: ExtractedEvent[];
}

interface ExtractedCharacter {
  name: string;
  role?: 'protagonist' | 'antagonist' | 'supporting' | 'background';
  species?: string;
  appearance?: string;
  personality?: string;
  background?: string;
  relationships?: string[];  // Free text: "ally of Kael", "sister of Aria"
}

interface ExtractedLocation {
  name: string;
  type?: 'planet' | 'continent' | 'country' | 'city' | 'district' | 'building' | 'room';
  description?: string;
  atmosphere?: string;
}

interface ExtractedOrganization {
  name: string;
  type?: 'government' | 'religion' | 'corporation' | 'guild' | 'family' | 'military' | 'secret_society';
  purpose?: string;
  description?: string;
}

interface ExtractedItem {
  name: string;
  type?: 'weapon' | 'vehicle' | 'artifact' | 'tool' | 'document' | 'clothing' | 'technology';
  description?: string;
  significance?: string;
}

interface ExtractedEvent {
  name: string;
  type?: 'historical' | 'plot_point' | 'scheduled' | 'recurring';
  description?: string;
  date?: string;
}
```

## System Prompt

```
You are an entity extraction assistant for worldbuilding content.

Your task: Extract characters, locations, organizations, items, and events from the provided text.

Rules:
1. Return ONLY valid JSON matching the exact schema provided
2. Only include entities explicitly mentioned in the text
3. Do not invent or assume information not present
4. Preserve the author's original names and descriptions
5. For relationships, use free text like "ally of [name]" or "located in [place]"
6. If uncertain about an entity type, omit it rather than guess

Schema: [schema provided in user message]
```

## UI Mockups

### Import Page

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Import Content                                         │
│  ───────────────                                        │
│                                                         │
│  Paste your world bible, character notes, or story     │
│  content below. AI will extract entities for you.      │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │  [Large textarea for pasting content]          │   │
│  │                                                 │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Extract Entities]                                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Extraction Preview

```
┌─────────────────────────────────────────────────────────┐
│  Extraction Results                                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Found 5 characters, 3 locations, 2 organizations      │
│                                                         │
│  Characters                                             │
│  ──────────                                             │
│  ☑ Aria - protagonist, silver hair, reluctant hero     │
│  ☑ Kael - supporting, warrior, Aria's mentor           │
│  ☑ Lord Varn - antagonist, ruler of the Shadow Court  │
│  ☐ Guard Captain - background (uncheck to skip)        │
│                                                         │
│  Locations                                              │
│  ─────────                                              │
│  ☑ Ironhold - city, fortified trading hub              │
│  ☑ The Shadow Court - building, Varn's stronghold     │
│                                                         │
│  Organizations                                          │
│  ─────────────                                          │
│  ☑ The Silver Guard - military, protects Ironhold     │
│                                                         │
│  [Cancel]                    [Create 9 Selected]       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Error Handling

| Error | Handling |
|-------|----------|
| API timeout | Show retry button, preserve input text |
| Invalid JSON from AI | Retry once, then show error with raw response |
| No entities found | Show message: "No entities found. Try adding more detail." |
| Rate limit | Show message with retry countdown |

## Future Enhancements (Not MVP)

- Chat mode ("Just Chat" path from import-design.md)
- Conflict detection with existing entities
- Batch import progress for large documents
- Model selection (free vs premium)
- Import history

## Implementation

See: `docs/plans/2026-01-29-ai-import-impl.md`
