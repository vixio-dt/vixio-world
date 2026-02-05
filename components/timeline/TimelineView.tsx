'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Timeline, Text, Badge, Paper, Group, ThemeIcon } from '@mantine/core'
import { Calendar, History, Milestone, Clock, Repeat } from 'lucide-react'
import type { WorldEvent } from '@/lib/types/database'
import { staggerContainer, staggerItem } from '@/lib/animations'

interface TimelineViewProps {
  events: WorldEvent[]
}

// Event type configuration
const eventTypeConfig: Record<string, { color: string; icon: typeof Calendar; label: string }> = {
  historical: { color: 'slate', icon: History, label: 'Historical' },
  plot_point: { color: 'rose', icon: Milestone, label: 'Plot Point' },
  scheduled: { color: 'cyan', icon: Clock, label: 'Scheduled' },
  recurring: { color: 'violet', icon: Repeat, label: 'Recurring' },
}

// Group events by year/period for better visualization
function groupEventsByPeriod(events: WorldEvent[]): Map<string, WorldEvent[]> {
  const groups = new Map<string, WorldEvent[]>()
  
  events.forEach((event) => {
    // Extract year or use "Undated" as fallback
    const period = event.date 
      ? extractYear(event.date) || 'Other Dates'
      : 'Undated'
    
    if (!groups.has(period)) {
      groups.set(period, [])
    }
    groups.get(period)!.push(event)
  })
  
  return groups
}

// Helper to extract year from various date formats
function extractYear(date: string): string | null {
  // Try to find a 4-digit year
  const yearMatch = date.match(/\b(\d{4})\b/)
  if (yearMatch) return yearMatch[1]
  
  // If it's a fantasy date like "Age of Dawn", return as-is
  if (/^(Age|Era|Year|Epoch)/i.test(date)) {
    return date.split(/\s+/).slice(0, 3).join(' ')
  }
  
  return null
}

function TimelineEventItem({ event, index }: { event: WorldEvent; index: number }) {
  const config = eventTypeConfig[event.type || 'historical'] || eventTypeConfig.historical
  const Icon = config.icon
  
  return (
    <motion.div
      variants={staggerItem}
      custom={index}
    >
      <Timeline.Item
        bullet={
          <ThemeIcon 
            size={28} 
            radius="xl" 
            color={config.color}
            variant="light"
          >
            <Icon className="w-3.5 h-3.5" />
          </ThemeIcon>
        }
        lineVariant="dashed"
      >
        <Link href={`/timeline/${event.id}`}>
          <Paper 
            p="md" 
            radius="md" 
            withBorder
            className="hover:border-cyan-400 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <Group justify="space-between" mb="xs">
              <Text fw={600} size="sm" className="text-slate-900 dark:text-slate-100">
                {event.name}
              </Text>
              <Badge color={config.color} variant="light" size="sm">
                {config.label}
              </Badge>
            </Group>
            
            {event.date && (
              <Group gap="xs" mb="xs">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <Text size="xs" c="dimmed">{event.date}</Text>
              </Group>
            )}
            
            {event.description && (
              <Text size="sm" c="dimmed" lineClamp={2}>
                {event.description}
              </Text>
            )}
            
            {event.story_context && (
              <Paper 
                mt="sm" 
                p="xs" 
                radius="sm" 
                className="bg-cyan-50 dark:bg-cyan-900/20 border-l-2 border-cyan-400"
              >
                <Text size="xs" c="cyan.7" className="dark:text-cyan-300" lineClamp={1}>
                  {event.story_context}
                </Text>
              </Paper>
            )}
          </Paper>
        </Link>
      </Timeline.Item>
    </motion.div>
  )
}

export function TimelineView({ events }: TimelineViewProps) {
  // Group events by period
  const groupedEvents = groupEventsByPeriod(events)
  
  // Convert to array and sort by period (years descending, then alpha)
  const sortedGroups = Array.from(groupedEvents.entries()).sort(([a], [b]) => {
    const aNum = parseInt(a)
    const bNum = parseInt(b)
    if (!isNaN(aNum) && !isNaN(bNum)) return bNum - aNum
    if (!isNaN(aNum)) return -1
    if (!isNaN(bNum)) return 1
    return a.localeCompare(b)
  })
  
  let globalIndex = 0
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="max-w-3xl mx-auto"
    >
      {sortedGroups.map(([period, periodEvents]) => (
        <motion.div key={period} variants={staggerItem} className="mb-8">
          {/* Period Header */}
          <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm py-2 mb-4">
            <Group gap="sm">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600" />
              <Text 
                size="lg" 
                fw={700} 
                className="text-slate-700 dark:text-slate-200"
              >
                {period}
              </Text>
              <Badge variant="light" color="gray" size="sm">
                {periodEvents.length} event{periodEvents.length !== 1 ? 's' : ''}
              </Badge>
            </Group>
          </div>
          
          {/* Timeline for this period */}
          <Timeline 
            active={periodEvents.length - 1} 
            bulletSize={28}
            lineWidth={2}
            color="cyan"
          >
            {periodEvents.map((event) => {
              const idx = globalIndex++
              return (
                <TimelineEventItem 
                  key={event.id} 
                  event={event} 
                  index={idx}
                />
              )
            })}
          </Timeline>
        </motion.div>
      ))}
    </motion.div>
  )
}
