# Slack Dev Bot Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a local Slack bot that orchestrates AI-assisted development with phased execution and approval checkpoints.

**Architecture:** A Bolt.js Slack bot runs locally, receiving messages via Socket Mode. It writes task files to `.dev-tasks/` which a Cursor agent picks up and executes. Results are written back, and the bot reports progress to Slack.

**Tech Stack:** Node.js, TypeScript, @slack/bolt, chokidar (file watcher)

---

## Phase 1: Project Setup & Slack Connection

### Task 1.1: Create dev-bot project structure

**Files:**
- Create: `dev-bot/package.json`
- Create: `dev-bot/tsconfig.json`
- Create: `dev-bot/src/index.ts`

**Step 1: Create package.json**

```json
{
  "name": "vixio-dev-bot",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@slack/bolt": "^4.1.0",
    "chokidar": "^3.6.0",
    "dotenv": "^16.4.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.0"
  }
}
```

**Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

**Step 3: Create placeholder index.ts**

```typescript
console.log('Vixio Dev Bot starting...')
```

**Step 4: Install dependencies**

Run: `cd dev-bot && npm install`
Expected: Dependencies installed successfully

**Step 5: Test setup**

Run: `cd dev-bot && npm run dev`
Expected: Console shows "Vixio Dev Bot starting..."

**Step 6: Commit**

```bash
git add dev-bot/
git commit -m "feat(dev-bot): initialize project structure"
```

---

### Task 1.2: Create Slack App and get tokens

**This is a manual step - guide user through it.**

**Step 1: Create Slack App**
1. Go to https://api.slack.com/apps
2. Click "Create New App" → "From scratch"
3. Name: "Vixio Dev Bot"
4. Workspace: Select your workspace
5. Click "Create App"

**Step 2: Enable Socket Mode**
1. Go to "Socket Mode" in left sidebar
2. Toggle "Enable Socket Mode" ON
3. Create app-level token with `connections:write` scope
4. Copy the token (starts with `xapp-`)

**Step 3: Add Bot Scopes**
1. Go to "OAuth & Permissions"
2. Under "Bot Token Scopes", add:
   - `chat:write`
   - `files:write`
   - `app_mentions:read`
   - `channels:history`
   - `im:history`
3. Click "Install to Workspace"
4. Copy Bot User OAuth Token (starts with `xoxb-`)

**Step 4: Enable Event Subscriptions**
1. Go to "Event Subscriptions"
2. Toggle ON
3. Under "Subscribe to bot events", add:
   - `app_mention`
   - `message.im`

**Step 5: Add tokens to .env.local**

Add to `vixio-world/.env.local`:
```
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-token
SLACK_CHANNEL_ID=C0123456789
```

Get channel ID by right-clicking channel → "View channel details" → copy ID at bottom.

**Step 6: Commit .env.local.example**

Create `.env.local.example` (without actual tokens):
```
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-token
SLACK_CHANNEL_ID=your-channel-id
```

```bash
git add .env.local.example
git commit -m "docs: add Slack token placeholders"
```

---

### Task 1.3: Implement basic Slack bot connection

**Files:**
- Modify: `dev-bot/src/index.ts`
- Create: `dev-bot/src/slack/bot.ts`

**Step 1: Create bot.ts**

```typescript
// dev-bot/src/slack/bot.ts
import { App } from '@slack/bolt'
import 'dotenv/config'

// Load from root .env.local
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '../.env.local') })

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
})

export async function startBot() {
  await app.start()
  console.log('⚡️ Vixio Dev Bot is running!')
}
```

**Step 2: Update index.ts**

```typescript
// dev-bot/src/index.ts
import { startBot, app } from './slack/bot.js'

// Simple echo handler for testing
app.message(async ({ message, say }) => {
  if (message.subtype) return // Ignore non-user messages
  if ('text' in message && message.text) {
    await say(`Echo: ${message.text}`)
  }
})

startBot().catch(console.error)
```

**Step 3: Test bot connection**

Run: `cd dev-bot && npm run dev`
Expected: Console shows "⚡️ Vixio Dev Bot is running!"

**Step 4: Test in Slack**

Send message to bot in DM or mention in channel.
Expected: Bot replies with "Echo: [your message]"

**Step 5: Commit**

```bash
git add dev-bot/src/
git commit -m "feat(dev-bot): add Slack bot connection with Socket Mode"
```

