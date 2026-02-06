'use client'

import { Paper, Box, Title, Text } from '@mantine/core'

type CardProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  return (
    <Paper
      withBorder
      shadow="xs"
      radius="md"
      p={0}
      className={className}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: CardProps) {
  return (
    <Box
      px="lg"
      py="md"
      style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
      className={className}
      {...props}
    />
  )
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Title
      order={3}
      size="lg"
      fw={600}
      className={className}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <Text
      size="sm"
      c="dimmed"
      className={className}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }: CardProps) {
  return (
    <Box
      px="lg"
      py="md"
      className={className}
      {...props}
    />
  )
}

export function CardFooter({ className, ...props }: CardProps) {
  return (
    <Box
      px="lg"
      py="md"
      bg="gray.0"
      style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}
      className={className}
      {...props}
    />
  )
}
