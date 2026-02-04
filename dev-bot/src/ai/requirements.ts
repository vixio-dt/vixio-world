// dev-bot/src/ai/requirements.ts
import OpenAI from 'openai'

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'Vixio Dev Bot',
  },
})

// Configurable via env: DEVBOT_AI_MODEL
// Top models on OpenRouter (2026 leaderboard):
//   - anthropic/claude-sonnet-4 (best balance, ~$3/1M tokens)
//   - google/gemini-3-flash-preview (very fast, ~$0.10/1M tokens)
//   - x-ai/grok-code-fast-1 (fast for code, ~$0.15/1M tokens)
//   - anthropic/claude-opus-4 (highest quality, ~$15/1M tokens)
//   - deepseek/deepseek-v3.2 (best value, ~$0.14/1M tokens) - DEFAULT
const AI_MODEL = process.env.DEVBOT_AI_MODEL || 'deepseek/deepseek-v3.2'

// Log model on first import
console.log(`🤖 AI Model: ${AI_MODEL}`)

export interface GeneratedRequirements {
  feature: string
  userStory: string
  acceptanceCriteria: string[]
}

export async function generateRequirementsWithAI(
  taskDescription: string
): Promise<GeneratedRequirements> {
  // Fallback if no API key
  if (!process.env.OPENROUTER_API_KEY) {
    return getFallbackRequirements(taskDescription)
  }

  try {
    const response = await openrouter.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a product manager helping developers write clear requirements.
Given a task description, generate:
1. A clear feature name (2-5 words)
2. A user story in the format "As a [user type], I want [goal], so that [benefit]"
3. 3-5 specific, testable acceptance criteria

Respond in JSON format:
{
  "feature": "Feature Name",
  "userStory": "As a user, I want..., so that...",
  "acceptanceCriteria": ["Criterion 1", "Criterion 2", "Criterion 3"]
}

Keep it concise and actionable. Focus on the user benefit, not implementation details.`,
        },
        {
          role: 'user',
          content: `Task: ${taskDescription}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      return getFallbackRequirements(taskDescription)
    }

    // Parse JSON from response (handle markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return getFallbackRequirements(taskDescription)
    }

    const parsed = JSON.parse(jsonMatch[0]) as GeneratedRequirements
    
    // Validate the response has required fields
    if (!parsed.feature || !parsed.userStory || !Array.isArray(parsed.acceptanceCriteria)) {
      return getFallbackRequirements(taskDescription)
    }

    return parsed
  } catch (error) {
    console.error('AI requirements generation failed:', error)
    return getFallbackRequirements(taskDescription)
  }
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
