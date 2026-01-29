# Feature Design: Import

## Overview

Import is the **central feature** that differentiates Vixio from form-based tools. Users bring existing content; AI understands it.

## Import Types

### Macro Import (World Bible)
For importing complete or partial world bibles.

**Input**: Plain text, markdown, or pasted content
**Scope**: Entire world or large sections
**Example**: "Here's my 50-page world bible document"

### Micro Import (Single Element)
For adding individual pieces to existing world.

**Input**: Character backstory, location description, event details
**Scope**: Single entity or small related group
**Example**: "Here's Aria's full character history"

## Import Flow

### Step 1: Input
```
┌─────────────────────────────────────────────┐
│  IMPORT                                      │
│  ─────────────────                           │
│  [ Paste your content here...             ] │
│  [                                         ] │
│  [                                         ] │
│                                              │
│  Import type:                                │
│  ○ World Bible (macro)                      │
│  ○ Character/Element (micro)                │
│                                              │
│  [ Import ]                                  │
└─────────────────────────────────────────────┘
```

### Step 2: AI Processing
- AI reads full content
- Identifies potential entities (characters, locations, etc.)
- Notes relationships and connections
- Flags any obvious inconsistencies (for hard mode users)

### Step 3: User Choice
```
┌─────────────────────────────────────────────┐
│  IMPORT COMPLETE                             │
│                                              │
│  ✓ AI has read your content                 │
│                                              │
│  I noticed:                                  │
│  • 5 possible characters                    │
│  • 3 locations mentioned                    │
│  • 2 factions/groups                        │
│  • Several timeline events                  │
│                                              │
│  What would you like to do?                 │
│                                              │
│  [ Extract & Organize ]  [ Just Chat ]      │
│                                              │
│  "Extract" creates structured entries        │
│  "Just Chat" keeps it free-form             │
└─────────────────────────────────────────────┘
```

## Two Paths After Import

### Path A: "Just Chat" (Soft Worldbuilding)

- Content stays as raw/original text
- AI has full context for conversations
- No structured entities created
- User can ask anything about the world
- Can always extract later

**Best for:**
- Early exploration
- Users who hate forms
- Soft worldbuilders
- Quick imports

### Path B: "Extract & Organize" (Structured)

- AI creates entity cards/entries
- Relationships mapped
- Browsable views available
- Node visualization possible
- Can still chat freely

**Best for:**
- Large, complex worlds
- Visual thinkers
- Users who want to browse
- Hard worldbuilders

## Format Support

### Phase 1 (MVP)
- Plain text (paste)
- Markdown files

### Phase 2
- PDF extraction
- Word documents (.docx)
- Google Docs (paste)

### Future Consideration
- World Anvil export import
- Campfire export import
- Obsidian vault import
- Notion export import

## AI Parsing Approach

Traditional tools:
```
Structured input → Rigid parser → Database fields
```

Vixio approach:
```
Messy document → LLM comprehension → Contextual understanding
```

**Key insight**: We don't need perfect parsing. The AI understands context, not just structure.

Example: A paragraph mentioning "Queen Aria rules Ironhold with her council of five" creates understanding of:
- Character: Aria (role: Queen)
- Location: Ironhold (type: kingdom/city)
- Relationship: Aria rules Ironhold
- Group: Council (size: 5, relationship to Aria)

No forms required.

## Incremental Import

Users can import multiple times:
1. Import world bible (macro)
2. Later, import a new character's backstory (micro)
3. AI integrates new content with existing world context
4. Flags potential conflicts if in hard mode

## Edge Cases

### Conflicting Information
- Soft mode: Accept both, let user resolve later
- Hard mode: Flag immediately, ask for clarification

### Duplicate Entities
- AI detects possible duplicates ("Is this Aria the same as the Queen mentioned earlier?")
- User confirms or clarifies

### Very Large Imports
- Process in chunks if needed
- Provide progress feedback
- Allow partial extraction