---

## Phase 2: Core Orchestrator

### Task 2.1: Create task state management

**Files:**
- Create: `dev-bot/src/state/store.ts`
- Create: `dev-bot/src/state/types.ts`

**Step 1: Create types.ts**

```typescript
// dev-bot/src/state/types.ts
export type TaskStatus = 
  | 'pending_approval'
  | 'planning'
  | 'implementing'
  | 'testing'
  | 'awaiting_phase_approval'
  | 'creating_pr'
  | 'complete'
  | 'failed'
  | 'aborted'

export type TaskComplexity = 'quick' | 'standard'

export interface Task {
  id: string
  description: string
  complexity: TaskComplexity
  status: TaskStatus
  currentPhase: number
  totalPhases: number
  branch?: string
  commits: string[]
  slackThread: string
  slackChannel: string
  createdAt: string
  updatedAt: string
  requirements?: {
    feature: string
    userStory: string
    acceptanceCriteria: string[]
  }
  error?: string
}

export interface TaskStore {
  tasks: Record<string, Task>
  activeTaskId?: string
}
```

**Step 2: Create store.ts**

```typescript
// dev-bot/src/state/store.ts
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import type { Task, TaskStore } from './types.js'

const STORE_PATH = resolve(process.cwd(), '../.dev-tasks/state.json')

function ensureDir() {
  const dir = resolve(process.cwd(), '../.dev-tasks')
  if (!existsSync(dir)) {
    require('fs').mkdirSync(dir, { recursive: true })
  }
}

export function loadStore(): TaskStore {
  ensureDir()
  if (!existsSync(STORE_PATH)) {
    return { tasks: {} }
  }
  return JSON.parse(readFileSync(STORE_PATH, 'utf-8'))
}

export function saveStore(store: TaskStore): void {
  ensureDir()
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2))
}

export function createTask(partial: Partial<Task> & { description: string; slackThread: string; slackChannel: string }): Task {
  const id = `task-${Date.now()}`
  const task: Task = {
    id,
    description: partial.description,
    complexity: partial.complexity || 'standard',
    status: 'pending_approval',
    currentPhase: 0,
    totalPhases: partial.complexity === 'quick' ? 1 : 3,
    commits: [],
    slackThread: partial.slackThread,
    slackChannel: partial.slackChannel,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...partial,
  }
  
  const store = loadStore()
  store.tasks[id] = task
  store.activeTaskId = id
  saveStore(store)
  
  return task
}

export function updateTask(id: string, updates: Partial<Task>): Task {
  const store = loadStore()
  const task = store.tasks[id]
  if (!task) throw new Error(`Task ${id} not found`)
  
  Object.assign(task, updates, { updatedAt: new Date().toISOString() })
  saveStore(store)
  return task
}

export function getTask(id: string): Task | undefined {
  return loadStore().tasks[id]
}

export function getActiveTask(): Task | undefined {
  const store = loadStore()
  return store.activeTaskId ? store.tasks[store.activeTaskId] : undefined
}
```

**Step 3: Create .dev-tasks directory**

Run: `mkdir -p .dev-tasks && echo "*.json" > .dev-tasks/.gitignore`

**Step 4: Commit**

```bash
git add dev-bot/src/state/ .dev-tasks/.gitignore
git commit -m "feat(dev-bot): add task state management"
```

---

### Task 2.2: Create complexity assessor

**Files:**
- Create: `dev-bot/src/orchestrator/complexity.ts`

**Step 1: Create complexity.ts**

```typescript
// dev-bot/src/orchestrator/complexity.ts
import type { TaskComplexity } from '../state/types.js'

interface ComplexityResult {
  complexity: TaskComplexity
  reasoning: string
  estimatedFiles: number
}

// Keywords that suggest more complex work
const COMPLEX_KEYWORDS = [
  'page', 'feature', 'system', 'component', 'flow',
  'authentication', 'integration', 'api', 'database',
  'crud', 'form', 'wizard', 'dashboard'
]

const QUICK_KEYWORDS = [
  'fix', 'typo', 'color', 'text', 'label', 'rename',
  'update', 'change', 'adjust', 'tweak', 'remove'
]

export function assessComplexity(description: string): ComplexityResult {
  const lower = description.toLowerCase()
  
  // Count keyword matches
  const complexMatches = COMPLEX_KEYWORDS.filter(k => lower.includes(k)).length
  const quickMatches = QUICK_KEYWORDS.filter(k => lower.includes(k)).length
  
  // Quick if more quick keywords and no complex keywords
  if (quickMatches > 0 && complexMatches === 0) {
    return {
      complexity: 'quick',
      reasoning: 'Simple modification task',
      estimatedFiles: 1 + quickMatches,
    }
  }
  
  // Default to standard for anything non-trivial
  return {
    complexity: 'standard',
    reasoning: complexMatches > 0 
      ? `Contains feature keywords: ${COMPLEX_KEYWORDS.filter(k => lower.includes(k)).join(', ')}`
      : 'Default to standard for new work',
    estimatedFiles: 3 + complexMatches * 2,
  }
}
```

