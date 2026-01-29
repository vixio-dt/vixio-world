# Import Feature Design

> **Date:** 2026-01-28
> **Status:** Draft - Pending Validation
> **Source:** Brainstorming session (product-plan/features/import-design.md)

## Goal

Allow users to import existing world content (plain text) and immediately start working with an AI that understands their world.

## Architecture

Import is the **central feature** that differentiates Vixio from form-based tools. Users bring existing content; AI comprehends it.

**Key principle:** The AI serves the creator's intent, not the other way around.

## Import Types

### Macro Import (World Bible)
- **Input:** Plain text paste/upload
- **Scope:** Entire world or large sections
- **Use case:** "Here's my 50-page world bible document"

### Micro Import (Single Element)
- **Input:** Character backstory, location description
- **Scope:** Single entity or small related group
- **Use case:** "Here's Aria's full character history"

## User Flow

```
┌─────────────────────────────────────────────┐
│  IMPORT                                      │
│  ─────────────────                           │
│  [ Paste your content here...             ] │
│  [                                         ] │
│                                              │
│  Import type:                                │
│  ○ World Bible (macro)                      │
│  ○ Character/Element (micro)                │
│                                              │
│  [ Import ]                                  │
└─────────────────────────────────────────────┘
            │
            ▼
     AI processes content...
            │
            ▼
┌─────────────────────────────────────────────┐
│  IMPORT COMPLETE                             │
│                                              │
│  ✓ AI has read your content                 │
│                                              │
│  I noticed:                                  │
│  • 5 possible characters                    │
│  • 3 locations mentioned                    │
│  • 2 factions/groups                        │
│                                              │
│  [ Extract & Organize ]  [ Just Chat ]      │
└─────────────────────────────────────────────┘
```

## Two Paths After Import

### Path A: "Just Chat" (Soft Worldbuilding)
- Content stays as raw/original text
- AI has full context for conversations
- No structured entities created
- User can ask anything about the world
- Can always extract later

### Path B: "Extract & Organize" (Structured)
- AI creates entity cards/entries
- Relationships mapped
- Browsable views available
- Can still chat freely

## Technical Components

### 1. Import UI (`src/pages/import/ImportPage.tsx`)
- Text area for pasting content
- Radio buttons for import type (macro/micro)
- Submit button
- Loading state during AI processing

### 2. AI Processing
- Send content to AI with world context
- AI identifies entities (characters, locations, etc.)
- AI notes relationships
- Return summary of what was found

### 3. Storage
- Store raw imported content
- Store AI analysis results
- Link to current world

### 4. Post-Import UI
- Show AI summary
- Two action buttons: "Extract & Organize" / "Just Chat"
- Navigate to appropriate view

## MVP Scope

**In scope:**
- Plain text import (paste)
- Macro import type only
- AI processing to identify entities
- "Just Chat" path (soft worldbuilding)
- Store imported content

**Out of scope (Phase 2+):**
- File upload (PDF, DOCX)
- Micro import
- "Extract & Organize" path
- Entity extraction to structured views

## Success Criteria

1. User can paste plain text world content
2. AI processes and summarizes what it found
3. User can chat with AI about their world
4. Imported content persists across sessions

## Questions to Validate

1. Is the MVP scope correct (just paste + chat)?
2. Should AI processing happen client-side or server-side?
3. What's the maximum content size we should support?
