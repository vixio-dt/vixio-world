'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Paper, NavLink, Text, Badge, Group, Stack, ThemeIcon, ScrollArea, Accordion, Divider } from '@mantine/core'
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
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react'
import type { Rule } from '@/lib/types/database'
import { staggerContainer, staggerItem } from '@/lib/animations'

interface RuleCategoryViewProps {
  rules: Rule[]
}

// Category configuration with icons and colors
const categoryConfig: Record<string, { icon: typeof Scale; color: string; label: string; description: string }> = {
  physics: { 
    icon: Atom, 
    color: 'blue', 
    label: 'Physics', 
    description: 'Natural laws governing matter and energy' 
  },
  magic: { 
    icon: Wand2, 
    color: 'violet', 
    label: 'Magic', 
    description: 'Supernatural forces and mystical systems' 
  },
  technology: { 
    icon: Cpu, 
    color: 'cyan', 
    label: 'Technology', 
    description: 'Technological capabilities and limitations' 
  },
  biology: { 
    icon: Dna, 
    color: 'emerald', 
    label: 'Biology', 
    description: 'Life forms and biological processes' 
  },
  social: { 
    icon: Users, 
    color: 'orange', 
    label: 'Social', 
    description: 'Social structures and norms' 
  },
  political: { 
    icon: Flag, 
    color: 'red', 
    label: 'Political', 
    description: 'Governance and political systems' 
  },
  economic: { 
    icon: Coins, 
    color: 'amber', 
    label: 'Economic', 
    description: 'Trade, currency, and economic systems' 
  },
  temporal: { 
    icon: Clock, 
    color: 'indigo', 
    label: 'Temporal', 
    description: 'Time-related rules and mechanics' 
  },
  cosmological: { 
    icon: Sparkles, 
    color: 'pink', 
    label: 'Cosmological', 
    description: 'Universal laws and cosmic structures' 
  },
}

