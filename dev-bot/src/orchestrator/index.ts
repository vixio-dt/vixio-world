// dev-bot/src/orchestrator/index.ts
import { app } from '../slack/bot.js'
import { createTask, updateTask, getTask } from '../state/store.js'
import { assessComplexity } from './complexity.js'
import { executeWithCursorAgent } from '../executor/cursor-agent.js'
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
  const { complexity } = assessComplexity(description)
  
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
  const updatedTask = updateTask(taskId, {
    status: task.complexity === 'quick' ? 'implementing' : 'planning',
    branch,
    currentPhase: 1,
  })
  
  await app.client.chat.postMessage({
    channel: task.slackChannel,
    thread_ts: task.slackThread,
    text: `🚀 Starting ${task.complexity === 'quick' ? 'implementation' : 'Phase 1: Planning'}...\nBranch: \`${branch}\`\n\n_Cursor Agent is working..._`,
  })
  
  // Execute with Cursor Agent (async - don't await, let it run in background)
  executePhase(updatedTask, 1)
}

async function executePhase(task: Task, phase: number) {
  try {
    const result = await executeWithCursorAgent(task, phase)
    
    if (result.success) {
      updateTask(task.id, { status: 'awaiting_phase_approval' })
      
      // Truncate output for Slack (max ~3000 chars)
      const summary = result.output.length > 2500 
        ? result.output.slice(-2500) + '\n\n_(output truncated)_'
        : result.output
      
      const phaseNames = ['Planning', 'Implementation', 'Testing & PR']
      const message = formatPhaseComplete(task, phaseNames[phase - 1], summary)
      await app.client.chat.postMessage({
        channel: task.slackChannel,
        thread_ts: task.slackThread,
        ...message,
      })
    } else {
      updateTask(task.id, { status: 'failed', error: result.error })
      const message = formatError(task, result.error || 'Unknown error')
      await app.client.chat.postMessage({
        channel: task.slackChannel,
        thread_ts: task.slackThread,
        ...message,
      })
    }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    updateTask(task.id, { status: 'failed', error })
    const message = formatError(task, error)
    await app.client.chat.postMessage({
      channel: task.slackChannel,
      thread_ts: task.slackThread,
      ...message,
    })
  }
}

export async function handlePhaseApproval(taskId: string) {
  const task = getTask(taskId)
  if (!task) return
  
  const nextPhase = task.currentPhase + 1
  
  if (nextPhase > task.totalPhases) {
    // All phases complete
    updateTask(taskId, { status: 'complete' })
    await app.client.chat.postMessage({
      channel: task.slackChannel,
      thread_ts: task.slackThread,
      text: `✅ Task complete! All ${task.totalPhases} phases finished.`,
    })
    return
  }
  
  // Move to next phase
  const phaseNames = ['Planning', 'Implementation', 'Testing & PR']
  const updatedTask = updateTask(taskId, {
    currentPhase: nextPhase,
    status: nextPhase === 2 ? 'implementing' : nextPhase === 3 ? 'testing' : 'planning',
  })
  
  await app.client.chat.postMessage({
    channel: task.slackChannel,
    thread_ts: task.slackThread,
    text: `🚀 Starting Phase ${nextPhase}: ${phaseNames[nextPhase - 1]}...\n\n_Cursor Agent is working..._`,
  })
  
  // Execute next phase
  executePhase(updatedTask, nextPhase)
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
