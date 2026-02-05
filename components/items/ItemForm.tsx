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
import type { Item, ContentBlock } from '@/lib/types/database'

interface ItemFormProps {
  item?: Item
  worldId: string
  action: (formData: FormData) => Promise<{ error?: string } | void>
  submitLabel: string
}

const typeOptions = [
  { value: '', label: 'Select type...' },
  { value: 'weapon', label: 'Weapon' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'artifact', label: 'Artifact' },
  { value: 'tool', label: 'Tool' },
  { value: 'document', label: 'Document' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'technology', label: 'Technology' },
]

export function ItemForm({ item, worldId, action, submitLabel }: ItemFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(
    item?.content_blocks || []
  )
  const [type, setType] = useState(item?.type || '')

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
                defaultValue={item?.name}
                placeholder="Item name"
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
          
          <Stack gap="md">
            <Textarea
              name="description"
              label="Description"
              defaultValue={item?.description || ''}
              placeholder="What is this item? Describe its appearance..."
              minRows={3}
              autosize
              maxRows={6}
              size="md"
            />

            <Textarea
              name="function"
              label="Function"
              defaultValue={item?.function || ''}
              placeholder="What does it do? How is it used?"
              minRows={3}
              autosize
              maxRows={6}
              size="md"
            />
          </Stack>
        </Paper>

        {/* Origin & Significance Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <Title order={4} mb="md" className="text-slate-900 dark:text-slate-100">
            Origin & Significance
          </Title>
          
          <Stack gap="md">
            <Textarea
              name="origin"
              label="Origin"
              defaultValue={item?.origin || ''}
              placeholder="Where did it come from? Who created it?"
              minRows={3}
              autosize
              maxRows={6}
              size="md"
            />

            <Textarea
              name="significance"
              label="Significance"
              defaultValue={item?.significance || ''}
              placeholder="Why does it matter? Historical or cultural importance..."
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
            The Lore Link - How does this item fit into your narrative?
          </Text>
          
          <Textarea
            name="story_context"
            defaultValue={item?.story_context || ''}
            placeholder="How does this item serve your story? What role does it play?"
            minRows={4}
            autosize
            maxRows={8}
            size="md"
          />
        </Paper>

        {/* Content Blocks Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <ContentBlocksEditor
            initialBlocks={item?.content_blocks || []}
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