**Step 2: Commit**

```bash
git add dev-bot/src/orchestrator/
git commit -m "feat(dev-bot): add task complexity assessor"
```

---

### Task 2.3: Create Slack message formatters

**Files:**
- Create: `dev-bot/src/slack/messages.ts`

**Step 1: Create messages.ts**

```typescript
// dev-bot/src/slack/messages.ts
import type { Task } from '../state/types.js'

export function formatRequirementForm(task: Task, aiSuggestion: {
  feature: string
  userStory: string
  acceptanceCriteria: string[]
}) {
  return {
    text: `📋 New Task: ${task.description}`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '📋 Requirement Form' }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Feature:* ${aiSuggestion.feature}\n\n*User Story:* ${aiSuggestion.userStory}`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Acceptance Criteria:*\n' + aiSuggestion.acceptanceCriteria.map(c => `• ${c}`).join('\n')
        }
      },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: `*Complexity:* ${task.complexity} (${task.totalPhases} phase${task.totalPhases > 1 ? 's' : ''})` }
        ]
      },
      {
        type: 'actions',
        block_id: `task_approval_${task.id}`,
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: '✅ Approve' },
            style: 'primary',
            action_id: 'approve_task',
            value: task.id
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '✏️ Edit' },
            action_id: 'edit_task',
            value: task.id
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '❌ Reject' },
            style: 'danger',
            action_id: 'reject_task',
            value: task.id
          }
        ]
      }
    ]
  }
}

export function formatPhaseComplete(task: Task, phaseName: string, summary: string) {
  return {
    text: `Phase ${task.currentPhase} complete`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: `📋 Phase ${task.currentPhase} Complete: ${phaseName}` }
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: summary }
      },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: `Branch: \`${task.branch}\`` }
        ]
      },
      {
        type: 'actions',
        block_id: `phase_approval_${task.id}_${task.currentPhase}`,
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: `✅ Approve Phase ${task.currentPhase + 1}` },
            style: 'primary',
            action_id: 'approve_phase',
            value: task.id
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '🔄 Retry Phase' },
            action_id: 'retry_phase',
            value: task.id
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '🛑 Abort' },
            style: 'danger',
            action_id: 'abort_task',
            value: task.id
          }
        ]
      }
    ]
  }
}

export function formatQuickComplete(task: Task, summary: string, prUrl: string) {
  return {
    text: `✅ Done: ${task.description}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `✅ *Done:* ${task.description}\n\n${summary}\n\nPR: <${prUrl}|View>`
        }
      },
      {
        type: 'actions',
        block_id: `merge_approval_${task.id}`,
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: '✅ Approve Merge' },
            style: 'primary',
            action_id: 'approve_merge',
            value: task.id
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '💬 Request Changes' },
            action_id: 'request_changes',
            value: task.id
          }
        ]
      }
    ]
  }
}

export function formatError(task: Task, error: string) {
  return {
    text: `⚠️ Task blocked`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '⚠️ Task Blocked' }
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*Error:*\n\`\`\`${error}\`\`\`` }
      },
      {
        type: 'actions',
        block_id: `error_${task.id}`,
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: '🔄 Retry' },
            action_id: 'retry_phase',
            value: task.id
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '🛑 Abort' },
            style: 'danger',
            action_id: 'abort_task',
            value: task.id
          }
        ]
      }
    ]
  }
}
```

**Step 2: Commit**

```bash
git add dev-bot/src/slack/messages.ts
git commit -m "feat(dev-bot): add Slack message formatters"
```

---

## Phase 3: Task Execution Bridge

### Task 3.1: Create task file writer

**Files:**
- Create: `dev-bot/src/executor/task-writer.ts`

**Step 1: Create task-writer.ts**

```typescript
// dev-bot/src/executor/task-writer.ts
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import type { Task } from '../state/types.js'

