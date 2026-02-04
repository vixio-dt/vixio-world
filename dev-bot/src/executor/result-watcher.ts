import { watch } from 'chokidar'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { EventEmitter } from 'events'

const __dirname = dirname(fileURLToPath(import.meta.url))

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
    this.tasksDir = resolve(__dirname, '../../../.dev-tasks')
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
