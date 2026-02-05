'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { openrouter, AI_MODEL } from '@/lib/ai/openrouter'
import { buildWorldContext, formatContextAsPrompt, getWorldStats } from '@/lib/utils/ai-context'
import type { ChatSession, ChatMessage, ChatCommand, ChatMessageMetadata, EntityType } from '@/lib/types/database'

/**
 * Get or create a chat session for a world
 */
export async function getOrCreateChatSession(worldId: string): Promise<ChatSession | null> {
  const supabase = await createClient()

  // Try to get existing session
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase as any)
    .from('chat_sessions')
    .select('*')
    .eq('world_id', worldId)
    .single()

  if (existing) {
    return existing as ChatSession
  }

  // Create new session
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: created, error } = await (supabase as any)
    .from('chat_sessions')
    .insert({ world_id: worldId })
    .select()
    .single()

  if (error) {
    console.error('Error creating chat session:', error)
    return null
  }

  return created as ChatSession
}

/**
 * Get messages for a chat session
 */
export async function getChatMessages(sessionId: string): Promise<ChatMessage[]> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching chat messages:', error)
    return []
  }

  return data as ChatMessage[]
}

/**
 * Clear chat history for a session
 */
export async function clearChatHistory(sessionId: string): Promise<boolean> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('chat_messages')
    .delete()
    .eq('session_id', sessionId)

  if (error) {
    console.error('Error clearing chat history:', error)
    return false
  }

  revalidatePath('/chat')
  return true
}

/**
 * Parse command from message content
 */
function parseCommand(content: string): { command: ChatCommand | null; query: string } {
  const trimmed = content.trim()
  
  if (trimmed.startsWith('/check ')) {
    return { command: 'check', query: trimmed.slice(7) }
  }
  if (trimmed.startsWith('/suggest')) {
    return { command: 'suggest', query: trimmed.slice(8).trim() || 'story' }
  }
  if (trimmed.startsWith('/gaps')) {
    return { command: 'gaps', query: '' }
  }
  if (trimmed.startsWith('/connections ')) {
    return { command: 'connections', query: trimmed.slice(13) }
  }
  if (trimmed.startsWith('/status')) {
    return { command: 'status', query: '' }
  }
  
  return { command: 'query', query: trimmed }
}

/**
 * Build system prompt based on command
 */
function buildSystemPrompt(command: ChatCommand, worldContext: string): string {
  const basePrompt = `You are an AI assistant helping a worldbuilder explore and develop their fictional world. You have complete knowledge of the following world:\n\n${worldContext}\n\n`
  
  switch (command) {
    case 'check':
      return basePrompt + `The user wants to check if a statement is consistent with their world rules. Analyze the statement against the world rules and respond with:
1. Whether it's CONSISTENT, WARNING (minor issues), or CONFLICT (breaks rules)
2. Which specific rules apply
3. Brief explanation
4. Suggestions for making it work if there are issues`
    
    case 'suggest':
      return basePrompt + `The user wants story ideas based on their world. Generate creative story suggestions that:
1. Use existing characters, locations, and items
2. Respect world rules
3. Explore interesting conflicts between elements
4. Have clear dramatic potential`
    
    case 'gaps':
      return basePrompt + `Analyze this world for underdeveloped areas. Look for:
1. Characters without clear motivations or backgrounds
2. Locations that lack detail
3. Rules without exceptions or examples
4. Missing relationships between elements
5. Stories in early stages
Prioritize by importance to worldbuilding.`
    
    case 'connections':
      return basePrompt + `The user wants to explore connections for a specific element. Find and explain:
1. Direct relationships (mentioned in descriptions)
2. Implied relationships (logical connections)
3. Potential conflicts or synergies
4. Story opportunities`
    
    case 'status':
      return basePrompt + `Provide a brief status summary of the world including counts and notable elements.`
    
    default:
      return basePrompt + `Answer the user's question using your knowledge of the world. Always cite which elements informed your answer. If asked about something not in the world data, say you don't have that information.`
  }
}

/**
 * Extract source entities from AI response (basic implementation)
 */
