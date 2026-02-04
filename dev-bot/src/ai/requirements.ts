// dev-bot/src/ai/requirements.ts
import { spawn } from 'child_process'

export interface GeneratedRequirements {
  feature: string
  userStory: string
  acceptanceCriteria: string[]
}

/**
 * Generate requirements using Cursor CLI (uses your Cursor subscription)
 */
export async function generateRequirementsWithAI(
  taskDescription: string
): Promise<GeneratedRequirements> {
  const prompt = `You are a product manager. Given this task description, generate requirements in JSON format.

Task: ${taskDescription}

Respond with ONLY valid JSON (no markdown, no explanation):
{
  "feature": "Feature Name (2-5 words)",
  "userStory": "As a [user], I want [goal], so that [benefit]",
  "acceptanceCriteria": ["Criterion 1", "Criterion 2", "Criterion 3"]
}

Keep it concise and actionable.`

  try {
    const result = await runCursorAgent(prompt)
    
    // Parse JSON from response
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.warn('No JSON found in Cursor response, using fallback')
      return getFallbackRequirements(taskDescription)
    }

    const parsed = JSON.parse(jsonMatch[0]) as GeneratedRequirements
    
    // Validate
    if (!parsed.feature || !parsed.userStory || !Array.isArray(parsed.acceptanceCriteria)) {
      return getFallbackRequirements(taskDescription)
    }

    return parsed
  } catch (error) {
    console.error('Cursor requirements generation failed:', error)
    return getFallbackRequirements(taskDescription)
  }
}

// Path to Cursor agent CLI
const AGENT_PATH = process.env.CURSOR_AGENT_PATH || 
  `${process.env.LOCALAPPDATA || 'C:\\Users\\DT Work\\AppData\\Local'}\\cursor-agent\\agent.ps1`

function runCursorAgent(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const args = [
      '-ExecutionPolicy', 'Bypass',
      '-File', AGENT_PATH,
      '-p', prompt,
      '--output-format', 'text',
      '--mode', 'ask',
    ]
    
    const agent = spawn('powershell.exe', args, {
      env: { ...process.env },
    })
    
    let stdout = ''
    let stderr = ''
    
    agent.stdout.on('data', (data) => {
      stdout += data.toString()
    })
    
    agent.stderr.on('data', (data) => {
      stderr += data.toString()
    })
    
    agent.on('close', (code) => {
      if (code === 0) {
        resolve(stdout)
      } else {
        reject(new Error(stderr || `Agent exited with code ${code}`))
      }
    })
    
    agent.on('error', reject)
  })
}

function getFallbackRequirements(taskDescription: string): GeneratedRequirements {
  return {
    feature: taskDescription,
    userStory: `Implement: ${taskDescription}`,
    acceptanceCriteria: [
      'Feature works as described',
      'No regressions in existing functionality',
      'Code passes lint and type checks',
    ],
  }
}
