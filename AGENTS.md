---
description: Project rules and skills for vixio-world development
alwaysApply: true
---

# AGENTS.md

<project_rules priority="0">

## Mandatory Rules

1. **MCP-First (ALWAYS)**: Before ANY implementation, you MUST query relevant MCPs first:
   - **Context7** for any library (Mantine, React, Motion, etc.) - get current docs
   - **Sequential Thinking** for complex decisions (2+ approaches)
   - **Supabase** for database work - verify actual schema
   - **next-devtools** for Next.js code - check runtime state
   - **tailwindcss** for styling - get correct utilities
   - Show what you learned from MCPs before proceeding. This is NOT optional.

2. **95% Confidence Rule**: Do NOT make changes until you have 95% confidence you understand what to build. Ask clarifying questions until you reach that confidence.

3. **Always Recommend with Reasoning**: When presenting options, ALWAYS include your recommendation and explain WHY. Lead with your recommendation and reasoning.

4. **Brainstorm Before Build**: Use the `brainstorming` skill before any creative work. Never skip this step.

5. **Verify Before Claiming Done**: Use the `verification-before-completion` skill before claiming any work is complete.

6. **Update Docs After Actions**: After completing any task, update relevant documentation:
   - Update `docs/current-sprint.md` with progress
   - Update roadmap if scope changes
   - Never leave documentation stale

</project_rules>

<skills_system priority="1">

## Available Skills

Skills are in `.claude/skills/`. Read the SKILL.md file when the situation matches.

| Skill | When to Use |
|-------|-------------|
| `brainstorming` | Before any creative work - features, components, modifications |
| `writing-plans` | When you have a spec and need an implementation plan |
| `executing-plans` | To execute a plan in a separate session with checkpoints |
| `subagent-driven-development` | To execute a plan with subagents in current session |
| `dispatching-parallel-agents` | When facing 2+ independent tasks |
| `systematic-debugging` | When encountering any bug or unexpected behavior |
| `test-driven-development` | Before writing implementation code |
| `verification-before-completion` | Before claiming work is done |
| `requesting-code-review` | Before merging or after major features |
| `receiving-code-review` | When getting code review feedback |
| `using-git-worktrees` | To isolate feature work in a worktree |
| `finishing-a-development-branch` | When implementation is complete, deciding merge/PR |
| `using-superpowers` | Overview of the skills system |
| `writing-skills` | When creating or editing skills |
| `supabase-postgres-best-practices` | When writing SQL, designing schemas, or optimizing DB |
| `react-best-practices` | When writing React/Next.js components or optimizing performance |
| `code-execution` | For bulk operations (10+ files) to save 90%+ tokens |
| `code-auditor` | When auditing code quality, security, or finding technical debt |
| `dev-bot-agent` | When processing tasks from the Slack dev-bot |
| `remote-headless-development` | When controlling Cursor remotely from mobile or another machine |

</skills_system>

<mcp_servers priority="2">

## MCP Servers (Live Data Tools)

MCP servers provide REAL-TIME access to external systems. **Prefer them over static approaches.**

| MCP Server | Use For | Instead Of |
|------------|---------|------------|
| **Context7** | Library docs (React, Mantine, any npm package) | Web search for API syntax |
| **Sequential Thinking** | Complex multi-step reasoning | Ad-hoc problem solving |
| **next-devtools** | Next.js runtime errors, routes, Server Actions | Guessing build issues |
| **Supabase** | Live DB queries, auth, RLS policies | Guessing schema |
| **tailwindcss** | Tailwind utilities, CSS-to-Tailwind | Guessing class names |
| **eslint** | Linting diagnostics and fixes | Manual lint error fixing |
| **Playwright** | E2E testing, screenshots | Manual browser testing |
| **Sentry** | Error monitoring, crash reports | Guessing prod issues |
| **GitHub** | PRs, issues, repo management | Manual git operations |
| **AntVis Chart** | Data visualizations, charts, diagrams | Manual chart building |
| **Memory** | Persist decisions across sessions | Repeating context |
| **Fetch** | Web content retrieval | Assuming content |

### When to Use MCP First

| Situation | MCP to Use |
|-----------|------------|
| "Implement X using Mantine/React/any library" | **Context7** (get docs first!) |
| "Build a Next.js route or Server Action" | **next-devtools** |
| "What's the schema for X table?" | **Supabase** |
| "Fix this lint error" | **eslint** |
| "Style this component with Tailwind" | **tailwindcss** |
| "Test the login flow" | **Playwright** |
| "What errors are happening in prod?" | **Sentry** |
| "Remember this architectural decision" | **Memory** |
| "Complex problem needs step-by-step thinking" | **Sequential Thinking** |

</mcp_servers>

<commands priority="3">

## Commands

Use `/command` in chat to trigger workflows:

| Command | Triggers |
|---------|----------|
| `/continue` | **Query MCPs first, show summary, then proceed** |
| `/brainstorm` | Design session before building |
| `/plan` | Create implementation plan |
| `/execute` | Run plan with checkpoints |
| `/subagent` | Run plan with subagents |
| `/parallel` | Dispatch parallel agents |
| `/debug` | Systematic debugging |
| `/tdd` | Test-driven development |
| `/verify` | Pre-completion verification |
| `/review` | Request code review |
| `/respond-review` | Respond to code review |
| `/worktree` | Create git worktree |
| `/finish` | Complete a branch |
| `/superpowers` | Skills overview |
| `/new-skill` | Create a new skill |
| `/audit` | Run code auditor |

</commands>

<subagents priority="4">

## Subagents

Specialized agents for parallel execution:

| Subagent | Purpose |
|----------|---------|
| `implementer` | Execute single task from plan |
| `spec-reviewer` | Verify work matches requirements |
| `code-reviewer` | Review code quality and standards |

</subagents>