function extractSources(response: string, context: { characters: Array<{ id: string; name: string }>; locations: Array<{ id: string; name: string }>; organizations: Array<{ id: string; name: string }>; items: Array<{ id: string; name: string }>; rules: Array<{ id: string; name: string }> }): ChatMessageMetadata['sources'] {
  const sources: ChatMessageMetadata['sources'] = []
  const responseLower = response.toLowerCase()

  // Check for character mentions
  for (const char of context.characters) {
    if (responseLower.includes(char.name.toLowerCase())) {
      sources.push({ type: 'character' as EntityType, id: char.id, name: char.name })
    }
  }

  // Check for location mentions
  for (const loc of context.locations) {
    if (responseLower.includes(loc.name.toLowerCase())) {
      sources.push({ type: 'location' as EntityType, id: loc.id, name: loc.name })
    }
  }

  // Check for organization mentions
  for (const org of context.organizations) {
    if (responseLower.includes(org.name.toLowerCase())) {
      sources.push({ type: 'organization' as EntityType, id: org.id, name: org.name })
    }
  }

  // Check for item mentions
  for (const item of context.items) {
    if (responseLower.includes(item.name.toLowerCase())) {
      sources.push({ type: 'item' as EntityType, id: item.id, name: item.name })
    }
  }

  // Check for rule mentions
  for (const rule of context.rules) {
    if (responseLower.includes(rule.name.toLowerCase())) {
      sources.push({ type: 'rule' as EntityType, id: rule.id, name: rule.name })
    }
  }

  return sources.length > 0 ? sources : undefined
}

/**
 * Send a message and get AI response
 */
export async function sendChatMessage(
  sessionId: string,
  worldId: string,
  content: string
): Promise<{ userMessage: ChatMessage; aiMessage: ChatMessage } | { error: string }> {
  const supabase = await createClient()

  // Parse command
  const { command } = parseCommand(content)

  // Build world context
  const context = await buildWorldContext(worldId)
  if (!context) {
    return { error: 'Failed to load world context' }
  }

  // Handle /status command locally
  if (command === 'status') {
    const stats = getWorldStats(context)
    
    // Save user message
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: userMsg, error: userError } = await (supabase as any)
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role: 'user',
        content,
        command,
        metadata: {},
      })
      .select()
      .single()

    if (userError) {
      return { error: 'Failed to save message' }
    }

    // Generate status response
    const statusContent = `**${context.world.name}** has:
- ${stats.characters} characters
- ${stats.locations} locations
- ${stats.organizations} organizations
- ${stats.rules} world rules
- ${stats.stories} stories
- ${stats.items} items
- ${stats.events} events`

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: aiMsg, error: aiError } = await (supabase as any)
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role: 'assistant',
        content: statusContent,
        command,
        metadata: {},
      })
      .select()
      .single()

    if (aiError) {
      return { error: 'Failed to save response' }
    }

    revalidatePath('/chat')
    return { userMessage: userMsg as ChatMessage, aiMessage: aiMsg as ChatMessage }
  }

  // Save user message
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: userMsg, error: userError } = await (supabase as any)
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      role: 'user',
      content,
      command,
      metadata: {},
    })
    .select()
    .single()

  if (userError) {
    return { error: 'Failed to save message' }
  }

  // Build prompts
  const worldContextPrompt = formatContextAsPrompt(context)
  const systemPrompt = buildSystemPrompt(command || 'query', worldContextPrompt)

  // Get recent messages for context (last 10)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: recentMessages } = await (supabase as any)
    .from('chat_messages')
    .select('role, content')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(10)

  const conversationHistory = (recentMessages || [])
    .reverse()
    .map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

  try {
    // Call AI
    const completion = await openrouter.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
      ],
      max_tokens: 1500,
      temperature: 0.7,
    })

    const aiContent = completion.choices[0]?.message?.content || 'I was unable to generate a response.'

    // Extract sources
    const sources = extractSources(aiContent, context)

    // Save AI response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: aiMsg, error: aiError } = await (supabase as any)
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role: 'assistant',
        content: aiContent,
        command,
        metadata: sources ? { sources } : {},
      })
      .select()
      .single()

    if (aiError) {
      return { error: 'Failed to save response' }
    }

    revalidatePath('/chat')
    return { userMessage: userMsg as ChatMessage, aiMessage: aiMsg as ChatMessage }
  } catch (err) {
    console.error('AI error:', err)
    
    // Save error message
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: aiMsg } = await (supabase as any)
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        command,
        metadata: {},
      })
      .select()
      .single()

    revalidatePath('/chat')
    return { userMessage: userMsg as ChatMessage, aiMessage: aiMsg as ChatMessage }
  }
}
