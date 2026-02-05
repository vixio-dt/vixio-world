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
import type { Location, ContentBlock } from '@/lib/types/database'

interface LocationFormProps {
  location?: Location
  worldId: string
  action: (formData: FormData) => Promise<{ error?: string } | void>
  submitLabel: string
}

const typeOptions = [
  { value: '', label: 'Select type...' },
  { value: 'planet', label: 'Planet' },
  { value: 'continent', label: 'Continent' },
  { value: 'country', label: 'Country' },
  { value: 'city', label: 'City' },
  { value: 'district', label: 'District' },
  { value: 'building', label: 'Building' },
  { value: 'room', label: 'Room' },
]

export function LocationForm({ location, worldId, action, submitLabel }: LocationFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(
    location?.content_blocks || []
  )
  const [type, setType] = useState(location?.type || '')

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
                defaultValue={location?.name}
                placeholder="Location name"
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
          </Grid>
        </Paper>

        {/* Description Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <Title order={4} mb="md" className="text-slate-900 dark:text-slate-100">
            Description
          </Title>
          
          <Textarea
            name="description"
            label="Description"
            defaultValue={location?.description || ''}
            placeholder="What is this place? Describe its appearance..."
            minRows={4}
            autosize
            maxRows={8}
            size="md"
          />
        </Paper>

        {/* Atmosphere & Climate Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <Title order={4} mb="md" className="text-slate-900 dark:text-slate-100">
            Atmosphere & Environment
          </Title>
          
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Textarea
                name="atmosphere"
                label="Atmosphere"
                defaultValue={location?.atmosphere || ''}
                placeholder="The mood and feeling of this place..."
                minRows={3}
                autosize
                maxRows={6}
                size="md"
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Textarea
                name="climate"
                label="Climate"
                defaultValue={location?.climate || ''}
                placeholder="Weather, temperature, seasons..."
                minRows={3}
                autosize
                maxRows={6}
                size="md"
              />
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Features & History Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <Title order={4} mb="md" className="text-slate-900 dark:text-slate-100">
            Features & History
          </Title>
          
          <Stack gap="md">
            <Textarea
              name="key_features"
              label="Key Features"
              defaultValue={location?.key_features || ''}
              placeholder="Distinctive landmarks, notable elements..."
              minRows={3}
              autosize
              maxRows={6}
              size="md"
            />

            <Textarea
              name="history"
              label="History"
              defaultValue={location?.history || ''}
              placeholder="Important events, how it came to be..."
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
            The Lore Link - How does this location fit into your narrative?
          </Text>
          
          <Textarea
            name="story_context"
            defaultValue={location?.story_context || ''}
            placeholder="How does this location serve your story? What scenes happen here?"
            minRows={4}
            autosize
            maxRows={8}
            size="md"
          />
        </Paper>

        {/* Content Blocks Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <ContentBlocksEditor
            initialBlocks={location?.content_blocks || []}
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
