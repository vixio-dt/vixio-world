'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Paper, Group, Text, Badge, Stack, Progress } from '@mantine/core'
import { 
  BookOpen, 
  Lightbulb, 
  FileEdit, 
  PenTool, 
  CheckCircle 
} from 'lucide-react'
import type { Story } from '@/lib/types/database'

interface StoryCardProps {
  story: Story
  index?: number
}

const statusConfig: Record<string, { icon: typeof BookOpen; color: string; label: string; progress: number }> = {
  concept: { icon: Lightbulb, color: 'gray', label: 'Concept', progress: 25 },
  outline: { icon: FileEdit, color: 'yellow', label: 'Outline', progress: 50 },
  draft: { icon: PenTool, color: 'blue', label: 'Draft', progress: 75 },
  complete: { icon: CheckCircle, color: 'green', label: 'Complete', progress: 100 },
}

const genreConfig: Record<string, string> = {
  fantasy: 'violet',
  scifi: 'cyan',
  horror: 'red',
  romance: 'pink',
  mystery: 'indigo',
  thriller: 'orange',
  comedy: 'yellow',
  drama: 'blue',
  action: 'red',
  adventure: 'green',
}

export function StoryCard({ story, index = 0 }: StoryCardProps) {
  const status = statusConfig[story.status || 'concept'] || statusConfig.concept
  const StatusIcon = status.icon
  const genreColor = genreConfig[story.genre?.toLowerCase() || ''] || 'gray'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/stories/${story.id}`}>
        <Paper
          p="lg"
          radius="lg"
          withBorder
          className="group cursor-pointer hover:border-cyan-400 dark:hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 dark:bg-slate-800 dark:border-slate-700 h-full"
        >
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            
            <Stack gap="xs" className="flex-1 min-w-0">
              <div>
                <Text fw={600} size="lg" className="text-slate-900 dark:text-slate-100 truncate">
                  {story.title}
                </Text>
                <Group gap="xs" mt={4}>
                  <Badge 
                    color={status.color} 
                    variant="light" 
                    size="sm"
                    leftSection={<StatusIcon className="w-3 h-3" />}
                  >
                    {status.label}
                  </Badge>
                  {story.genre && (
                    <Badge variant="outline" color={genreColor} size="sm" className="capitalize">
                      {story.genre}
                    </Badge>
                  )}
                </Group>
              </div>
            </Stack>
          </div>

          <Stack gap="sm" mt="md">
            {/* Progress bar for story status */}
            <div>
              <Group justify="space-between" mb={4}>
                <Text size="xs" c="dimmed" className="dark:text-slate-500">Progress</Text>
                <Text size="xs" c="dimmed" className="dark:text-slate-500">{status.progress}%</Text>
              </Group>
              <Progress 
                value={status.progress} 
                color={status.color} 
                size="sm" 
                radius="xl"
                className="dark:bg-slate-700"
              />
            </div>

            {story.logline && (
              <Text size="sm" c="dimmed" lineClamp={2} className="dark:text-slate-400 italic">
                &ldquo;{story.logline}&rdquo;
              </Text>
            )}
            
            {story.story_context && (
              <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border-l-2 border-cyan-400 dark:border-cyan-500">
                <Text size="xs" c="dimmed" className="uppercase tracking-wide mb-1 dark:text-cyan-300">
                  Lore Link
                </Text>
                <Text size="sm" className="text-cyan-800 dark:text-cyan-200 italic" lineClamp={2}>
                  &ldquo;{story.story_context}&rdquo;
                </Text>
              </div>
            )}
          </Stack>
        </Paper>
      </Link>
    </motion.div>
  )
}
