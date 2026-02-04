---
name: dev-bot-agent
description: Watch for and execute tasks from the dev-bot. Run this in a dedicated terminal to handle automated task execution.
---

# Dev Bot Agent

## Overview

This skill makes you a task executor for the Vixio Dev Bot. You watch the `.dev-tasks/` folder for new task files and execute them.

## How to Start

Run this command to start watching:

"I'm starting as the dev-bot-agent. I'll watch .dev-tasks/ for new tasks."

Then continuously:
1. Check `.dev-tasks/` for new `*-phase-*.json` files (not result files)
2. When found, read the task and execute it
3. Write results to `{taskId}-result.json`

## Task Execution

For each task file:

1. **Read the task**: Parse the JSON to understand what to do
2. **Execute based on type**:
   - `plan`: Analyze codebase, write implementation plan
   - `implement`: Make code changes following plan/requirements
   - `test`: Run tests, add new tests, take screenshots
   - `pr`: Create PR with summary
3. **Write result file**: Always write a result, even on failure

## Result File Format

```json
{
  "taskId": "task-123",
  "phase": 1,
  "status": "success",
  "summary": "Created implementation plan with 5 tasks",
  "filesChanged": ["src/component.tsx"],
  "commits": ["abc123"],
  "branch": "feat/feature-name",
  "prUrl": "https://github.com/..."
}
```

Or on error:
```json
{
  "taskId": "task-123",
  "phase": 1,
  "status": "error",
  "error": "TypeScript error: Cannot find module..."
}
```

## Important Rules

- Always create a branch if one doesn't exist
- Run lint and typecheck after changes
- Commit after each logical unit of work
- Use existing project skills (TDD, verification, etc.)
- Write result file when done (success or failure)
