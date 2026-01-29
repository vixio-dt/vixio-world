'use client'

import { useState, useCallback } from 'react'
import { Button, Input, Textarea, Select } from '@/components/ui'
import { ContentBlocksEditor } from '@/components/content-blocks'
import type { Character, ContentBlock } from '@/lib/types/database'

interface CharacterFormProps {
  character?: Character
  worldId: string
  action: (formData: FormData) => Promise<{ error?: string } | void>
  submitLabel: string
}

const roleOptions = [
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
          defaultValue={character?.name}
          placeholder="Character name"
        />

        <Select
          id="role"
          name="role"
          label="Role"
          options={roleOptions}
          defaultValue={character?.role || ''}
        />

        <Input
          id="species"
          name="species"
          label="Species"
          defaultValue={character?.species || ''}
          placeholder="e.g., Human, Elf, Android"
        />
      </div>

      <Textarea
        id="appearance"
        name="appearance"
        label="Appearance"
        defaultValue={character?.appearance || ''}
        placeholder="Physical description, clothing, distinguishing features..."
      />

      <Textarea
        id="personality"
        name="personality"
        label="Personality"
        defaultValue={character?.personality || ''}
        placeholder="Traits, quirks, mannerisms..."
      />

      <Textarea
        id="background"
        name="background"
        label="Background"
        defaultValue={character?.background || ''}
        placeholder="History, origin, important events..."
      />

      <Textarea
        id="motivations"
        name="motivations"
        label="Motivations"
        defaultValue={character?.motivations || ''}
        placeholder="Goals, desires, fears..."
      />

      <Textarea
        id="arc_potential"
        name="arc_potential"
        label="Character Arc"
        defaultValue={character?.arc_potential || ''}
        placeholder="How might this character grow or change?"
      />

      <Textarea
        id="story_context"
        name="story_context"
        label="Story Context"
        defaultValue={character?.story_context || ''}
        placeholder="How does this character fit into your story? What role do they play narratively?"
      />

      <div className="border-t border-slate-200 pt-6">
        <ContentBlocksEditor
          initialBlocks={character?.content_blocks || []}
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
