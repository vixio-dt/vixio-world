/**
 * AI Context Builder - Serializes world data for AI chat context
 */

import { createClient } from '@/lib/supabase/server'

export interface WorldContext {
  world: {
    name: string
    genre: string | null
    tone: string | null
    themes: string[] | null
    logline: string | null
  }
  characters: Array<{
    id: string
    name: string
    role: string | null
    personality: string | null
    background: string | null
    motivations: string | null
  }>
  locations: Array<{
    id: string
    name: string
    type: string | null
    description: string | null
    atmosphere: string | null
  }>
  organizations: Array<{
    id: string
    name: string
    type: string | null
    purpose: string | null
  }>
  rules: Array<{
    id: string
    name: string
    code: string | null
    category: string | null
    statement: string | null
    exceptions: string | null
  }>
  stories: Array<{
    id: string
    title: string
    logline: string | null
    status: string | null
  }>
  items: Array<{
    id: string
    name: string
    type: string | null
    description: string | null
    significance: string | null
  }>
  events: Array<{
    id: string
    name: string
    date: string | null
    type: string | null
    description: string | null
  }>
}

/**
 * Build full world context for AI queries
 */
export async function buildWorldContext(worldId: string): Promise<WorldContext | null> {
  const supabase = await createClient()

  // Fetch world
  const { data: world, error: worldError } = await supabase
    .from('worlds')
    .select('name, genre, tone, themes, logline')
    .eq('id', worldId)
    .single()

  if (worldError || !world) {
    console.error('Error fetching world:', worldError)
    return null
  }

  // Fetch all entities in parallel
  const [characters, locations, organizations, rules, stories, items, events] = await Promise.all([
    supabase
      .from('characters')
      .select('id, name, role, personality, background, motivations')
      .eq('world_id', worldId),
    supabase
      .from('locations')
      .select('id, name, type, description, atmosphere')
      .eq('world_id', worldId),
    supabase
      .from('organizations')
      .select('id, name, type, purpose')
      .eq('world_id', worldId),
    supabase
      .from('rules')
      .select('id, name, code, category, statement, exceptions')
      .eq('world_id', worldId),
    supabase
      .from('stories')
      .select('id, title, logline, status')
      .eq('world_id', worldId),
    supabase
      .from('items')
      .select('id, name, type, description, significance')
      .eq('world_id', worldId),
    supabase
      .from('events')
      .select('id, name, date, type, description')
      .eq('world_id', worldId),
  ])

  return {
    world,
    characters: characters.data || [],
    locations: locations.data || [],
    organizations: organizations.data || [],
    rules: rules.data || [],
    stories: stories.data || [],
    items: items.data || [],
    events: events.data || [],
  }
}

/**
 * Format world context as a system prompt for the AI
 */
export function formatContextAsPrompt(context: WorldContext): string {
  const sections: string[] = []

  // World overview
  sections.push(`# World: ${context.world.name}`)
  if (context.world.genre) sections.push(`Genre: ${context.world.genre}`)
  if (context.world.tone) sections.push(`Tone: ${context.world.tone}`)
  if (context.world.themes?.length) sections.push(`Themes: ${context.world.themes.join(', ')}`)
  if (context.world.logline) sections.push(`Logline: ${context.world.logline}`)

  // Characters
  if (context.characters.length > 0) {
    sections.push('\n## Characters')
    for (const char of context.characters) {
      const parts = [`- **${char.name}**`]
      if (char.role) parts.push(`(${char.role})`)
      if (char.personality) parts.push(`- ${char.personality}`)
      if (char.background) parts.push(`Background: ${char.background}`)
      if (char.motivations) parts.push(`Motivations: ${char.motivations}`)
      sections.push(parts.join(' '))
    }
  }

  // Locations
  if (context.locations.length > 0) {
    sections.push('\n## Locations')
    for (const loc of context.locations) {
      const parts = [`- **${loc.name}**`]
      if (loc.type) parts.push(`(${loc.type})`)
      if (loc.description) parts.push(`- ${loc.description}`)
      if (loc.atmosphere) parts.push(`Atmosphere: ${loc.atmosphere}`)
      sections.push(parts.join(' '))
    }
  }

  // Organizations
  if (context.organizations.length > 0) {
    sections.push('\n## Organizations')
    for (const org of context.organizations) {
      const parts = [`- **${org.name}**`]
      if (org.type) parts.push(`(${org.type})`)
      if (org.purpose) parts.push(`- ${org.purpose}`)
      sections.push(parts.join(' '))
    }
  }

  // Rules
  if (context.rules.length > 0) {
    sections.push('\n## World Rules')
    for (const rule of context.rules) {
      const parts = [`- **${rule.name}**`]
      if (rule.code) parts.push(`[${rule.code}]`)
      if (rule.category) parts.push(`(${rule.category})`)
      if (rule.statement) parts.push(`- ${rule.statement}`)
      if (rule.exceptions) parts.push(`Exceptions: ${rule.exceptions}`)
      sections.push(parts.join(' '))
    }
  }

  // Items
  if (context.items.length > 0) {
    sections.push('\n## Items')
    for (const item of context.items) {
      const parts = [`- **${item.name}**`]
      if (item.type) parts.push(`(${item.type})`)
      if (item.description) parts.push(`- ${item.description}`)
      if (item.significance) parts.push(`Significance: ${item.significance}`)
      sections.push(parts.join(' '))
    }
  }

  // Events
  if (context.events.length > 0) {
    sections.push('\n## Events')
    for (const event of context.events) {
      const parts = [`- **${event.name}**`]
      if (event.date) parts.push(`(${event.date})`)
      if (event.type) parts.push(`[${event.type}]`)
      if (event.description) parts.push(`- ${event.description}`)
      sections.push(parts.join(' '))
    }
  }

  // Stories
  if (context.stories.length > 0) {
    sections.push('\n## Stories')
    for (const story of context.stories) {
      const parts = [`- **${story.title}**`]
      if (story.status) parts.push(`(${story.status})`)
      if (story.logline) parts.push(`- ${story.logline}`)
      sections.push(parts.join(' '))
    }
  }

  return sections.join('\n')
}

/**
 * Get statistics about the world
 */
export function getWorldStats(context: WorldContext) {
  return {
    characters: context.characters.length,
    locations: context.locations.length,
    organizations: context.organizations.length,
    rules: context.rules.length,
    stories: context.stories.length,
    items: context.items.length,
    events: context.events.length,
  }
}
