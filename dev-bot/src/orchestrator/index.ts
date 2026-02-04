// dev-bot/src/orchestrator/index.ts
import { app } from '../slack/bot.js'
import { createTask, updateTask, getTask } from '../state/store.js'
import { assessComplexity } from './complexity.js'
import { writeTaskFile } from '../executor/task-writer.js'
import { resultWatcher, TaskResult } from '../executor/result-watcher.js'
import { formatRequirementForm, formatPhaseComplete, formatQuickComplete, formatError } from '../slack/messages.js'
import { generateRequirementsWithAI } from '../ai/requirements.js'
import type { Task } from '../state/types.js'

export async function handleNewTask(description: string, slackChannel: string, slackThread: string) {
  // Send immediate acknowledgment
  await app.client.chat.postMessage({
    channel: slackChannel,
    thread_ts: slackThread,
    text: '🤔 Analyzing task...',
  })

  // Assess complexity
  const { complexity, reasoning, estimatedFiles } = assessComplexity(description)
  
  // Create task
  const task = createTask({
    description,
    complexity,
    slackChannel,
    slackThread,
  })
  
  // Generate AI requirements (async)
  const requirements = await generateRequirementsWithAI(description)
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
