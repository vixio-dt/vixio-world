'use client'

import { useState, useCallback } from 'react'
import { 
  TextInput, 
  Textarea, 
  Select, 
  Button, 
  Stack, 
  Grid, 
  Alert,
  Paper,
  Title,
  Text,
  Group,
  Divider
} from '@mantine/core'
import { AlertCircle } from 'lucide-react'
import { ContentBlocksEditor } from '@/components/content-blocks'
import type { WorldEvent, ContentBlock } from '@/lib/types/database'

interface EventFormProps {
  event?: WorldEvent
  worldId: string
  action: (formData: FormData) => Promise<{ error?: string } | void>
  submitLabel: string
}

const typeOptions = [
  { value: '', label: 'Select type...' },
  { value: 'historical', label: 'Historical' },
  { value: 'plot_point', label: 'Plot Point' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'recurring', label: 'Recurring' },
]

export function EventForm({ event, worldId, action, submitLabel }: EventFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(
    event?.content_blocks || []
  )
  const [type, setType] = useState(event?.type || '')

  const handleContentBlocksChange = useCallback((blocks: ContentBlock[]) => {
    setContentBlocks(blocks)
  }, [])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    formData.set('content_blocks', JSON.stringify(contentBlocks))
    formData.set('type', type)
    
    const result = await action(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit}>
      <input type="hidden" name="world_id" value={worldId} />
      
      <Stack gap="lg">
        {error && (
          <Alert 
            icon={<AlertCircle size={16} />} 
            title="Error" 
            color="red"
            variant="light"
          >
            {error}
          </Alert>
        )}

        {/* Basic Info Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <Title order={4} mb="md" className="text-slate-900 dark:text-slate-100">
            Basic Information
          </Title>
          
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                name="name"
                label="Name"
                required
                withAsterisk
                defaultValue={event?.name}
                placeholder="Event name"
                size="md"
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Type"
                data={typeOptions}
                value={type}
                onChange={(value) => setType(value || '')}
                placeholder="Select type"
                size="md"
                clearable
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                name="date"
                label="Date"
                defaultValue={event?.date || ''}
                placeholder="e.g., Year 1024, Third Age"
                size="md"
              />
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Description Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <Title order={4} mb="md" className="text-slate-900 dark:text-slate-100">
            What Happened
          </Title>
          
          <Textarea
            name="description"
            label="Description"
            defaultValue={event?.description || ''}
            placeholder="What happened?"
            minRows={4}
            autosize
            maxRows={8}
            size="md"
          />
        </Paper>

        {/* Causes & Consequences Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <Title order={4} mb="md" className="text-slate-900 dark:text-slate-100">
            Causes & Consequences
          </Title>
          
          <Stack gap="md">
            <Textarea
              name="causes"
              label="Causes"
              defaultValue={event?.causes || ''}
              placeholder="What led to this event?"
              minRows={3}
              autosize
              maxRows={6}
              size="md"
            />

            <Textarea
              name="consequences"
              label="Consequences"
              defaultValue={event?.consequences || ''}
              placeholder="What resulted from this event?"
              minRows={3}
              autosize
              maxRows={6}
              size="md"
            />
          </Stack>
        </Paper>

        {/* Story Context Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <Title order={4} mb="xs" className="text-slate-900 dark:text-slate-100">
            Story Context
          </Title>
          <Text size="sm" c="dimmed" mb="md">
            The Lore Link - How does this event fit into your narrative?
          </Text>
          
          <Textarea
            name="story_context"
            defaultValue={event?.story_context || ''}
            placeholder="How does this event serve your story?"
            minRows={4}
            autosize
            maxRows={8}
            size="md"
          />
        </Paper>

        {/* Content Blocks Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <ContentBlocksEditor
            initialBlocks={event?.content_blocks || []}
            onChange={handleContentBlocksChange}
            worldId={worldId}
          />
        </Paper>

        {/* Actions */}
        <Divider />
        
        <Group justify="flex-end" gap="md">
          <Button 
            variant="default" 
            onClick={() => window.history.back()}
            size="md"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            loading={loading}
            size="md"
            color="cyan"
          >
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
