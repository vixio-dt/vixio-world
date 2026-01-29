'use client'

import { useState, useCallback } from 'react'
import { Button, Input, Textarea, Select } from '@/components/ui'
import { ContentBlocksEditor } from '@/components/content-blocks'
import type { Organization, ContentBlock } from '@/lib/types/database'

interface OrganizationFormProps {
  organization?: Organization
  worldId: string
  action: (formData: FormData) => Promise<{ error?: string } | void>
  submitLabel: string
}

const typeOptions = [
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
          defaultValue={organization?.name}
          placeholder="Organization name"
        />

        <Select
          id="type"
          name="type"
          label="Type"
          options={typeOptions}
          defaultValue={organization?.type || ''}
        />
      </div>

      <Textarea
        id="purpose"
        name="purpose"
        label="Purpose"
        defaultValue={organization?.purpose || ''}
        placeholder="What is this organization's mission or goal?"
      />

      <Textarea
        id="structure"
        name="structure"
        label="Structure"
        defaultValue={organization?.structure || ''}
        placeholder="How is it organized? Hierarchy, roles..."
      />

      <Textarea
        id="leadership"
        name="leadership"
        label="Leadership"
        defaultValue={organization?.leadership || ''}
        placeholder="Who leads it? Key figures..."
      />

      <Textarea
        id="beliefs"
        name="beliefs"
        label="Beliefs & Values"
        defaultValue={organization?.beliefs || ''}
        placeholder="Core beliefs, ideology, values..."
      />

      <Textarea
        id="history"
        name="history"
        label="History"
        defaultValue={organization?.history || ''}
        placeholder="Origins, key events, evolution..."
      />

      <Textarea
        id="story_context"
        name="story_context"
        label="Story Context"
        defaultValue={organization?.story_context || ''}
        placeholder="How does this organization serve your story?"
      />

      <div className="border-t border-slate-200 pt-6">
        <ContentBlocksEditor
          initialBlocks={organization?.content_blocks || []}
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