export function RuleCategoryView({ rules }: RuleCategoryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Group rules by category
  const groupedRules = useMemo(() => {
    const groups: Record<string, Rule[]> = {}
    const uncategorized: Rule[] = []
    
    rules.forEach(rule => {
      if (rule.category) {
        if (!groups[rule.category]) {
          groups[rule.category] = []
        }
        groups[rule.category].push(rule)
      } else {
        uncategorized.push(rule)
      }
    })
    
    if (uncategorized.length > 0) {
      groups['other'] = uncategorized
    }
    
    return groups
  }, [rules])

  // Get categories that have rules
  const activeCategories = Object.keys(groupedRules).sort((a, b) => {
    const order = ['physics', 'magic', 'technology', 'biology', 'social', 'political', 'economic', 'temporal', 'cosmological', 'other']
    return order.indexOf(a) - order.indexOf(b)
  })

  // Rules to display (filtered by category or all)
  const displayedRules = selectedCategory 
    ? groupedRules[selectedCategory] || [] 
    : rules

  return (
    <div className="flex gap-6 min-h-[500px]">
      {/* Sidebar Navigation */}
      <Paper 
        withBorder 
        radius="lg" 
        className="w-64 flex-shrink-0 dark:bg-slate-800 dark:border-slate-700"
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <Group gap="xs">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <Text fw={600} size="sm" className="text-slate-700 dark:text-slate-200">
              Categories
            </Text>
          </Group>
        </div>
        <ScrollArea h={450} className="p-2">
          <NavLink
            label="All Rules"
            leftSection={<Scale className="w-4 h-4" />}
            active={selectedCategory === null}
            onClick={() => setSelectedCategory(null)}
            variant="light"
            color="indigo"
            className="rounded-md mb-1"
            rightSection={
              <Badge size="xs" variant="light" color="gray">
                {rules.length}
              </Badge>
            }
          />
          
          <Divider my="xs" />
          
          {activeCategories.map(category => {
            const config = categoryConfig[category] || { 
              icon: Scale, 
              color: 'gray', 
              label: category === 'other' ? 'Other' : category,
              description: 'Uncategorized rules'
            }
            const Icon = config.icon
            const count = groupedRules[category]?.length || 0
            
            return (
              <NavLink
                key={category}
                label={config.label}
                description={config.description}
                leftSection={
                  <ThemeIcon size={28} radius="md" color={config.color} variant="light">
                    <Icon className="w-3.5 h-3.5" />
                  </ThemeIcon>
                }
                active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                variant="light"
                color={config.color}
                className="rounded-md mb-1"
                rightSection={
                  <Badge size="xs" variant="light" color={config.color}>
                    {count}
                  </Badge>
                }
              />
            )
          })}
        </ScrollArea>
      </Paper>

      {/* Rules List */}
      <div className="flex-1">
        <motion.div
          key={selectedCategory || 'all'}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Category Header */}
          {selectedCategory && categoryConfig[selectedCategory] && (
            <motion.div variants={staggerItem} className="mb-6">
              <Group gap="sm">
                <ThemeIcon 
                  size={40} 
                  radius="md" 
                  color={categoryConfig[selectedCategory].color} 
                  variant="light"
                >
                  {(() => {
                    const Icon = categoryConfig[selectedCategory].icon
                    return <Icon className="w-5 h-5" />
                  })()}
                </ThemeIcon>
                <div>
                  <Text fw={700} size="xl" className="text-slate-900 dark:text-slate-100">
                    {categoryConfig[selectedCategory].label}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {categoryConfig[selectedCategory].description}
                  </Text>
                </div>
              </Group>
            </motion.div>
          )}

          {/* Rules Accordion */}
          <Accordion 
            variant="separated" 
            radius="md"
            classNames={{
              item: 'dark:bg-slate-800 dark:border-slate-700',
              control: 'dark:hover:bg-slate-700',
              label: 'dark:text-slate-100',
              panel: 'dark:text-slate-300',
            }}
          >
            {displayedRules.map((rule, index) => {
              const config = categoryConfig[rule.category || 'other'] || { icon: Scale, color: 'gray', label: 'Other' }
              const Icon = config.icon
              
              return (
                <motion.div key={rule.id} variants={staggerItem} custom={index}>
                  <Accordion.Item value={rule.id}>
                    <Accordion.Control
                      icon={
                        <ThemeIcon size={28} radius="md" color={config.color} variant="light">
                          <Icon className="w-3.5 h-3.5" />
                        </ThemeIcon>
                      }
                    >
                      <Group gap="sm" wrap="nowrap">
                        <div className="flex-1 min-w-0">
                          <Text fw={600} truncate>
                            {rule.name}
                          </Text>
                          {rule.code && (
                            <Text size="xs" c="dimmed" className="font-mono">
                              {rule.code}
                            </Text>
                          )}
                        </div>
                        {!selectedCategory && rule.category && (
                          <Badge size="xs" variant="light" color={config.color}>
                            {config.label}
                          </Badge>
                        )}
                      </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Stack gap="md">
                        {rule.statement && (
                          <div>
                            <Text size="xs" c="dimmed" fw={500} mb={4}>Statement</Text>
                            <Paper p="sm" radius="sm" className="bg-slate-50 dark:bg-slate-900">
                              <Text size="sm">{rule.statement}</Text>
                            </Paper>
                          </div>
                        )}
                        
                        {rule.scope && (
                          <div>
                            <Text size="xs" c="dimmed" fw={500} mb={4}>Scope</Text>
                            <Text size="sm">{rule.scope}</Text>
                          </div>
                        )}
                        
                        {rule.exceptions && (
                          <div>
                            <Text size="xs" c="dimmed" fw={500} mb={4}>Exceptions</Text>
                            <Text size="sm">{rule.exceptions}</Text>
                          </div>
                        )}
                        
                        {rule.consequences && (
                          <div>
                            <Text size="xs" c="dimmed" fw={500} mb={4}>Consequences</Text>
                            <Text size="sm">{rule.consequences}</Text>
                          </div>
                        )}
                        
                        {rule.story_context && (
                          <Paper p="xs" radius="sm" className="bg-indigo-50 dark:bg-indigo-900/20 border-l-2 border-indigo-400">
                            <Group gap="xs" wrap="nowrap">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                              <Text size="xs" c="indigo.7" className="dark:text-indigo-300">
                                {rule.story_context}
                              </Text>
                            </Group>
                          </Paper>
                        )}
                        
                        <Link href={`/rules/${rule.id}`}>
                          <Group gap="xs" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer">
                            <Text size="sm" fw={500}>View full details</Text>
                            <ChevronRight className="w-4 h-4" />
                          </Group>
                        </Link>
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                </motion.div>
              )
            })}
          </Accordion>
        </motion.div>
      </div>
    </div>
  )
}
