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
import type { Story, ContentBlock } from '@/lib/types/database'

interface StoryFormProps {
  story?: Story
  worldId: string
  action: (formData: FormData) => Promise<{ error?: string } | void>
  submitLabel: string
}

const statusOptions = [
  { value: '', label: 'Select status...' },
  { value: 'concept', label: 'Concept' },
  { value: 'outline', label: 'Outline' },
  { value: 'draft', label: 'Draft' },
  { value: 'complete', label: 'Complete' },
]

export function StoryForm({ story, worldId, action, submitLabel }: StoryFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(
    story?.content_blocks || []
  )
  const [status, setStatus] = useState(story?.status || '')

  const handleContentBlocksChange = useCallback((blocks: ContentBlock[]) => {
    setContentBlocks(blocks)
  }, [])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    formData.set('content_blocks', JSON.stringify(contentBlocks))
    formData.set('status', status)
    
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
                name="title"
                label="Title"
                required
                withAsterisk
                defaultValue={story?.title}
                placeholder="Story title"
                size="md"
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Status"
                data={statusOptions}
                value={status}
                onChange={(value) => setStatus(value || '')}
                placeholder="Select status"
                size="md"
                clearable
              />
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Logline Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <Title order={4} mb="xs" className="text-slate-900 dark:text-slate-100">
            Logline
          </Title>
          <Text size="sm" c="dimmed" mb="md">
            A compelling one-sentence summary of your story
          </Text>
          
          <Textarea
            name="logline"
            defaultValue={story?.logline || ''}
            placeholder="A one-sentence summary of your story..."
            minRows={2}
            autosize
            maxRows={4}
            size="md"
          />
        </Paper>

        {/* Genre & Tone Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <Title order={4} mb="md" className="text-slate-900 dark:text-slate-100">
            Genre & Tone
          </Title>
          
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                name="genre"
                label="Genre"
                defaultValue={story?.genre || ''}
                placeholder="e.g., Fantasy, Sci-Fi, Drama"
                size="md"
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                name="tone"
                label="Tone"
                defaultValue={story?.tone || ''}
                placeholder="e.g., Dark, Comedic, Epic"
                size="md"
              />
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Theme Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <Title order={4} mb="md" className="text-slate-900 dark:text-slate-100">
            Theme
          </Title>
          
          <Textarea
            name="theme"
            label="Theme"
            defaultValue={story?.theme || ''}
            placeholder="Central themes and messages..."
            minRows={3}
            autosize
            maxRows={6}
            size="md"
          />
        </Paper>

        {/* Story Context Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <Title order={4} mb="xs" className="text-slate-900 dark:text-slate-100">
            Story Context
          </Title>
          <Text size="sm" c="dimmed" mb="md">
            The Lore Link - How does this story fit into your world?
          </Text>
          
          <Textarea
            name="story_context"
            defaultValue={story?.story_context || ''}
            placeholder="How does this story fit into your world?"
            minRows={4}
            autosize
            maxRows={8}
            size="md"
          />
        </Paper>

        {/* Content Blocks Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <ContentBlocksEditor
            initialBlocks={story?.content_blocks || []}
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
