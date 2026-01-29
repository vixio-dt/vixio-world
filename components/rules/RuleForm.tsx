'use client'

import { useState, useCallback } from 'react'
import { Button, Input, Textarea, Select } from '@/components/ui'
import { ContentBlocksEditor } from '@/components/content-blocks'
import type { Rule, ContentBlock } from '@/lib/types/database'

interface RuleFormProps {
  rule?: Rule
  worldId: string
  action: (formData: FormData) => Promise<{ error?: string } | void>
  submitLabel: string
}

const categoryOptions = [
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

  const handleContentBlocksChange = useCallback((blocks: ContentBlock[]) => {
    setContentBlocks(blocks)
  }, [])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    formData.set('content_blocks', JSON.stringify(contentBlocks))
    
    const result = await action(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="world_id" value={worldId} />
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          id="name"
          name="name"
          label="Name"
          required
          defaultValue={rule?.name}
          placeholder="Rule name"
        />

        <Select
          id="category"
          name="category"
          label="Category"
          options={categoryOptions}
          defaultValue={rule?.category || ''}
        />
      </div>

      <Textarea
        id="statement"
        name="statement"
        label="Statement"
        defaultValue={rule?.statement || ''}
        placeholder="The core rule statement..."
      />

      <Textarea
        id="scope"
        name="scope"
        label="Scope"
        defaultValue={rule?.scope || ''}
        placeholder="Where and when does this rule apply?"
      />

      <Textarea
        id="exceptions"
        name="exceptions"
        label="Exceptions"
        defaultValue={rule?.exceptions || ''}
        placeholder="What are the exceptions to this rule?"
      />

      <Textarea
        id="consequences"
        name="consequences"
        label="Consequences"
        defaultValue={rule?.consequences || ''}
        placeholder="What happens when this rule is followed or broken?"
      />

      <Textarea
        id="examples"
        name="examples"
        label="Examples"
        defaultValue={rule?.examples || ''}
        placeholder="Examples of this rule in action..."
      />

      <Textarea
        id="story_context"
        name="story_context"
        label="Story Context"
        defaultValue={rule?.story_context || ''}
        placeholder="How does this rule serve your story?"
      />

      <div className="border-t border-slate-200 pt-6">
        <ContentBlocksEditor
          initialBlocks={rule?.content_blocks || []}
          onChange={handleContentBlocksChange}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
