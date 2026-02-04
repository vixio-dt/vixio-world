import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { Task, TaskStore } from './types.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const STORE_PATH = resolve(__dirname, '../../../.dev-tasks/state.json')

function ensureDir() {
  const dir = dirname(STORE_PATH)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
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
