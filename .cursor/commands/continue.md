---
name: continue
description: Query MCPs first, run pre-action checklist, then proceed with implementation
---

# /continue - MCP-First Implementation

**STOP. Before ANY implementation, you MUST query relevant MCPs.**

## Step 1: MCP Consultation (MANDATORY)

**DO THIS NOW - Call the relevant MCPs before anything else:**

| If your task involves... | CALL THIS MCP NOW |
|--------------------------|-------------------|
| Any library (React, Mantine, Motion, etc.) | **Context7** → `resolve-library-id` then `query-docs` |
| Multiple approaches or complex decisions | **Sequential Thinking** → structure your reasoning |
| Database queries or schema | **Supabase** → verify actual schema |
| Next.js routes, server actions, errors | **next-devtools** → `nextjs_index` then `nextjs_call` |
| Tailwind styling | **tailwindcss** → `get_tailwind_utilities` or `search_tailwind_docs` |
| UI testing or verification | **Playwright** → browser automation |
| Linting issues | **eslint** → `lint-files` |

**Minimum MCP set for ANY implementation:**
- Context7 for libraries you'll use
- Sequential Thinking if 2+ approaches exist

## Step 2: Pre-Action Checklist

After MCP consultation, verify:

1. **95% CONFIDENCE**: Do I fully understand what to build?
2. **BRAINSTORM**: Is this creative/new work? → Use brainstorming skill
3. **PLAN**: Is there an implementation plan? → Follow it or create one
4. **SKILL**: Does a skill apply? → Read and follow it

## Step 3: Show MCP Summary Before Proceeding

**You MUST show what MCPs you queried and what you learned:**

```
┌─────────────────────────────────────────────────────────────┐
│  MCP CONSULTATION COMPLETE                                  │
├─────────────────────────────────────────────────────────────┤
│  Context7:                                                  │
│    → Queried: [library name]                                │
│    → Learned: [key API/pattern discovered]                  │
│                                                             │
│  Sequential Thinking: (if used)                             │
│    → Structured: [X decisions/steps]                        │
│    → Key insight: [main takeaway]                           │
│                                                             │
│  Other MCPs: [list any others queried]                      │
├─────────────────────────────────────────────────────────────┤
│  Checklist:                                                 │
│    ✓ Confidence: [status]                                   │
│    ✓ Brainstorm: [needed/done/not needed]                   │
│    ✓ Plan: [following X / not needed]                       │
│    ✓ Skill: [using X / not needed]                          │
└─────────────────────────────────────────────────────────────┘
```

## Then Proceed

Only after showing the MCP summary, continue with implementation.
