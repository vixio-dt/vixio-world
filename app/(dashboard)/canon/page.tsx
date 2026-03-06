import { cookies } from 'next/headers'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { EmptyState } from '@/components/ui'
import { ArrowRight, BookOpen, Calendar, Globe, Scale, Sparkles } from 'lucide-react'
import { Badge, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core'

export default async function CanonPage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value

  if (!worldId) {
    return (
      <EmptyState
        icon={Globe}
        title="No project selected"
        description="Create or select a project to review its canon."
      />
    )
  }

  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typedSupabase = supabase as any

  const [
    { data: project },
    { count: storyCount },
    { count: eventCount },
    { count: ruleCount },
  ] = await Promise.all([
    typedSupabase.from('worlds').select('name').eq('id', worldId).single(),
    typedSupabase.from('stories').select('*', { count: 'exact', head: true }).eq('world_id', worldId),
    typedSupabase.from('events').select('*', { count: 'exact', head: true }).eq('world_id', worldId),
    typedSupabase.from('rules').select('*', { count: 'exact', head: true }).eq('world_id', worldId),
  ])

  const canonSections = [
    {
      href: '/stories',
      label: 'Stories and scene intent',
      description: 'Narrative containers, story context, and the first layer of preproduction meaning.',
      metric: `${storyCount || 0} stories`,
      icon: BookOpen,
    },
    {
      href: '/timeline',
      label: 'Timeline and project history',
      description: 'Events, chronology, and reference beats that support scene planning and sequencing.',
      metric: `${eventCount || 0} timeline events`,
      icon: Calendar,
    },
    {
      href: '/rules',
      label: 'Rules and constraints',
      description: 'Logic, tone guards, production assumptions, and world constraints that help AI stay aligned.',
      metric: `${ruleCount || 0} rules`,
      icon: Scale,
    },
    {
      href: '/import?entry=references',
      label: 'Imported references',
      description: 'Decks, notes, and support material that enrich the canon without becoming the whole product.',
      metric: 'Bring in external context',
      icon: Sparkles,
    },
  ]

  return (
    <Stack gap="xl">
      <Paper withBorder radius="lg" p="xl">
        <Stack gap="md">
          <div>
            <Title order={1}>Canon</Title>
            <Text c="dimmed" mt={6}>
              {project?.name || 'This project'} treats canon as a support layer for visualization and planning, not the primary product surface.
            </Text>
          </div>
          <Group gap="xs">
            <Badge variant="light" color="cyan">
              Optional but durable
            </Badge>
            <Badge variant="outline">Feeds every downstream board</Badge>
          </Group>
        </Stack>
      </Paper>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        {canonSections.map((section) => {
          const Icon = section.icon
          return (
            <Link key={section.href} href={section.href} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Paper withBorder radius="lg" p="lg" className="group h-full hover:border-cyan-300 hover:shadow-lg transition-all duration-200">
                <Stack gap="sm">
                  <Group justify="space-between">
                    <ThemeIcon size="xl" variant="light" color="cyan" radius="md">
                      <Icon size={22} />
                    </ThemeIcon>
                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Group>
                  <div>
                    <Text fw={700} size="lg">
                      {section.label}
                    </Text>
                    <Text size="sm" c="dimmed" mt={4}>
                      {section.description}
                    </Text>
                  </div>
                  <Text size="sm" fw={600} c="cyan.7">
                    {section.metric}
                  </Text>
                </Stack>
              </Paper>
            </Link>
          )
        })}
      </SimpleGrid>
    </Stack>
  )
}
