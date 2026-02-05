'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Paper, Group, Text, Badge, Stack } from '@mantine/core'
import { 
  Building2, 
  Crown, 
  Church, 
  Briefcase, 
  Users, 
  Home, 
  Shield, 
  Eye 
} from 'lucide-react'
import type { Organization } from '@/lib/types/database'

interface OrganizationCardProps {
  organization: Organization
  index?: number
}

const typeConfig: Record<string, { icon: typeof Building2; gradient: string; color: string; label: string }> = {
  government: { icon: Crown, gradient: 'from-violet-500 to-purple-600', color: 'violet', label: 'Government' },
  religion: { icon: Church, gradient: 'from-amber-500 to-orange-600', color: 'orange', label: 'Religion' },
  corporation: { icon: Briefcase, gradient: 'from-blue-500 to-indigo-600', color: 'blue', label: 'Corporation' },
  guild: { icon: Users, gradient: 'from-emerald-500 to-teal-600', color: 'teal', label: 'Guild' },
  family: { icon: Home, gradient: 'from-rose-500 to-pink-600', color: 'pink', label: 'Family' },
  military: { icon: Shield, gradient: 'from-slate-500 to-gray-600', color: 'gray', label: 'Military' },
  secret_society: { icon: Eye, gradient: 'from-purple-500 to-indigo-600', color: 'grape', label: 'Secret Society' },
}

export function OrganizationCard({ organization, index = 0 }: OrganizationCardProps) {
  const config = typeConfig[organization.type || 'corporation'] || typeConfig.corporation
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/organizations/${organization.id}`}>
        <Paper
          p="lg"
          radius="lg"
          withBorder
          className="group cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200 dark:bg-slate-800 dark:border-slate-700 h-full"
        >
          <div className="flex items-start gap-4">
            <div className={`relative flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200`}>
              <Icon className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            
            <Stack gap="xs" className="flex-1 min-w-0">
              <div>
                <Text fw={600} size="lg" className="text-slate-900 dark:text-slate-100 truncate">
                  {organization.name}
                </Text>
                <Group gap="xs" mt={4}>
                  <Badge 
                    color={config.color} 
                    variant="light" 
                    size="sm"
                    leftSection={<Icon className="w-3 h-3" />}
                  >
                    {config.label}
                  </Badge>
                </Group>
              </div>
            </Stack>
          </div>

          <Stack gap="sm" mt="md">
            {organization.purpose && (
              <Text size="sm" c="dimmed" lineClamp={2} className="dark:text-slate-400">
                {organization.purpose}
              </Text>
            )}
            
            {organization.story_context && (
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-2 border-purple-400 dark:border-purple-500">
                <Text size="xs" c="dimmed" className="uppercase tracking-wide mb-1 dark:text-purple-300">
                  Lore Link
                </Text>
                <Text size="sm" className="text-purple-800 dark:text-purple-200 italic" lineClamp={2}>
                  &ldquo;{organization.story_context}&rdquo;
                </Text>
              </div>
            )}
          </Stack>
        </Paper>
      </Link>
    </motion.div>
  )
}
