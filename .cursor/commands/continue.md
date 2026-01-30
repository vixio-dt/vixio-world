---
name: continue
description: Run pre-action checklist and proceed with implementation
---

**STOP. Before proceeding, run through the pre-action checklist.**

Read `.cursor/rules/pre-action-checklist.mdc` and verify each item:

## Pre-Action Checklist

1. **95% CONFIDENCE**: Do I fully understand what to build?
   - If NO → Ask clarifying questions first

2. **BRAINSTORM**: Is this creative/new work?
   - If YES → Use brainstorming skill at `.claude/skills/brainstorming/SKILL.md`

3. **MCP-FIRST**: Does this involve external data/APIs?
   - Libraries/docs → Context7 MCP
   - Database/schema → Supabase MCP
   - Next.js runtime → next-devtools MCP
   - Styling/Tailwind → tailwindcss MCP
   - Linting errors → eslint MCP
   - UI testing → Playwright MCP
   - Production errors → Sentry MCP
   - PRs/issues/commits → GitHub MCP
   - Charts/diagrams → AntVis Chart MCP

4. **COMPLEX REASONING**: Does this involve...
   - Choosing between 3+ approaches? → Sequential Thinking MCP
   - Debugging with multiple hypotheses? → Sequential Thinking MCP
   - Ambiguous/conflicting requirements? → Sequential Thinking MCP
   - Already failed once at this? → Sequential Thinking MCP

5. **PLAN**: Is there an implementation plan for complex work?
   - If NO → Create plan first using `.claude/skills/writing-plans/SKILL.md`
   - If YES → Follow the plan steps

6. **SKILL MATCH**: Does a skill apply?
   - Check skills table in `AGENTS.md`
   - Read and follow matching skill

## Then Proceed

Once ALL checklist items are verified, continue with the implementation work.

Show a brief summary of checklist status before proceeding:
```
✓ Confidence: [status]
✓ Brainstorm: [needed/not needed/done]
✓ MCP: [consulted X / not needed]
✓ Plan: [following plan X / not needed]
✓ Skill: [using X / not needed]
```
