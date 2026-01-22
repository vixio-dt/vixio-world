import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSupabaseCRUD } from '@/lib/hooks'
import { useToast } from '@/components/ui'
import { StoryList, StoryForm, StoryDetail } from './components'
import type { Story } from '@/types/database'

export function StoriesPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const { data: stories, loading, create, update, remove, getById } = useSupabaseCRUD<Story>({ table: 'stories' })

  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingStory, setEditingStory] = useState<Story | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    async function loadStory() {
      if (id) {
        const story = await getById(id)
        setSelectedStory(story)
      } else {
        setSelectedStory(null)
      }
    }
    loadStory()
  }, [id, getById])

  const handleSelect = (story: Story) => navigate(`/stories/${story.id}`)
  const handleCreateNew = () => { setEditingStory(null); setShowForm(true) }
  const handleEdit = () => { if (selectedStory) { setEditingStory(selectedStory); setShowForm(true) } }

  const handleSave = async (data: Partial<Story>): Promise<boolean> => {
    setFormLoading(true)
    try {
      if (editingStory) {
        const updated = await update(editingStory.id, data)
        if (updated) { setSelectedStory(updated); toast.success('Story updated successfully'); return true }
      } else {
        const created = await create(data as Omit<Story, 'id' | 'created_at' | 'updated_at'>)
        if (created) { toast.success('Story created successfully'); navigate(`/stories/${created.id}`); return true }
      }
      toast.error('Failed to save story'); return false
    } finally { setFormLoading(false) }
  }

  const handleDelete = async (): Promise<boolean> => {
    if (!selectedStory) return false
    const success = await remove(selectedStory.id)
    if (success) toast.success('Story deleted successfully')
    else toast.error('Failed to delete story')
    return success
  }

  if (selectedStory) {
    return (
      <>
        <StoryDetail story={selectedStory} onEdit={handleEdit} onDelete={handleDelete} />
        <StoryForm isOpen={showForm} onClose={() => setShowForm(false)} onSave={handleSave} story={editingStory} loading={formLoading} />
      </>
    )
  }

  if (id && !selectedStory) {
    return <div className="animate-pulse space-y-6"><div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" /><div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl" /></div>
  }

  return (
    <>
      <StoryList stories={stories} loading={loading} onSelect={handleSelect} onCreateNew={handleCreateNew} />
      <StoryForm isOpen={showForm} onClose={() => setShowForm(false)} onSave={handleSave} story={editingStory} loading={formLoading} />
    </>
  )
}
