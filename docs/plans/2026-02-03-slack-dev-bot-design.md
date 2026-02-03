# Slack Dev Bot Design

**Date:** 2026-02-03
**Status:** Approved

## Overview

A local Slack bot that orchestrates AI-assisted development on vixio-world. The bot receives task requests via Slack, has AI fill out requirement forms, gets user approval, then executes work in phases with checkpoints.

## Decisions

| Question | Decision |
|----------|----------|
| Primary goal | Hybrid - AI proposes/implements, user reviews each phase |
| Trigger mechanism | Slack message → AI fills form → user approves |
| Runtime location | Local (laptop) |
| Checkpoints | Adaptive: Quick (1 phase) or Standard (3 phases) |
| Reports | Configurable: minimal for quick, detailed for standard |
| Error handling | Auto-fix lint/types, pause on ambiguity, escalate failures |
| Executor | Task-file handoff to Cursor agent |
| Screenshots | Playwright, desktop + mobile viewports |

## Architecture

```
Slack ←→ Local Bot (Bolt.js)
              ↓
         Orchestrator
              ↓
    .dev-tasks/ folder
              ↓
      Cursor Agent (watcher)
              ↓
         Your codebase
```

## Components

### 1. Slack Bot
- **Technology**: Bolt.js (official Slack SDK for Node.js)
- **Connection**: Socket Mode (no public URL needed)
- **Scopes**: `chat:write`, `files:write`, `commands`
- **Channel**: Single dedicated channel (`#vixio-dev`)

### 2. Orchestrator
- Receives messages from Slack bot
- Assesses task complexity (Quick vs Standard)
- Manages phase state and transitions
- Coordinates between Slack and Executor

### 3. Executor (Task-File Handoff)
- Bot writes task to `.dev-tasks/task-XXX.json`
- Cursor agent watches folder, picks up tasks
- Agent executes using existing skills
- Agent writes results to `.dev-tasks/task-XXX-result.json`
- Bot reads results, reports to Slack

### 4. Reporter
- Formats Slack messages with Block Kit
- Uploads screenshots as attachments
- Handles interactive buttons (Approve/Edit/Reject)

## Task Flow

### Trigger
```
User: "Build user profile page"
        ↓
Bot: 📋 Requirement Form (AI-filled)
     Feature: User Profile Page
     User Story: As a user, I want to view/edit my profile...
     Acceptance Criteria:
     - [ ] Display user avatar, name, email
     - [ ] Allow editing name
     - [ ] Show account creation date
     Complexity: Standard (3 phases)
     
     [Approve] [Edit] [Reject]
```

### Complexity Assessment

| Type | Criteria | Phases |
|------|----------|--------|
| Quick | ≤3 files, no new components | 1 (do → report → PR) |
| Standard | Everything else | 3 (plan → implement → test/PR) |

Large tasks should be broken into multiple Standard tasks.

### Phase Structure (Standard)

**Phase 1: Planning**
- Create branch
- Analyze codebase
- Write implementation plan
- Report to Slack, await approval

**Phase 2: Implementation**
- Execute plan tasks
- Run lint/typecheck, auto-fix if needed
- Commit changes
- Report progress, await approval

**Phase 3: Testing & PR**
- Run existing tests
- Add new tests if needed
- Take screenshots (Playwright)
- Create PR
- Final report, await merge approval

## Error Handling

| Error Type | Action |
|------------|--------|
| Lint errors | Auto-fix, retry |
| Type errors | Try once to fix, escalate if fails |
| Test failures | Escalate immediately |
| Build fails | Escalate immediately |
| Git conflicts | Escalate immediately |
| Ambiguous requirements | Pause and ask for clarification |
| Agent timeout (5 min) | Escalate with last state |

### Recovery Options
- **Retry Phase**: Reset to last commit, try again
- **Abort Task**: Delete branch (clean rollback)

## Reports

### Quick Task
```
✅ Done: Fix button color

Changed: components/ui/Button.tsx
PR: #12 [View]
Time: 2 min
```

### Standard Task (Phase Complete)
```
📋 Phase 1 Complete: Planning

Branch: feat/user-profile-page
Plan:
1. Create ProfilePage component
2. Add /profile route
3. Fetch user data from Supabase
4. Add E2E test

Estimated: 3 files, ~150 lines
[Approve Phase 2] [Edit Plan] [Abort]
```

### Final Report
```
✅ Feature Complete: User Profile Page

Summary:
- Created ProfilePage component
- Added /profile route
- Connected to Supabase auth
- Added 2 E2E tests (passing)

📸 Screenshots:
[Profile View] [Edit Mode] [Mobile]

Test Results: 20/20 passing
PR: #15 [View PR]

[Approve Merge] [Request Changes]
```

## State Management

Local JSON file tracking active tasks:

```json
{
  "taskId": "task-001",
  "status": "awaiting_approval",
  "currentPhase": 2,
  "branch": "feat/user-profile-page",
  "commits": ["abc123", "def456"],
  "slackThread": "1234567890.123456"
}
```

## Security

- Bot runs locally, no cloud exposure
- Slack OAuth tokens stored in `.env.local`
- Git credentials reuse existing `gh` auth
- No secrets exposed in Slack messages

## File Structure

```
vixio-world/
├── dev-bot/
│   ├── src/
│   │   ├── index.ts          # Entry point
│   │   ├── slack/
│   │   │   ├── bot.ts        # Bolt.js setup
│   │   │   ├── messages.ts   # Message formatting
│   │   │   └── handlers.ts   # Event handlers
│   │   ├── orchestrator/
│   │   │   ├── index.ts      # Main orchestrator
│   │   │   ├── phases.ts     # Phase management
│   │   │   └── complexity.ts # Task assessment
│   │   ├── executor/
│   │   │   ├── task-writer.ts
│   │   │   └── result-reader.ts
│   │   └── state/
│   │       └── store.ts      # JSON state management
│   ├── package.json
│   └── tsconfig.json
├── .dev-tasks/               # Task handoff folder
│   ├── task-001.json
│   └── task-001-result.json
└── .env.local                # Slack tokens added here
```

## Dependencies

- `@slack/bolt` - Slack SDK
- `chokidar` - File watcher (for result files)
- `typescript` - Type safety

## Next Steps

1. Create Slack App and get tokens
2. Implement bot skeleton
3. Build orchestrator
4. Create task-file handoff system
5. Implement reporting
6. Add Cursor agent watcher skill
