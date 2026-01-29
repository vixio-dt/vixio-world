'use client'

import { useState, useCallback } from 'react'
import { Button, Input, Textarea, Select } from '@/components/ui'
import { ContentBlocksEditor } from '@/components/content-blocks'
import type { Item, ContentBlock } from '@/lib/types/database'

interface ItemFormProps {
  item?: Item
  worldId: string
  action: (formData: FormData) => Promise<{ error?: string } | void>
  submitLabel: string
}

const typeOptions = [
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
          defaultValue={item?.name}
          placeholder="Item name"
        />

        <Select
          id="type"
          name="type"
          label="Type"
          options={typeOptions}
          defaultValue={item?.type || ''}
        />
      </div>

      <Textarea
        id="description"
        name="description"
        label="Description"
        defaultValue={item?.description || ''}
        placeholder="What is this item? Describe its appearance..."
      />

      <Textarea
        id="function"
        name="function"
        label="Function"
        defaultValue={item?.function || ''}
        placeholder="What does it do? How is it used?"
      />

      <Textarea
        id="origin"
        name="origin"
        label="Origin"
        defaultValue={item?.origin || ''}
        placeholder="Where did it come from? Who created it?"
      />

      <Textarea
        id="significance"
        name="significance"
        label="Significance"
        defaultValue={item?.significance || ''}
        placeholder="Why does it matter? Historical or cultural importance..."
      />

      <Textarea
        id="story_context"
        name="story_context"
        label="Story Context"
        defaultValue={item?.story_context || ''}
        placeholder="How does this item serve your story? What role does it play?"
      />

      <div className="border-t border-slate-200 pt-6">
        <ContentBlocksEditor
          initialBlocks={item?.content_blocks || []}
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
