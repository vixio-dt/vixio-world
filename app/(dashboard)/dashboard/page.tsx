import { cookies } from 'next/headers'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { EmptyState } from '@/components/ui'
import { ArrowRight, BookOpen, FileText, Globe, Network, Package } from 'lucide-react'
import { Badge, Button, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value

  if (!worldId) {
    return (
      <EmptyState
        icon={Globe}
        title="No project selected"
        description="Create or select a project to open the preproduction workspace."
      />
    )
  }

  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typedSupabase = supabase as any

  const [
    { data: project },
    { count: storyCount },
    { count: sceneCount },
    { count: shotCount },
    { count: characterCount },
    { count: locationCount },
    { count: organizationCount },
    { count: itemCount },
    { count: ruleCount },
    { count: eventCount },
  ] = await Promise.all([
    typedSupabase.from('worlds').select('name, genre, tone, logline').eq('id', worldId).single(),
    typedSupabase.from('stories').select('*', { count: 'exact', head: true }).eq('world_id', worldId),
    typedSupabase
      .from('scenes')
      .select('id, stories!inner(world_id)', { count: 'exact', head: true })
      .eq('stories.world_id', worldId),
    typedSupabase
      .from('shots')
      .select('id, scenes!inner(stories!inner(world_id))', { count: 'exact', head: true })
      .eq('scenes.stories.world_id', worldId),
    typedSupabase.from('characters').select('*', { count: 'exact', head: true }).eq('world_id', worldId),
    typedSupabase.from('locations').select('*', { count: 'exact', head: true }).eq('world_id', worldId),
    typedSupabase.from('organizations').select('*', { count: 'exact', head: true }).eq('world_id', worldId),
    typedSupabase.from('items').select('*', { count: 'exact', head: true }).eq('world_id', worldId),
    typedSupabase.from('rules').select('*', { count: 'exact', head: true }).eq('world_id', worldId),
    typedSupabase.from('events').select('*', { count: 'exact', head: true }).eq('world_id', worldId),
  ])

  const canonCount = (storyCount || 0) + (ruleCount || 0) + (eventCount || 0)
  const assetCount =
    (characterCount || 0) + (locationCount || 0) + (organizationCount || 0) + (itemCount || 0)

  const sections = [
    {
      href: '/boards',
      label: 'Boards',
      description: 'Track planning, ideation, scripting, design, and storyboard progress in one place.',
      stat: `${storyCount || 0} stories · ${sceneCount || 0} scenes · ${shotCount || 0} shots`,
      icon: Network,
    },
    {
      href: '/canon',
      label: 'Canon',
      description: 'Keep approved story logic, references, and supporting context visible across the pipeline.',
      stat: `${canonCount} canon records`,
      icon: BookOpen,
    },
    {
      href: '/assets',
      label: 'Assets',
      description: 'Organize characters, locations, props, and groups as reusable visual planning inputs.',
      stat: `${assetCount} tracked assets`,
      icon: Package,
    },
    {
      href: '/export',
      label: 'Exports',
      description: 'Turn project context into deliverables like world bibles, shot lists, and storyboard-ready docs.',
      stat: shotCount ? 'Storyboard pipeline seeded' : 'Waiting on storyboard-ready shots',
      icon: FileText,
    },
  ]

  const projectName = project?.name || 'Untitled project'

  return (
    <Stack gap="xl">
      <Paper withBorder radius="lg" p="xl">
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={1}>Overview</Title>
              <Text c="dimmed" mt={6}>
                {projectName} is now framed as a preproduction workspace, not a world encyclopedia.
              </Text>
            </div>
            <Group gap="sm">
              <Button component={Link} href="/boards" variant="light" color="cyan">
                Open Boards
              </Button>
              <Button component={Link} href="/import?entry=script-breakdown">
                Start Script Breakdown
              </Button>
            </Group>
          </Group>

          <Group gap="xs">
            {project?.genre ? <Badge variant="light">{project.genre}</Badge> : null}
            {project?.tone ? <Badge variant="outline">{project.tone}</Badge> : null}
            <Badge variant="dot" color="cyan">
              Brief and script are equal entry points
            </Badge>
          </Group>

          <Text size="sm" c="dimmed">
            {project?.logline ||
              'Use Boards to move from concept or script into scenes, design references, and storyboard planning.'}
          </Text>
        </Stack>
      </Paper>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <Link
              key={section.href}
              href={section.href}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Paper
                withBorder
                radius="lg"
                p="lg"
                className="group h-full hover:border-cyan-300 hover:shadow-lg transition-all duration-200"
              >
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
                    {section.stat}
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
