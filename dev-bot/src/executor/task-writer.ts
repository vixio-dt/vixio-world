import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { Task } from '../state/types.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

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
  const filepath = resolve(__dirname, '../../../.dev-tasks', filename)

  writeFileSync(filepath, JSON.stringify(execTask, null, 2))
  console.log(`📝 Wrote task file: ${filename}`)

  return filepath
}

function getPhaseType(task: Task, phase: number): ExecutionTask['type'] {
  if (task.complexity === 'quick') return 'implement'

  switch (phase) {
    case 1:
      return 'plan'
    case 2:
      return 'implement'
    case 3:
      return 'test'
    default:
      return 'implement'
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
