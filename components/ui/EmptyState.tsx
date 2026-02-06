'use client'

import { Stack, Text, ThemeIcon, Button } from '@mantine/core'
import { type LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Stack align="center" justify="center" py="xl" px="md" gap="md">
      <ThemeIcon size={64} radius="xl" variant="light" color="gray">
        <Icon size={28} />
      </ThemeIcon>

      <Stack align="center" gap={4}>
        <Text fw={600} size="lg">{title}</Text>
        <Text size="sm" c="dimmed" maw={360} ta="center">{description}</Text>
      </Stack>

      {action && (
        action.href ? (
          <Button component={Link} href={action.href}>
            {action.label}
          </Button>
        ) : (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )
      )}
    </Stack>
  )
}
