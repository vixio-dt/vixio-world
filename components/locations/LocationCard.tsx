'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Paper, Group, Text, Badge, Stack } from '@mantine/core'
import { Globe, Mountain, MapPin, Building2, Landmark, Home, DoorOpen, Sparkles } from 'lucide-react'
import type { Location } from '@/lib/types/database'

interface LocationCardProps {
  location: Location
  index?: number
}

// Type configuration for different location types
const typeConfig: Record<string, { icon: typeof Globe; color: string; label: string; gradient: string }> = {
  planet: { icon: Globe, color: 'violet', label: 'Planet', gradient: 'from-violet-400 to-purple-600' },
  continent: { icon: Mountain, color: 'emerald', label: 'Continent', gradient: 'from-emerald-400 to-teal-600' },
  country: { icon: MapPin, color: 'blue', label: 'Country', gradient: 'from-blue-400 to-indigo-600' },
  city: { icon: Building2, color: 'cyan', label: 'City', gradient: 'from-cyan-400 to-sky-600' },
  district: { icon: Landmark, color: 'amber', label: 'District', gradient: 'from-amber-400 to-orange-600' },
  building: { icon: Home, color: 'rose', label: 'Building', gradient: 'from-rose-400 to-pink-600' },
  room: { icon: DoorOpen, color: 'slate', label: 'Room', gradient: 'from-slate-400 to-gray-600' },
}

export function LocationCard({ location, index = 0 }: LocationCardProps) {
  const config = typeConfig[location.type || 'city'] || typeConfig.city
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/locations/${location.id}`}>
        <Paper
          p="lg"
          radius="lg"
          withBorder
          className="group cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200 dark:bg-slate-800 dark:border-slate-700 h-full"
        >
          {/* Header with icon and name */}
          <div className="flex items-start gap-4">
            <div className={`relative flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200`}>
              <Icon className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            
            <Stack gap="xs" className="flex-1 min-w-0">
              <div>
                <Text fw={600} size="lg" className="text-slate-900 dark:text-slate-100 truncate">
                  {location.name}
                </Text>
                <Group gap="xs" mt={4}>
                  <Badge color={config.color} variant="light" size="sm" leftSection={<Icon className="w-3 h-3" />}>
                    {config.label}
                  </Badge>
                </Group>
              </div>
            </Stack>
          </div>
          
          {/* Content Section */}
          <Stack gap="sm" mt="md">
            {location.description && (
              <Text size="sm" c="dimmed" lineClamp={2}>
                {location.description}
              </Text>
            )}
            
            {location.story_context && (
              <Paper p="xs" radius="sm" className="bg-emerald-50 dark:bg-emerald-900/20 border-l-2 border-emerald-400">
                <Group gap="xs" wrap="nowrap">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <Text size="xs" c="emerald.7" className="dark:text-emerald-300" lineClamp={1}>
                    {location.story_context}
                  </Text>
                </Group>
              </Paper>
            )}
            
            {location.atmosphere && (
              <Text size="xs" c="dimmed" className="italic">
                &ldquo;{location.atmosphere}&rdquo;
              </Text>
            )}
          </Stack>
        </Paper>
      </Link>
    </motion.div>
  )
}
