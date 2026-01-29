'use client'

import { useState, useCallback } from 'react'
import { Button, Input, Textarea, Select } from '@/components/ui'
import { ContentBlocksEditor } from '@/components/content-blocks'
import type { WorldEvent, ContentBlock } from '@/lib/types/database'

interface EventFormProps {
  event?: WorldEvent
  worldId: string
  action: (formData: FormData) => Promise<{ error?: string } | void>
  submitLabel: string
}

const typeOptions = [
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
          defaultValue={event?.name}
          placeholder="Event name"
        />

        <Select
          id="type"
          name="type"
          label="Type"
          options={typeOptions}
          defaultValue={event?.type || ''}
        />

        <Input
          id="date"
          name="date"
          label="Date"
          defaultValue={event?.date || ''}
          placeholder="e.g., Year 1024, Third Age"
        />
      </div>

      <Textarea
        id="description"
        name="description"
        label="Description"
        defaultValue={event?.description || ''}
        placeholder="What happened?"
      />

      <Textarea
        id="causes"
        name="causes"
        label="Causes"
        defaultValue={event?.causes || ''}
        placeholder="What led to this event?"
      />

      <Textarea
        id="consequences"
        name="consequences"
        label="Consequences"
        defaultValue={event?.consequences || ''}
        placeholder="What resulted from this event?"
      />

      <Textarea
        id="story_context"
        name="story_context"
        label="Story Context"
        defaultValue={event?.story_context || ''}
        placeholder="How does this event serve your story?"
      />

      <div className="border-t border-slate-200 pt-6">
        <ContentBlocksEditor
          initialBlocks={event?.content_blocks || []}
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
