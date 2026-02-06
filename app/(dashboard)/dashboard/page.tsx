import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { 
  Users, 
  MapPin, 
  Building2, 
  Calendar, 
  Package, 
  Scale, 
  BookOpen,
  ArrowRight
} from 'lucide-react'
import { Title, Text, Paper, ThemeIcon, Group, Stack } from '@mantine/core'

const entityTypes = [
  { 
    href: '/characters', 
    label: 'Characters', 
    icon: Users,
    description: 'Create and manage your cast of characters',
    table: 'characters'
  },
  { 
    href: '/locations', 
    label: 'Locations', 
    icon: MapPin,
    description: 'Define the places in your world',
    table: 'locations'
  },
  { 
    href: '/organizations', 
    label: 'Organizations', 
    icon: Building2,
    description: 'Build factions, governments, and groups',
    table: 'organizations'
  },
  { 
    href: '/timeline', 
    label: 'Timeline', 
    icon: Calendar,
    description: 'Track events and history',
    table: 'events'
  },
  { 
    href: '/items', 
    label: 'Items', 
    icon: Package,
    description: 'Catalog important objects and artifacts',
    table: 'items'
  },
  { 
    href: '/rules', 
    label: 'Rules', 
    icon: Scale,
    description: 'Document the laws of your world',
    table: 'rules'
  },
  { 
    href: '/stories', 
    label: 'Stories', 
    icon: BookOpen,
    description: 'Write and organize your narratives',
    table: 'stories'
  },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Get counts for each entity type
  const counts: Record<string, number> = {}
  
  for (const entity of entityTypes) {
    const { count } = await supabase
      .from(entity.table)
      .select('*', { count: 'exact', head: true })
    counts[entity.table] = count || 0
  }

  return (
    <div>
      <Stack gap="md" mb="xl">
        <Title order={1}>Dashboard</Title>
        <Text c="dimmed">Welcome to your world</Text>
      </Stack>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entityTypes.map((entity) => {
          const IconComponent = entity.icon
          return (
            <Link
              key={entity.href}
              href={entity.href}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Paper
                withBorder
                shadow="xs"
                radius="md"
                p="lg"
                className="group hover:border-cyan-300 hover:shadow-lg transition-all duration-200"
              >
                <Group justify="space-between" mb="md">
                  <ThemeIcon variant="light" color="cyan" size="xl" radius="md">
                    <IconComponent size={24} />
                  </ThemeIcon>
                  <Text fw={700} size="xl">
                    {counts[entity.table]}
                  </Text>
                </Group>
                <Text fw={600} size="lg" mb="xs">
                  {entity.label}
                </Text>
                <Text size="sm" c="dimmed" mb="md">
                  {entity.description}
                </Text>
                <Group gap="xs" className="group-hover:gap-2 transition-all">
                  <Text size="sm" c="cyan">
                    View all
                  </Text>
                  <ArrowRight 
                    size={16} 
                    className="opacity-0 group-hover:opacity-100 transition-opacity" 
                  />
                </Group>
              </Paper>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
