# Product Philosophy

## Core Principle: Visual Asset-Driven

> **Assets are not attachments. Assets are the organizing metaphor.**

Unlike text-first tools (World Anvil, Campfire) or script-first tools (Clapperbie, StudioBinder), Vixio organizes around **visual assets** - characters, locations, props.

Everything flows from assets:
- Text describes assets
- Relationships connect assets
- Timelines show asset appearances
- Production docs export from assets
- Storyboards use assets as elements

---

## Soft vs Hard Worldbuilding

### The Core Insight

Worldbuilding exists on a spectrum:

| Soft Worldbuilding | Hard Worldbuilding |
|-------------------|-------------------|
| Evocative, serves the story | Internally consistent, explained |
| Doesn't need complete explanation | Everything tracked and validated |
| Studio Ghibli, fairy tales | Tolkien's languages, Sanderson's magic systems |
| Creativity-first | Consistency-first |

**Key realization**: Forcing "hard" worldbuilding as the default blocks creative flow.

## Vixio's Approach

The AI serves the creator's intent, not the other way around.

### Soft Mode (Default)
- Accepts what you say
- Builds on ideas creatively
- No forced structure
- "Cool, a 5000 year old elf. What's their story?"

### Hard Mode (Optional)
- Proactively flags inconsistencies
- Tracks relationships automatically
- Validates against established rules
- "You mentioned elves live 3000 years in chapter 2, but this elf is 5000 years old"

## Design Implications

### No Enforced Rules
- The tool is a **reference**, not a constraint
- AI **helps find** inconsistencies when asked
- User decides their worldbuilding style

### No Modes Needed (Simplification)
After further reflection: explicit "modes" may be unnecessary complexity.

If AI has ingested content, it can:
- Answer questions anytime (chat)
- Extract entities when asked ("show me all characters")
- Check consistency when asked ("any contradictions?")

The soft/hard distinction becomes a **setting** for AI behavior, not separate modes:

| Setting | AI Default Behavior |
|---------|-------------------|
| Soft | Creative companion, accepts input |
| Hard | Proactive consistency flagging |

User can toggle this, or even ask for hard-mode behavior in a soft-mode session.

## Import Philosophy

### What Happens After Import?

**Hybrid approach** (user choice):

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
│                                              │
│  [ Extract & Organize ]  [ Just Chat ]      │
└─────────────────────────────────────────────┘
```

- **"Just Chat"** - Content stays as-is, AI references it conversationally
- **"Extract & Organize"** - AI creates structured entity views

User can always switch between approaches later.

## Why This Matters

Traditional tools force structure:
```
Structured input → Parser → Database fields
```

AI-native approach:
```
Messy document → AI reads it → Understands context
```

You don't need perfect parsing. The AI can read a Google Doc dump and understand "this is a character, this is a location, these are related."

## Differentiation Summary

| Existing Tools | Vixio Worldbuilder |
|---------------|-------------------|
| Database with forms | AI conversation with context |
| One approach (structured) | Soft/hard toggle |
| You organize everything | AI helps find what matters |
| Rigid import formats | Import YOUR format (markdown, docs, plain text) |