export interface ExecutionTask {
  taskId: string
  type: 'plan' | 'implement' | 'test' | 'pr'
  description: string
  requirements?: {
    feature: string
    userStory: string
    acceptanceCriteria: string[]
  }
  branch?: string
  context?: string
}

export function writeTaskFile(task: Task, phase: number): string {
  const execTask: ExecutionTask = {
    taskId: task.id,
    type: getPhaseType(task, phase),
    description: task.description,
    requirements: task.requirements,
    branch: task.branch,
    context: getPhaseContext(task, phase),
  }
  
  const filename = `${task.id}-phase-${phase}.json`
  const filepath = resolve(process.cwd(), '../.dev-tasks', filename)
  
  writeFileSync(filepath, JSON.stringify(execTask, null, 2))
  console.log(`📝 Wrote task file: ${filename}`)
  
  return filepath
}

function getPhaseType(task: Task, phase: number): ExecutionTask['type'] {
  if (task.complexity === 'quick') return 'implement'
  
  switch (phase) {
    case 1: return 'plan'
    case 2: return 'implement'
    case 3: return 'test'
    default: return 'implement'
  }
}

function getPhaseContext(task: Task, phase: number): string {
  if (task.complexity === 'quick') {
    return `Quick task: ${task.description}. Make the change, run lint/typecheck, commit, create PR.`
  }
  
  switch (phase) {
    case 1:
      return `Planning phase. Analyze the codebase, identify files to change, write a detailed plan. Do NOT make changes yet.`
    case 2:
      return `Implementation phase. Follow the plan from phase 1. Make changes, run lint/typecheck, commit frequently.`
    case 3:
      return `Testing phase. Run existing tests, add new tests if needed, take screenshots, create PR.`
    default:
      return task.description
  }
}
```

**Step 2: Commit**

```bash
git add dev-bot/src/executor/
git commit -m "feat(dev-bot): add task file writer for Cursor handoff"
```

---

### Task 3.2: Create result file watcher

**Files:**
- Create: `dev-bot/src/executor/result-watcher.ts`

**Step 1: Create result-watcher.ts**

```typescript
// dev-bot/src/executor/result-watcher.ts
import { watch } from 'chokidar'
import { readFileSync, existsSync } from 'fs'
import { resolve, basename } from 'path'
import { EventEmitter } from 'events'

export interface TaskResult {
  taskId: string
  phase: number
  status: 'success' | 'error' | 'needs_clarification'
  summary: string
  filesChanged?: string[]
  commits?: string[]
  branch?: string
  prUrl?: string
  error?: string
  clarificationNeeded?: {
    question: string
    options: string[]
  }
}

export class ResultWatcher extends EventEmitter {
  private watcher: ReturnType<typeof watch> | null = null
  private tasksDir: string
  
  constructor() {
    super()
    this.tasksDir = resolve(process.cwd(), '../.dev-tasks')
  }
  
  start() {
    const pattern = resolve(this.tasksDir, '*-result.json')
    
    this.watcher = watch(pattern, {
      persistent: true,
      ignoreInitial: true,
    })
    
    this.watcher.on('add', (path) => this.handleResult(path))
    this.watcher.on('change', (path) => this.handleResult(path))
    
    console.log('👀 Watching for task results...')
  }
  
  stop() {
    this.watcher?.close()
    this.watcher = null
  }
  
  private handleResult(filepath: string) {
    try {
      const content = readFileSync(filepath, 'utf-8')
      const result: TaskResult = JSON.parse(content)
      
      console.log(`📥 Received result for task ${result.taskId}, phase ${result.phase}`)
      this.emit('result', result)
    } catch (err) {
      console.error(`Failed to parse result file: ${filepath}`, err)
    }
  }
}

