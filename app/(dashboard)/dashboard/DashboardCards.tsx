'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Paper, Text, Group, Badge } from '@mantine/core'
import { 
  ArrowRight, 
  Users, 
  MapPin, 
  Building2, 
  Calendar, 
  Package, 
  Scale, 
  BookOpen,
  type LucideIcon
} from 'lucide-react'

interface EntityType {
  href: string
  label: string
  icon: LucideIcon
  description: string
  table: string
  gradient: string
  color: string
}

const entityTypes: EntityType[] = [
  { 
    href: '/characters', 
    label: 'Characters', 
    icon: Users,
    description: 'Create and manage your cast of characters',
    table: 'characters',
    gradient: 'from-sky-500 to-blue-600',
    color: 'blue'
  },
  { 
    href: '/locations', 
    label: 'Locations', 
    icon: MapPin,
    description: 'Define the places in your world',
    table: 'locations',
    gradient: 'from-emerald-500 to-teal-600',
    color: 'teal'
  },
  { 
    href: '/organizations', 
    label: 'Organizations', 
    icon: Building2,
    description: 'Build factions, governments, and groups',
    table: 'organizations',
    gradient: 'from-purple-500 to-violet-600',
    color: 'violet'
  },
  { 
    href: '/timeline', 
    label: 'Timeline', 
    icon: Calendar,
    description: 'Track events and history',
    table: 'events',
    gradient: 'from-rose-500 to-pink-600',
    color: 'pink'
  },
  { 
    href: '/items', 
    label: 'Items', 
    icon: Package,
    description: 'Catalog important objects and artifacts',
    table: 'items',
    gradient: 'from-amber-500 to-orange-600',
    color: 'orange'
  },
  { 
    href: '/rules', 
    label: 'Rules', 
    icon: Scale,
    description: 'Document the laws of your world',
    table: 'rules',
    gradient: 'from-indigo-500 to-blue-600',
    color: 'indigo'
  },
  { 
    href: '/stories', 
    label: 'Stories', 
    icon: BookOpen,
    description: 'Write and organize your narratives',
    table: 'stories',
    gradient: 'from-cyan-500 to-teal-600',
    color: 'cyan'
  },
]

interface DashboardCardsProps {
  counts: Record<string, number>
}

export function DashboardCards({ counts }: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {entityTypes.map((entity, index) => {
        const Icon = entity.icon
        return (
          <motion.div
            key={entity.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link href={entity.href}>
              <Paper
                p="xl"
                radius="lg"
                withBorder
                className="group cursor-pointer hover:border-cyan-400 dark:hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 dark:bg-slate-800 dark:border-slate-700 h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${entity.gradient} shadow-lg group-hover:scale-105 transition-transform duration-200`}>
                    <Icon className="w-6 h-6 text-white drop-shadow-sm" />
                  </div>
                  <Badge 
                    size="xl" 
                    variant="light" 
                    color={entity.color}
                    className="text-2xl font-bold px-3 py-2"
                  >
                    {counts[entity.table] || 0}
                  </Badge>
                </div>
                
                <Text fw={600} size="lg" className="text-slate-900 dark:text-slate-100 mb-1">
                  {entity.label}
                </Text>
                
                <Text size="sm" c="dimmed" className="mb-4 dark:text-slate-400">
                  {entity.description}
                </Text>
                
                <Group gap="xs" className="text-cyan-600 dark:text-cyan-400 font-medium">
                  <Text size="sm">View all</Text>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Group>
              </Paper>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
