'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Badge, Paper, Text, Group, Stack } from '@mantine/core'
import { Sparkles, Crown, Skull, User, Users } from 'lucide-react'
import type { Character } from '@/lib/types/database'

interface CharacterCardProps {
  character: Character
  index?: number
}

// Role configuration with colors, icons, and gradients
const roleConfig: Record<string, { 
  color: string
  icon: typeof User
  gradient: string
  label: string
}> = {
  protagonist: { 
    color: 'green', 
    icon: Crown, 
    gradient: 'from-emerald-400 to-cyan-400',
    label: 'Protagonist'
  },
  antagonist: { 
    color: 'red', 
    icon: Skull, 
    gradient: 'from-rose-400 to-orange-400',
    label: 'Antagonist'
  },
  supporting: { 
    color: 'blue', 
    icon: Users, 
    gradient: 'from-blue-400 to-indigo-400',
    label: 'Supporting'
  },
  background: { 
    color: 'gray', 
    icon: User, 
    gradient: 'from-slate-400 to-slate-500',
    label: 'Background'
  },
}

// Generate consistent color from string
function getAvatarGradient(name: string): string {
  const gradients = [
    'from-cyan-400 to-blue-500',
    'from-violet-400 to-purple-500',
    'from-rose-400 to-pink-500',
    'from-amber-400 to-orange-500',
    'from-emerald-400 to-teal-500',
    'from-fuchsia-400 to-pink-500',
    'from-sky-400 to-indigo-500',
  ]
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return gradients[hash % gradients.length]
}

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function CharacterCard({ character, index = 0 }: CharacterCardProps) {
  const config = roleConfig[character.role || 'background'] || roleConfig.background
  const RoleIcon = config.icon
  const gradient = character.role ? config.gradient : getAvatarGradient(character.name)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/characters/${character.id}`}>
        <Paper 
          p="lg" 
          radius="lg" 
          withBorder
          className="group cursor-pointer hover:border-cyan-400 dark:hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 dark:bg-slate-800 dark:border-slate-700 h-full"
        >
          {/* Profile Header */}
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className={`relative flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200`}>
              <span className="text-white font-bold text-xl drop-shadow-sm">
                {getInitials(character.name)}
              </span>
              {/* Role indicator badge */}
              {character.role && character.role !== 'background' && (
                <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-800 rounded-full shadow-md">
                  <RoleIcon className={`w-3 h-3 text-${config.color}-500`} />
                </div>
              )}
            </div>

            {/* Info */}
            <Stack gap="xs" className="flex-1 min-w-0">
              <div>
                <Text fw={600} size="lg" className="text-slate-900 dark:text-slate-100 truncate">
                  {character.name}
                </Text>
                <Group gap="xs" mt={4}>
                  {character.role && (
                    <Badge 
                      color={config.color} 
                      variant="light" 
                      size="sm"
                      leftSection={<RoleIcon className="w-3 h-3" />}
                    >
                      {config.label}
                    </Badge>
                  )}
                  {character.species && (
                    <Badge variant="outline" color="gray" size="sm">
                      {character.species}
                    </Badge>
                  )}
                </Group>
              </div>
            </Stack>
          </div>

          {/* Content Section */}
          <Stack gap="sm" mt="md">
            {/* Personality */}
            {character.personality && (
              <Text size="sm" c="dimmed" lineClamp={2}>
                {character.personality}
              </Text>
            )}

            {/* Story Context - The Lore Link */}
            {character.story_context && (
              <Paper 
                p="xs" 
                radius="sm" 
                className="bg-cyan-50 dark:bg-cyan-900/20 border-l-2 border-cyan-400"
              >
                <Group gap="xs" wrap="nowrap">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                  <Text size="xs" c="cyan.7" className="dark:text-cyan-300" lineClamp={1}>
                    {character.story_context}
                  </Text>
                </Group>
              </Paper>
            )}

            {/* Aliases */}
            {character.aliases && character.aliases.length > 0 && (
              <Group gap="xs">
                <Text size="xs" c="dimmed">Also known as:</Text>
                {character.aliases.slice(0, 2).map((alias) => (
                  <Badge key={alias} variant="dot" color="gray" size="xs">
                    {alias}
                  </Badge>
                ))}
                {character.aliases.length > 2 && (
                  <Text size="xs" c="dimmed">+{character.aliases.length - 2}</Text>
                )}
              </Group>
            )}
          </Stack>
        </Paper>
      </Link>
    </motion.div>
  )
}
