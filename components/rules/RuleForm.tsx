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
import type { Rule, ContentBlock } from '@/lib/types/database'

interface RuleFormProps {
  rule?: Rule
  worldId: string
  action: (formData: FormData) => Promise<{ error?: string } | void>
  submitLabel: string
}

const categoryOptions = [
  { value: '', label: 'Select category...' },
  { value: 'physics', label: 'Physics' },
  { value: 'magic', label: 'Magic' },
  { value: 'technology', label: 'Technology' },
  { value: 'biology', label: 'Biology' },
  { value: 'social', label: 'Social' },
  { value: 'political', label: 'Political' },
  { value: 'economic', label: 'Economic' },
  { value: 'temporal', label: 'Temporal' },
  { value: 'cosmological', label: 'Cosmological' },
]

export function RuleForm({ rule, worldId, action, submitLabel }: RuleFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(
    rule?.content_blocks || []
  )
  const [category, setCategory] = useState(rule?.category || '')

  const handleContentBlocksChange = useCallback((blocks: ContentBlock[]) => {
    setContentBlocks(blocks)
  }, [])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    formData.set('content_blocks', JSON.stringify(contentBlocks))
    formData.set('category', category)
    
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
                defaultValue={rule?.name}
                placeholder="Rule name"
                size="md"
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Category"
                data={categoryOptions}
                value={category}
                onChange={(value) => setCategory(value || '')}
                placeholder="Select category"
                size="md"
                clearable
              />
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Rule Statement Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <Title order={4} mb="xs" className="text-slate-900 dark:text-slate-100">
            Rule Statement
          </Title>
          <Text size="sm" c="dimmed" mb="md">
            The core statement that defines this rule
          </Text>
          
          <Textarea
            name="statement"
            defaultValue={rule?.statement || ''}
            placeholder="The core rule statement..."
            minRows={3}
            autosize
            maxRows={6}
            size="md"
          />
        </Paper>

        {/* Scope & Application Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <Title order={4} mb="md" className="text-slate-900 dark:text-slate-100">
            Scope & Application
          </Title>
          
          <Stack gap="md">
            <Textarea
              name="scope"
              label="Scope"
              defaultValue={rule?.scope || ''}
              placeholder="Where and when does this rule apply?"
              minRows={3}
              autosize
              maxRows={6}
              size="md"
            />

            <Textarea
              name="exceptions"
              label="Exceptions"
              defaultValue={rule?.exceptions || ''}
              placeholder="What are the exceptions to this rule?"
              minRows={3}
              autosize
              maxRows={6}
              size="md"
            />
          </Stack>
        </Paper>

        {/* Consequences & Examples Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <Title order={4} mb="md" className="text-slate-900 dark:text-slate-100">
            Consequences & Examples
          </Title>
          
          <Stack gap="md">
            <Textarea
              name="consequences"
              label="Consequences"
              defaultValue={rule?.consequences || ''}
              placeholder="What happens when this rule is followed or broken?"
              minRows={3}
              autosize
              maxRows={6}
              size="md"
            />

            <Textarea
              name="examples"
              label="Examples"
              defaultValue={rule?.examples || ''}
              placeholder="Examples of this rule in action..."
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
            The Lore Link - How does this rule fit into your narrative?
          </Text>
          
          <Textarea
            name="story_context"
            defaultValue={rule?.story_context || ''}
            placeholder="How does this rule serve your story?"
            minRows={4}
            autosize
            maxRows={8}
            size="md"
          />
        </Paper>

        {/* Content Blocks Section */}
        <Paper p="lg" radius="md" withBorder className="dark:bg-slate-800 dark:border-slate-700">
          <ContentBlocksEditor
            initialBlocks={rule?.content_blocks || []}
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
