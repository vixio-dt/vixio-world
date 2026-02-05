'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Paper, Group, Text, Badge, Stack } from '@mantine/core'
import { 
  Scale, 
  Atom, 
  Wand2, 
  Cpu, 
  Dna, 
  Users, 
  Flag, 
  Coins, 
  Clock, 
  Sparkles 
} from 'lucide-react'
import type { Rule } from '@/lib/types/database'

interface RuleCardProps {
  rule: Rule
  index?: number
}

// Category configuration with icons and colors
const categoryConfig: Record<string, { icon: typeof Scale; color: string; label: string; gradient: string }> = {
  physics: { icon: Atom, color: 'blue', label: 'Physics', gradient: 'from-blue-400 to-indigo-600' },
  magic: { icon: Wand2, color: 'violet', label: 'Magic', gradient: 'from-violet-400 to-purple-600' },
  technology: { icon: Cpu, color: 'cyan', label: 'Technology', gradient: 'from-cyan-400 to-sky-600' },
  biology: { icon: Dna, color: 'emerald', label: 'Biology', gradient: 'from-emerald-400 to-teal-600' },
  social: { icon: Users, color: 'orange', label: 'Social', gradient: 'from-orange-400 to-red-500' },
  political: { icon: Flag, color: 'red', label: 'Political', gradient: 'from-red-400 to-rose-600' },
  economic: { icon: Coins, color: 'amber', label: 'Economic', gradient: 'from-amber-400 to-yellow-600' },
  temporal: { icon: Clock, color: 'indigo', label: 'Temporal', gradient: 'from-indigo-400 to-violet-600' },
  cosmological: { icon: Sparkles, color: 'pink', label: 'Cosmological', gradient: 'from-pink-400 to-rose-600' },
}

export function RuleCard({ rule, index = 0 }: RuleCardProps) {
  const config = categoryConfig[rule.category || 'physics'] || { 
    icon: Scale, 
    color: 'indigo', 
    label: 'Rule', 
    gradient: 'from-indigo-400 to-violet-600' 
  }
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/rules/${rule.id}`}>
        <Paper
          p="lg"
          radius="lg"
          withBorder
          className="group cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 dark:bg-slate-800 dark:border-slate-700 h-full"
        >
          {/* Header with icon and name */}
          <div className="flex items-start gap-4">
            <div className={`relative flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200`}>
              <Icon className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            
            <Stack gap="xs" className="flex-1 min-w-0">
              <div>
                <Text fw={600} size="lg" className="text-slate-900 dark:text-slate-100 truncate">
                  {rule.name}
                </Text>
                <Group gap="xs" mt={4}>
                  <Badge color={config.color} variant="light" size="sm" leftSection={<Icon className="w-3 h-3" />}>
                    {config.label}
                  </Badge>
                  {rule.code && (
                    <Badge variant="outline" color="gray" size="sm" className="font-mono">
                      {rule.code}
                    </Badge>
                  )}
                </Group>
              </div>
            </Stack>
          </div>
          
          {/* Content Section */}
          <Stack gap="sm" mt="md">
            {rule.statement && (
              <Paper p="sm" radius="sm" className="bg-slate-50 dark:bg-slate-900 border-l-2 border-slate-300 dark:border-slate-600">
                <Text size="sm" c="dimmed" lineClamp={2} className="italic">
                  &ldquo;{rule.statement}&rdquo;
                </Text>
              </Paper>
            )}
            
            {rule.story_context && (
              <Paper p="xs" radius="sm" className="bg-indigo-50 dark:bg-indigo-900/20 border-l-2 border-indigo-400">
                <Group gap="xs" wrap="nowrap">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                  <Text size="xs" c="indigo.7" className="dark:text-indigo-300" lineClamp={1}>
                    {rule.story_context}
                  </Text>
                </Group>
              </Paper>
            )}
            
            {rule.scope && (
              <Text size="xs" c="dimmed">
                <span className="font-medium">Scope:</span> {rule.scope}
              </Text>
            )}
          </Stack>
        </Paper>
      </Link>
    </motion.div>
  )
}
