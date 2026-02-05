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
import type { Character, ContentBlock } from '@/lib/types/database'

interface CharacterFormProps {
  character?: Character
  worldId: string
  action: (formData: FormData) => Promise<{ error?: string } | void>
  submitLabel: string
}

const roleOptions = [
  { value: '', label: 'Select role...' },
  { value: 'protagonist', label: 'Protagonist' },
  { value: 'antagonist', label: 'Antagonist' },
  { value: 'supporting', label: 'Supporting' },
  { value: 'background', label: 'Background' },
]

export function CharacterForm({ character, worldId, action, submitLabel }: CharacterFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(
    character?.content_blocks || []
  )
  const [role, setRole] = useState(character?.role || '')

  const handleContentBlocksChange = useCallback((blocks: ContentBlock[]) => {
    setContentBlocks(blocks)
  }, [])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    // Add content blocks as JSON
    formData.set('content_blocks', JSON.stringify(contentBlocks))
    formData.set('role', role)
    
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
                defaultValue={character?.name}
                placeholder="Character name"
                size="md"
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Role"
                data={roleOptions}
                value={role}
                onChange={(value) => setRole(value || '')}
                placeholder="Select role"
                size="md"
                clearable
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                name="species"
                label="Species"
                defaultValue={character?.species || ''}
                placeholder="e.g., Human, Elf, Android"
                size="md"
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
              name="appearance"
              label="Appearance"
              defaultValue={character?.appearance || ''}
              placeholder="Physical description, clothing, distinguishing features..."
              minRows={3}
              autosize
              maxRows={6}
              size="md"
            />

            <Textarea
              name="personality"
              label="Personality"
              defaultValue={character?.personality || ''}
              placeholder="Traits, quirks, mannerisms..."
              minRows={3}
              autosize
              maxRows={6}
              size="md"
            />
          </Stack>
        </Paper>

        {/* Background Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <Title order={4} mb="md" className="text-slate-900 dark:text-slate-100">
            Background & Motivations
          </Title>
          
          <Stack gap="md">
            <Textarea
              name="background"
              label="Background"
              defaultValue={character?.background || ''}
              placeholder="History, origin, important events..."
              minRows={3}
              autosize
              maxRows={6}
              size="md"
            />

            <Textarea
              name="motivations"
              label="Motivations"
              defaultValue={character?.motivations || ''}
              placeholder="Goals, desires, fears..."
              minRows={3}
              autosize
              maxRows={6}
              size="md"
            />

            <Textarea
              name="arc_potential"
              label="Character Arc"
              defaultValue={character?.arc_potential || ''}
              placeholder="How might this character grow or change?"
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
            The Lore Link - How does this character fit into your narrative?
          </Text>
          
          <Textarea
            name="story_context"
            defaultValue={character?.story_context || ''}
            placeholder="How does this character fit into your story? What role do they play narratively?"
            minRows={4}
            autosize
            maxRows={8}
            size="md"
          />
        </Paper>

        {/* Content Blocks Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <ContentBlocksEditor
            initialBlocks={character?.content_blocks || []}
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
