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
import type { Organization, ContentBlock } from '@/lib/types/database'

interface OrganizationFormProps {
  organization?: Organization
  worldId: string
  action: (formData: FormData) => Promise<{ error?: string } | void>
  submitLabel: string
}

const typeOptions = [
  { value: '', label: 'Select type...' },
  { value: 'government', label: 'Government' },
  { value: 'religion', label: 'Religion' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'guild', label: 'Guild' },
  { value: 'family', label: 'Family' },
  { value: 'military', label: 'Military' },
  { value: 'secret_society', label: 'Secret Society' },
]

export function OrganizationForm({ organization, worldId, action, submitLabel }: OrganizationFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(
    organization?.content_blocks || []
  )
  const [type, setType] = useState(organization?.type || '')

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
                defaultValue={organization?.name}
                placeholder="Organization name"
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

        {/* Purpose & Structure Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <Title order={4} mb="md" className="text-slate-900 dark:text-slate-100">
            Purpose & Structure
          </Title>
          
          <Stack gap="md">
            <Textarea
              name="purpose"
              label="Purpose"
              defaultValue={organization?.purpose || ''}
              placeholder="What is this organization's mission or goal?"
              minRows={3}
              autosize
              maxRows={6}
              size="md"
            />

            <Textarea
              name="structure"
              label="Structure"
              defaultValue={organization?.structure || ''}
              placeholder="How is it organized? Hierarchy, roles..."
              minRows={3}
              autosize
              maxRows={6}
              size="md"
            />

            <Textarea
              name="leadership"
              label="Leadership"
              defaultValue={organization?.leadership || ''}
              placeholder="Who leads it? Key figures..."
              minRows={3}
              autosize
              maxRows={6}
              size="md"
            />
          </Stack>
        </Paper>

        {/* Beliefs & History Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <Title order={4} mb="md" className="text-slate-900 dark:text-slate-100">
            Beliefs & History
          </Title>
          
          <Stack gap="md">
            <Textarea
              name="beliefs"
              label="Beliefs & Values"
              defaultValue={organization?.beliefs || ''}
              placeholder="Core beliefs, ideology, values..."
              minRows={3}
              autosize
              maxRows={6}
              size="md"
            />

            <Textarea
              name="history"
              label="History"
              defaultValue={organization?.history || ''}
              placeholder="Origins, key events, evolution..."
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
            The Lore Link - How does this organization fit into your narrative?
          </Text>
          
          <Textarea
            name="story_context"
            defaultValue={organization?.story_context || ''}
            placeholder="How does this organization serve your story?"
            minRows={4}
            autosize
            maxRows={8}
            size="md"
          />
        </Paper>

        {/* Content Blocks Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <ContentBlocksEditor
            initialBlocks={organization?.content_blocks || []}
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
