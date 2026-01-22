import { useState, useEffect } from 'react'
import { Modal, ModalFooter, FormField, Input, Textarea, Select, Button } from '@/components/ui'
import type { Story } from '@/types/database'

interface StoryFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Story>) => Promise<boolean>
  story?: Story | null
  loading?: boolean
}

const statusOptions = [
  { value: '', label: 'Select status...' },
  { value: 'concept', label: 'Concept' },
  { value: 'outline', label: 'Outline' },
  { value: 'draft', label: 'Draft' },
  { value: 'complete', label: 'Complete' },
]

const initialFormData = {
  title: '',
  logline: '',
  genre: '',
  tone: '',
  theme: '',
  status: '',
}

export function StoryForm({ isOpen, onClose, onSave, story, loading = false }: StoryFormProps) {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = !!story

  useEffect(() => {
    if (story) {
      setFormData({
        title: story.title || '',
        logline: story.logline || '',
        genre: story.genre || '',
        tone: story.tone || '',
        theme: story.theme || '',
        status: story.status || '',
      })
    } else {
      setFormData(initialFormData)
    }
    setErrors({})
  }, [story, isOpen])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    const data: Partial<Story> = {
      title: formData.title.trim(),
      logline: formData.logline.trim() || null,
      genre: formData.genre.trim() || null,
      tone: formData.tone.trim() || null,
      theme: formData.theme.trim() || null,
      status: (formData.status || null) as Story['status'],
    }
    const success = await onSave(data)
    if (success) onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Story' : 'New Story'} size="lg">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Title" htmlFor="title" required error={errors.title} className="md:col-span-2">
              <Input id="title" value={formData.title} onChange={e => handleChange('title', e.target.value)} placeholder="Story title" error={!!errors.title} />
            </FormField>
            <FormField label="Genre" htmlFor="genre">
              <Input id="genre" value={formData.genre} onChange={e => handleChange('genre', e.target.value)} placeholder="Sci-Fi, Fantasy, Drama..." />
            </FormField>
            <FormField label="Status" htmlFor="status">
              <Select id="status" options={statusOptions} value={formData.status} onChange={e => handleChange('status', e.target.value)} />
            </FormField>
          </div>
          <FormField label="Logline" htmlFor="logline">
            <Textarea id="logline" value={formData.logline} onChange={e => handleChange('logline', e.target.value)} placeholder="One-sentence summary" rows={2} />
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Tone" htmlFor="tone">
              <Input id="tone" value={formData.tone} onChange={e => handleChange('tone', e.target.value)} placeholder="Dark, hopeful, comedic..." />
            </FormField>
            <FormField label="Theme" htmlFor="theme">
              <Input id="theme" value={formData.theme} onChange={e => handleChange('theme', e.target.value)} placeholder="Central theme" />
            </FormField>
          </div>
        </div>
      </div>

      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} loading={loading}>{isEdit ? 'Save Changes' : 'Create Story'}</Button>
      </ModalFooter>
    </Modal>
  )
}
