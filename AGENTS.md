---
description: Project rules and skills for vixio-world development
alwaysApply: true
---

# AGENTS.md

<project_rules priority="0">

## Mandatory Rules

1. **95% Confidence Rule**: Do NOT make changes until you have 95% confidence you understand what to build. Ask clarifying questions until you reach that confidence. This applies to ALL work - features, bugfixes, refactors, documentation.

2. **Always Recommend with Reasoning**: When presenting options, ALWAYS include your recommendation and explain WHY. Don't just list options neutrally - lead with your recommendation and reasoning, then present alternatives.

3. **Brainstorm Before Build**: Use the `brainstorming` skill before any creative work. Never skip this step.

4. **Verify Before Claiming Done**: Use the `verification-before-completion` skill before claiming any work is complete.

5. **Update Docs After Actions**: After completing any task, update relevant documentation:
  - Update `docs/current-sprint.md` with progress
  - Update roadmap if scope changes
  - Update implementation plan if approach changes
  - Never leave documentation stale

6. **MCP-First for Live Data**: Before guessing about database schema, library APIs, production errors, or external state, check if an MCP server can provide real data. Use Supabase MCP for DB, Context7 for docs, Sentry for errors, GitHub for PRs/issues.

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

</skills_system>

<mcp_servers priority="2">

## MCP Servers (Live Data Tools)

MCP servers provide REAL-TIME access to external systems. **Prefer them over static approaches.**

| MCP Server | Use For | Instead Of |
|------------|---------|------------|
| **Context7** | Library docs (Next.js, React, Supabase) | Web search for API syntax |
| **Supabase** | Live DB queries, auth, RLS policies | Guessing schema |
| **Playwright** | E2E testing, screenshots | Manual browser testing |
| **Memory** | Persist decisions across sessions | Repeating context |
| **Sequential Thinking** | Complex multi-step reasoning | Ad-hoc problem solving |
| **Fetch** | Web content retrieval | Assuming content |
| **Filesystem** | File operations | Shell commands |
| **Sentry** | Error monitoring, crash reports | Guessing prod issues |

### When to Use MCP First

| Situation | MCP to Use |
|-----------|------------|
| "What's the schema for X table?" | Supabase |
| "How does X work in React 19?" | Context7 |
| "Find all references to this function" | Serena |
| "Test the login flow" | Playwright |
| "What errors are happening in prod?" | Sentry |
| "Create a PR for this branch" | GitHub |
| "Remember this architectural decision" | Memory |

</mcp_servers>

<commands priority="3">

## Commands

Use `/command` in chat to trigger workflows:

| Command | Triggers |
|---------|----------|
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