export const resultWatcher = new ResultWatcher()
```

**Step 2: Commit**

```bash
git add dev-bot/src/executor/result-watcher.ts
git commit -m "feat(dev-bot): add result file watcher"
```

---

### Task 3.3: Wire up the orchestrator

**Files:**
- Create: `dev-bot/src/orchestrator/index.ts`
- Modify: `dev-bot/src/index.ts`

**Step 1: Create orchestrator/index.ts**

```typescript
// dev-bot/src/orchestrator/index.ts
import { app } from '../slack/bot.js'
import { createTask, updateTask, getTask } from '../state/store.js'
import { assessComplexity } from './complexity.js'
import { writeTaskFile } from '../executor/task-writer.js'
import { resultWatcher, TaskResult } from '../executor/result-watcher.js'
import { formatRequirementForm, formatPhaseComplete, formatQuickComplete, formatError } from '../slack/messages.js'
import type { Task } from '../state/types.js'

// Generate AI suggestion for requirements (placeholder - will integrate with AI later)
function generateRequirements(description: string) {
  return {
    feature: description,
    userStory: `As a user, I want to ${description.toLowerCase()}, so that I can improve my workflow.`,
    acceptanceCriteria: [
      'Feature works as described',
      'No regressions in existing functionality',
      'Code passes lint and type checks',
      'Tests added or updated as needed',
    ],
  }
}

export async function handleNewTask(description: string, slackChannel: string, slackThread: string) {
  // Assess complexity
  const { complexity, reasoning, estimatedFiles } = assessComplexity(description)
  
  // Create task
  const task = createTask({
    description,
    complexity,
    slackChannel,
    slackThread,
  })
  
  // Generate AI requirements suggestion
  const requirements = generateRequirements(description)
  updateTask(task.id, { requirements })
  
  // Send requirement form to Slack
  const message = formatRequirementForm({ ...task, requirements }, requirements)
  await app.client.chat.postMessage({
    channel: slackChannel,
    thread_ts: slackThread,
    ...message,
  })
  
  console.log(`📋 Created task ${task.id} (${complexity}): ${description}`)
}

export async function handleTaskApproval(taskId: string) {
  const task = getTask(taskId)
  if (!task) return
  
  // Create branch name
  const branch = `feat/${task.description.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`
  
  // Update task and start first phase
  updateTask(taskId, {
    status: task.complexity === 'quick' ? 'implementing' : 'planning',
    branch,
    currentPhase: 1,
  })
  
  // Write task file for Cursor agent
  writeTaskFile({ ...task, branch }, 1)
  
  await app.client.chat.postMessage({
    channel: task.slackChannel,
    thread_ts: task.slackThread,
    text: `🚀 Starting ${task.complexity === 'quick' ? 'implementation' : 'Phase 1: Planning'}...\nBranch: \`${branch}\``,
  })
}

export async function handlePhaseApproval(taskId: string) {
  const task = getTask(taskId)
  if (!task) return
  
  const nextPhase = task.currentPhase + 1
  
  if (nextPhase > task.totalPhases) {
    // All phases complete
    updateTask(taskId, { status: 'complete' })
    return
  }
  
  // Move to next phase
  const phaseNames = ['Planning', 'Implementation', 'Testing & PR']
  updateTask(taskId, {
    currentPhase: nextPhase,
    status: nextPhase === 2 ? 'implementing' : nextPhase === 3 ? 'testing' : 'planning',
  })
  
  // Write task file for next phase
  writeTaskFile(task, nextPhase)
  
  await app.client.chat.postMessage({
    channel: task.slackChannel,
    thread_ts: task.slackThread,
    text: `🚀 Starting Phase ${nextPhase}: ${phaseNames[nextPhase - 1]}...`,
  })
}

export async function handleTaskAbort(taskId: string) {
  const task = getTask(taskId)
  if (!task) return
  
  updateTask(taskId, { status: 'aborted' })
  
  await app.client.chat.postMessage({
    channel: task.slackChannel,
    thread_ts: task.slackThread,
    text: `🛑 Task aborted. Branch \`${task.branch}\` can be deleted.`,
  })
}

