import { cookies } from 'next/headers'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { EmptyState } from '@/components/ui'
import { ArrowRight, Building2, Globe, MapPin, Network, Package, Users } from 'lucide-react'
import { Badge, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core'

export default async function AssetsPage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value

  if (!worldId) {
    return (
      <EmptyState
        icon={Globe}
        title="No project selected"
        description="Create or select a project to open its asset library."
      />
    )
  }

  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typedSupabase = supabase as any

  const [
    { data: project },
    { count: characterCount },
    { count: locationCount },
    { count: organizationCount },
    { count: itemCount },
  ] = await Promise.all([
    typedSupabase.from('worlds').select('name').eq('id', worldId).single(),
    typedSupabase.from('characters').select('*', { count: 'exact', head: true }).eq('world_id', worldId),
    typedSupabase.from('locations').select('*', { count: 'exact', head: true }).eq('world_id', worldId),
    typedSupabase.from('organizations').select('*', { count: 'exact', head: true }).eq('world_id', worldId),
    typedSupabase.from('items').select('*', { count: 'exact', head: true }).eq('world_id', worldId),
  ])

  const assetSections = [
    {
      href: '/characters',
      label: 'Characters',
      description: 'Performance, costume, and story context inputs for casting, boards, and visual consistency.',
      metric: `${characterCount || 0} characters`,
      icon: Users,
    },
    {
      href: '/locations',
      label: 'Locations',
      description: 'Sets, spaces, and atmosphere references that support scene blocking and storyboard composition.',
      metric: `${locationCount || 0} locations`,
      icon: MapPin,
    },
    {
      href: '/organizations',
      label: 'Groups and departments',
      description: 'Factions, teams, and support groups that influence scene logic and production context.',
      metric: `${organizationCount || 0} groups`,
      icon: Building2,
    },
    {
      href: '/items',
      label: 'Props and objects',
      description: 'Props, vehicles, and artifacts that become concrete design and shot-planning inputs.',
      metric: `${itemCount || 0} items`,
      icon: Package,
    },
    {
      href: '/graph',
      label: 'Relationship graph',
      description: 'See how the current canon connects so boards and exports stay grounded in the same project memory.',
      metric: 'Visualize links',
      icon: Network,
    },
  ]

  return (
    <Stack gap="xl">
      <Paper withBorder radius="lg" p="xl">
        <Stack gap="md">
          <div>
            <Title order={1}>Assets</Title>
            <Text c="dimmed" mt={6}>
              {project?.name || 'This project'} keeps assets visible as reusable inputs to design, breakdown, and storyboard work.
            </Text>
          </div>
          <Group gap="xs">
            <Badge variant="light" color="cyan">
              Visual planning inputs
            </Badge>
            <Badge variant="outline">Supports boards and exports</Badge>
          </Group>
        </Stack>
      </Paper>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        {assetSections.map((section) => {
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
