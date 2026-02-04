// dev-bot/src/executor/cursor-agent.ts
import { spawn } from 'child_process'
import type { Task } from '../state/types.js'

export interface AgentResult {
  success: boolean
  output: string
  error?: string
}

/**
 * Execute a task using the Cursor CLI agent
 */
// Path to Cursor agent CLI (installed via cursor.com/install)
const AGENT_PATH = process.env.CURSOR_AGENT_PATH || 
  `${process.env.LOCALAPPDATA || 'C:\\Users\\DT Work\\AppData\\Local'}\\cursor-agent\\agent.ps1`

// Ripgrep path (required by Cursor agent)
const RG_DIR = `${process.env.LOCALAPPDATA || 'C:\\Users\\DT Work\\AppData\\Local'}\\Microsoft\\WinGet\\Packages\\BurntSushi.ripgrep.MSVC_Microsoft.Winget.Source_8wekyb3d8bbwe\\ripgrep-15.1.0-x86_64-pc-windows-msvc`

// Build PATH with ripgrep included
function getEnvWithPath() {
  const currentPath = process.env.Path || process.env.PATH || ''
  return {
    ...process.env,
    Path: `${RG_DIR};${currentPath}`,
  }
}

export async function executeWithCursorAgent(
  task: Task,
  phase: number
): Promise<AgentResult> {
  const prompt = buildPrompt(task, phase)
  
  console.log(`🚀 Spawning Cursor agent for task ${task.id}, phase ${phase}`)
  console.log(`📝 Prompt: ${prompt.slice(0, 100)}...`)
  console.log(`🔧 Agent path: ${AGENT_PATH}`)
  
  return new Promise((resolve) => {
    // Use PowerShell to run the agent script
    const args = [
      '-ExecutionPolicy', 'Bypass',
      '-File', AGENT_PATH,
      '-p', prompt,
      '--output-format', 'text',
    ]
    
    const agent = spawn('powershell.exe', args, {
      cwd: process.cwd().replace(/[\\/]dev-bot$/, ''), // Run from repo root
      env: getEnvWithPath(),
    })
    
    let stdout = ''
    let stderr = ''
    
    agent.stdout.on('data', (data) => {
      const text = data.toString()
      stdout += text
      process.stdout.write(text) // Stream output
    })
    
    agent.stderr.on('data', (data) => {
      const text = data.toString()
      stderr += text
      process.stderr.write(text)
    })
    
    agent.on('close', (code) => {
      if (code === 0) {
        resolve({
          success: true,
          output: stdout,
        })
      } else {
        resolve({
          success: false,
          output: stdout,
          error: stderr || `Agent exited with code ${code}`,
        })
      }
    })
    
    agent.on('error', (err) => {
      resolve({
        success: false,
        output: stdout,
        error: err.message,
      })
    })
  })
}

function buildPrompt(task: Task, phase: number): string {
  const phaseInfo = getPhaseInfo(task, phase)
  
  const parts = [
    `# Task: ${task.description}`,
    '',
    `## Phase ${phase}: ${phaseInfo.name}`,
    phaseInfo.instructions,
    '',
    `## Requirements`,
    `- Feature: ${task.requirements?.feature || task.description}`,
    `- User Story: ${task.requirements?.userStory || 'N/A'}`,
    '',
    `## Acceptance Criteria`,
    ...(task.requirements?.acceptanceCriteria || []).map(c => `- ${c}`),
    '',
    `## Branch`,
    `Work on branch: ${task.branch}`,
    '',
    `## Important`,
    '- Follow the project rules in .cursor/rules/',
    '- Run lint and typecheck after changes',
    '- Commit after each logical unit of work',
    '- When done, summarize what you did',
  ]
  
  return parts.join('\n')
}

function getPhaseInfo(task: Task, phase: number): { name: string; instructions: string } {
  if (task.complexity === 'quick') {
    return {
      name: 'Implementation',
      instructions: `This is a quick task. Implement the change, run lint/typecheck, commit, and create a PR.`,
    }
  }
  
  switch (phase) {
    case 1:
      return {
        name: 'Planning',
        instructions: `Analyze the codebase and create an implementation plan. Identify which files need to change and what the approach should be. Do NOT make code changes yet - just plan.`,
      }
    case 2:
      return {
        name: 'Implementation',
        instructions: `Follow the plan from Phase 1. Make the code changes, ensuring you run lint and typecheck. Commit after each logical unit of work.`,
      }
    case 3:
      return {
        name: 'Testing & PR',
        instructions: `Run existing tests, add new tests if needed. Create a pull request with a clear description of the changes.`,
      }
    default:
      return {
        name: 'Execution',
        instructions: task.description,
      }
  }
}
