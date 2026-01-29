'use client'

import { useState, useCallback } from 'react'
import { Button, Input, Textarea, Select } from '@/components/ui'
import { ContentBlocksEditor } from '@/components/content-blocks'
import type { Story, ContentBlock } from '@/lib/types/database'

interface StoryFormProps {
  story?: Story
  worldId: string
  action: (formData: FormData) => Promise<{ error?: string } | void>
  submitLabel: string
}

const statusOptions = [
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
          id="title"
          name="title"
          label="Title"
          required
          defaultValue={story?.title}
          placeholder="Story title"
        />

        <Select
          id="status"
          name="status"
          label="Status"
          options={statusOptions}
          defaultValue={story?.status || ''}
        />
      </div>

      <Textarea
        id="logline"
        name="logline"
        label="Logline"
        defaultValue={story?.logline || ''}
        placeholder="A one-sentence summary of your story..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          id="genre"
          name="genre"
          label="Genre"
          defaultValue={story?.genre || ''}
          placeholder="e.g., Fantasy, Sci-Fi, Drama"
        />

        <Input
          id="tone"
          name="tone"
          label="Tone"
          defaultValue={story?.tone || ''}
          placeholder="e.g., Dark, Comedic, Epic"
        />
      </div>

      <Textarea
        id="theme"
        name="theme"
        label="Theme"
        defaultValue={story?.theme || ''}
        placeholder="Central themes and messages..."
      />

      <Textarea
        id="story_context"
        name="story_context"
        label="Story Context"
        defaultValue={story?.story_context || ''}
        placeholder="How does this story fit into your world?"
      />

      <div className="border-t border-slate-200 pt-6">
        <ContentBlocksEditor
          initialBlocks={story?.content_blocks || []}
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
