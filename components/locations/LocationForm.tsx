'use client'

import { useState, useCallback } from 'react'
import { Button, Input, Textarea, Select } from '@/components/ui'
import { ContentBlocksEditor } from '@/components/content-blocks'
import type { Location, ContentBlock } from '@/lib/types/database'

interface LocationFormProps {
  location?: Location
  worldId: string
  action: (formData: FormData) => Promise<{ error?: string } | void>
  submitLabel: string
}

const typeOptions = [
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

  const handleContentBlocksChange = useCallback((blocks: ContentBlock[]) => {
    setContentBlocks(blocks)
  }, [])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    // Add content blocks as JSON
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
          defaultValue={location?.name}
          placeholder="Location name"
        />

        <Select
          id="type"
          name="type"
          label="Type"
          options={typeOptions}
          defaultValue={location?.type || ''}
        />
      </div>

      <Textarea
        id="description"
        name="description"
        label="Description"
        defaultValue={location?.description || ''}
        placeholder="What is this place? Describe its appearance..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Textarea
          id="atmosphere"
          name="atmosphere"
          label="Atmosphere"
          defaultValue={location?.atmosphere || ''}
          placeholder="The mood and feeling of this place..."
        />

        <Textarea
          id="climate"
          name="climate"
          label="Climate"
          defaultValue={location?.climate || ''}
          placeholder="Weather, temperature, seasons..."
        />
      </div>

      <Textarea
        id="key_features"
        name="key_features"
        label="Key Features"
        defaultValue={location?.key_features || ''}
        placeholder="Distinctive landmarks, notable elements..."
      />

      <Textarea
        id="history"
        name="history"
        label="History"
        defaultValue={location?.history || ''}
        placeholder="Important events, how it came to be..."
      />

      <Textarea
        id="story_context"
        name="story_context"
        label="Story Context"
        defaultValue={location?.story_context || ''}
        placeholder="How does this location serve your story? What scenes happen here?"
      />

      <div className="border-t border-slate-200 pt-6">
        <ContentBlocksEditor
          initialBlocks={location?.content_blocks || []}
          onChange={handleContentBlocksChange}
          worldId={worldId}
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
