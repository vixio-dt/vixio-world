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
