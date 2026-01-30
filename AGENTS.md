---
description: Project rules and skills for vixio-world development
alwaysApply: true
---

# AGENTS.md

## Mandatory Rules

1. **95% Confidence Rule**: Do NOT make changes until you have 95% confidence you understand what to build. Ask clarifying questions until you reach that confidence.

2. **Recommend with Reasoning**: When presenting options, ALWAYS include your recommendation and explain WHY.

3. **Brainstorm Before Build**: Use the `brainstorming` skill before any creative work. Never skip.

4. **Verify Before Claiming Done**: Use the `verification-before-completion` skill before claiming work is complete.

5. **Update Docs After Actions**: After completing tasks, update `docs/current-sprint.md` and relevant documentation.

---

## Skills Reference

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

---

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

---

## Subagents

Specialized agents for parallel execution:

| Subagent | Purpose |
|----------|---------|
| `implementer` | Execute single task from plan |
| `spec-reviewer` | Verify work matches requirements |
| `code-reviewer` | Review code quality and standards |
