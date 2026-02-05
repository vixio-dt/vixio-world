'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Paper, Group, Text, Badge, Stack } from '@mantine/core'
import { 
  Package, 
  Sword, 
  Car, 
  Sparkles, 
  Wrench, 
  FileText, 
  Shirt, 
  Cpu 
} from 'lucide-react'
import type { Item } from '@/lib/types/database'

interface ItemCardProps {
  item: Item
  index?: number
}

const typeConfig: Record<string, { icon: typeof Package; gradient: string; color: string; label: string }> = {
  weapon: { icon: Sword, gradient: 'from-red-500 to-rose-600', color: 'red', label: 'Weapon' },
  vehicle: { icon: Car, gradient: 'from-blue-500 to-indigo-600', color: 'blue', label: 'Vehicle' },
  artifact: { icon: Sparkles, gradient: 'from-amber-500 to-yellow-600', color: 'yellow', label: 'Artifact' },
  tool: { icon: Wrench, gradient: 'from-slate-500 to-gray-600', color: 'gray', label: 'Tool' },
  document: { icon: FileText, gradient: 'from-emerald-500 to-teal-600', color: 'teal', label: 'Document' },
  clothing: { icon: Shirt, gradient: 'from-pink-500 to-fuchsia-600', color: 'pink', label: 'Clothing' },
  technology: { icon: Cpu, gradient: 'from-cyan-500 to-blue-600', color: 'cyan', label: 'Technology' },
}

export function ItemCard({ item, index = 0 }: ItemCardProps) {
  const config = typeConfig[item.type || 'artifact'] || typeConfig.artifact
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/items/${item.id}`}>
        <Paper
          p="lg"
          radius="lg"
          withBorder
          className="group cursor-pointer hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-200 dark:bg-slate-800 dark:border-slate-700 h-full"
        >
          <div className="flex items-start gap-4">
            <div className={`relative flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200`}>
              <Icon className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            
            <Stack gap="xs" className="flex-1 min-w-0">
              <div>
                <Text fw={600} size="lg" className="text-slate-900 dark:text-slate-100 truncate">
                  {item.name}
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
            {item.description && (
              <Text size="sm" c="dimmed" lineClamp={2} className="dark:text-slate-400">
                {item.description}
              </Text>
            )}
            
            {item.story_context && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-2 border-amber-400 dark:border-amber-500">
                <Text size="xs" c="dimmed" className="uppercase tracking-wide mb-1 dark:text-amber-300">
                  Lore Link
                </Text>
                <Text size="sm" className="text-amber-800 dark:text-amber-200 italic" lineClamp={2}>
                  &ldquo;{item.story_context}&rdquo;
                </Text>
              </div>
            )}
          </Stack>
        </Paper>
      </Link>
    </motion.div>
  )
}
