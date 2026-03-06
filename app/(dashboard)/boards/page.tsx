import { cookies } from 'next/headers'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { EmptyState } from '@/components/ui'
import { ArrowRight, BookOpen, FileText, Globe, Network, Package, Sparkles } from 'lucide-react'
import { Badge, Button, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core'

export default async function BoardsPage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value

  if (!worldId) {
    return (
      <EmptyState
        icon={Globe}
        title="No project selected"
        description="Create or select a project to open its board workspace."
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
    { count: itemCount },
  ] = await Promise.all([
    typedSupabase.from('worlds').select('name').eq('id', worldId).single(),
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
    typedSupabase.from('items').select('*', { count: 'exact', head: true }).eq('world_id', worldId),
  ])

  const stages = [
    {
      title: 'Planning',
      description: 'Define the brief, audience, tone, and deliverables before the project fragments into disconnected prompts.',
      metric: project?.name ? project.name : 'No project brief captured yet',
      status: project?.name ? 'Active' : 'Needs brief',
      icon: Sparkles,
      href: '/dashboard',
    },
    {
      title: 'Ideation',
      description: 'Develop loglines, references, and concept directions that can later feed scripting and design.',
      metric: `${characterCount || 0} characters · ${locationCount || 0} locations`,
      status: characterCount || locationCount ? 'Seeded' : 'Empty',
      icon: Network,
      href: '/canon',
    },
    {
      title: 'Scripting / Breakdown',
      description: 'Turn a brief or script into scenes, beats, and shot-ready narrative structure.',
      metric: `${storyCount || 0} stories · ${sceneCount || 0} scenes`,
      status: storyCount || sceneCount ? 'In motion' : 'Ready to start',
      icon: FileText,
      href: '/stories',
    },
    {
      title: 'Design',
      description: 'Anchor characters, locations, props, and references so visuals stay consistent across iterations.',
      metric: `${(characterCount || 0) + (locationCount || 0) + (itemCount || 0)} design inputs`,
      status: characterCount || locationCount || itemCount ? 'Seeded' : 'Needs inputs',
      icon: Package,
      href: '/assets',
    },
    {
      title: 'Storyboard',
      description: 'Organize shot intent and visual sequencing so export becomes the end of the flow, not a separate tool.',
      metric: `${shotCount || 0} shots captured`,
      status: shotCount ? 'Storyboard-ready' : 'Waiting on breakdown',
      icon: BookOpen,
      href: '/export',
    },
  ]

  return (
    <Stack gap="xl">
      <Paper withBorder radius="lg" p="xl">
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={1}>Boards</Title>
              <Text c="dimmed" mt={6}>
                {project?.name || 'This project'} now uses stage-aware workspace language inspired by the AnimAgents model.
              </Text>
            </div>
            <Group gap="sm">
              <Button component={Link} href="/import?entry=script-breakdown">
                Break Down a Script
              </Button>
              <Button component={Link} href="/import?entry=references" variant="light" color="gray">
                Import References
              </Button>
            </Group>
          </Group>

          <Group gap="xs">
            <Badge variant="light" color="cyan">
              Stage-aware workflow
            </Badge>
            <Badge variant="outline">Element-level refinement comes next</Badge>
          </Group>
        </Stack>
      </Paper>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        {stages.map((stage) => {
          const Icon = stage.icon
          return (
            <Link key={stage.title} href={stage.href} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Paper withBorder radius="lg" p="lg" className="group h-full hover:border-cyan-300 hover:shadow-lg transition-all duration-200">
                <Stack gap="sm">
                  <Group justify="space-between">
                    <ThemeIcon size="xl" variant="light" color="cyan" radius="md">
                      <Icon size={22} />
                    </ThemeIcon>
                    <Badge variant="light" color={stage.status === 'Empty' || stage.status === 'Needs inputs' || stage.status === 'Ready to start' ? 'gray' : 'cyan'}>
                      {stage.status}
                    </Badge>
                  </Group>
                  <div>
                    <Text fw={700} size="lg">
                      {stage.title}
                    </Text>
                    <Text size="sm" c="dimmed" mt={4}>
                      {stage.description}
                    </Text>
                  </div>
                  <Group justify="space-between">
                    <Text size="sm" fw={600} c="cyan.7">
                      {stage.metric}
                    </Text>
                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Group>
                </Stack>
              </Paper>
            </Link>
          )
        })}
      </SimpleGrid>
    </Stack>
  )
}