// Handle results from Cursor agent
resultWatcher.on('result', async (result: TaskResult) => {
  const task = getTask(result.taskId)
  if (!task) return
  
  if (result.status === 'error') {
    updateTask(result.taskId, { status: 'failed', error: result.error })
    const message = formatError(task, result.error || 'Unknown error')
    await app.client.chat.postMessage({
      channel: task.slackChannel,
      thread_ts: task.slackThread,
      ...message,
    })
    return
  }
  
  if (result.status === 'success') {
    // Update task with results
    updateTask(result.taskId, {
      commits: [...task.commits, ...(result.commits || [])],
      status: 'awaiting_phase_approval',
    })
    
    if (task.complexity === 'quick' && result.prUrl) {
      const message = formatQuickComplete(task, result.summary, result.prUrl)
      await app.client.chat.postMessage({
        channel: task.slackChannel,
        thread_ts: task.slackThread,
        ...message,
      })
    } else {
      const phaseNames = ['Planning', 'Implementation', 'Testing & PR']
      const message = formatPhaseComplete(task, phaseNames[task.currentPhase - 1], result.summary)
      await app.client.chat.postMessage({
        channel: task.slackChannel,
        thread_ts: task.slackThread,
        ...message,
      })
    }
  }
})
```

**Step 2: Update index.ts with handlers**

```typescript
// dev-bot/src/index.ts
import { startBot, app } from './slack/bot.js'
import { resultWatcher } from './executor/result-watcher.js'
import { handleNewTask, handleTaskApproval, handlePhaseApproval, handleTaskAbort } from './orchestrator/index.js'

// Handle new messages (task requests)
app.message(async ({ message, say }) => {
  if (message.subtype) return
  if (!('text' in message) || !message.text) return
  if (!('ts' in message)) return
  
  // Ignore bot messages
  if ('bot_id' in message) return
  
  await handleNewTask(message.text, message.channel, message.ts)
})

// Handle button clicks
app.action('approve_task', async ({ ack, body }) => {
  await ack()
  const value = (body as any).actions[0].value
  await handleTaskApproval(value)
})

app.action('approve_phase', async ({ ack, body }) => {
  await ack()
  const value = (body as any).actions[0].value
  await handlePhaseApproval(value)
})

app.action('abort_task', async ({ ack, body }) => {
  await ack()
  const value = (body as any).actions[0].value
  await handleTaskAbort(value)
})

app.action('approve_merge', async ({ ack, body, say }) => {
  await ack()
  // TODO: Implement merge via gh CLI
  await say('Merge approval noted. Implement gh pr merge.')
})

app.action('edit_task', async ({ ack }) => {
  await ack()
  // TODO: Implement edit flow
})

app.action('reject_task', async ({ ack, body }) => {
  await ack()
  const value = (body as any).actions[0].value
  await handleTaskAbort(value)
})

app.action('retry_phase', async ({ ack, body }) => {
  await ack()
  const value = (body as any).actions[0].value
  await handleTaskApproval(value) // Re-run current phase
})

app.action('request_changes', async ({ ack }) => {
  await ack()
  // TODO: Implement change request flow
})

// Start everything
async function main() {
  resultWatcher.start()
  await startBot()
}

main().catch(console.error)
```

**Step 3: Test the full flow**

Run: `cd dev-bot && npm run dev`
Send a message in Slack: "Add loading spinner to submit button"
Expected: Bot replies with requirement form with Approve/Edit/Reject buttons

**Step 4: Commit**

```bash
git add dev-bot/src/
git commit -m "feat(dev-bot): wire up orchestrator with Slack handlers"
```

---

## Phase 4: Cursor Agent Integration

### Task 4.1: Create Cursor agent watcher skill

**Files:**
- Create: `.claude/skills/dev-bot-agent/SKILL.md`

**Step 1: Create the skill**

```markdown
---
name: dev-bot-agent
description: Watch for and execute tasks from the dev-bot. Run this in a dedicated terminal to handle automated task execution.
---

# Dev Bot Agent

## Overview

This skill makes you a task executor for the Vixio Dev Bot. You watch the `.dev-tasks/` folder for new task files and execute them.

## How to Start

Run this command to start watching:

"I'm starting as the dev-bot agent. I'll watch .dev-tasks/ for new tasks."

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
```

**Step 2: Commit**

```bash
git add .claude/skills/dev-bot-agent/
git commit -m "feat: add dev-bot-agent skill for task execution"
```

---

## Completion Checklist

- [ ] dev-bot project structure created
- [ ] Slack app configured with tokens
- [ ] Bot connects and responds
- [ ] Task state management working
- [ ] Complexity assessment working
- [ ] Slack message formatters complete
- [ ] Task file writer working
- [ ] Result watcher working
- [ ] Orchestrator wired up
- [ ] Cursor agent skill created
- [ ] End-to-end test passed

---

**Plan complete and saved to `docs/plans/2026-02-03-slack-dev-bot-impl.md`.**

**Two execution options:**

1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

2. **Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
