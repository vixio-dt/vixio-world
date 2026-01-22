import { useState, useEffect } from 'react'
import { Modal, ModalFooter, FormField, Input, Textarea, Select, Button } from '@/components/ui'
import type { WorldEvent } from '@/types/database'

interface EventFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<WorldEvent>) => Promise<boolean>
  event?: WorldEvent | null
  loading?: boolean
}

const typeOptions = [
  { value: '', label: 'Select type...' },
  { value: 'historical', label: 'Historical' },
  { value: 'plot_point', label: 'Plot Point' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'recurring', label: 'Recurring' },
]

const initialFormData = {
  name: '',
  date: '',
  date_sort: '',
  type: '',
  description: '',
  causes: '',
  consequences: '',
}

export function EventForm({ isOpen, onClose, onSave, event, loading = false }: EventFormProps) {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEdit = !!event

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || '',
        date: event.date || '',
        date_sort: event.date_sort?.toString() || '',
        type: event.type || '',
        description: event.description || '',
        causes: event.causes || '',
        consequences: event.consequences || '',
      })
    } else {
      setFormData(initialFormData)
    }
    setErrors({})
  }, [event, isOpen])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    const data: Partial<WorldEvent> = {
      name: formData.name.trim(),
      date: formData.date.trim() || null,
      date_sort: formData.date_sort ? parseInt(formData.date_sort, 10) : null,
      type: (formData.type || null) as WorldEvent['type'],
      description: formData.description.trim() || null,
      causes: formData.causes.trim() || null,
      consequences: formData.consequences.trim() || null,
    }

    const success = await onSave(data)
    if (success) onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Event' : 'New Event'} size="lg">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 dark:text-white">Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Name" htmlFor="name" required error={errors.name}>
              <Input
                id="name"
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="Event name"
                error={!!errors.name}
              />
            </FormField>
            <FormField label="Type" htmlFor="type">
              <Select
                id="type"
                options={typeOptions}
                value={formData.type}
                onChange={e => handleChange('type', e.target.value)}
              />
            </FormField>
            <FormField label="Date (Display)" htmlFor="date" hint="e.g., 'Year 1023' or 'The Great Winter'">
              <Input
                id="date"
                value={formData.date}
                onChange={e => handleChange('date', e.target.value)}
                placeholder="In-world date"
              />
            </FormField>
            <FormField label="Sort Order" htmlFor="date_sort" hint="Numeric value for timeline ordering">
              <Input
                id="date_sort"
                type="number"
                value={formData.date_sort}
                onChange={e => handleChange('date_sort', e.target.value)}
                placeholder="1023"
              />
            </FormField>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 dark:text-white">Details</h3>
          <FormField label="Description" htmlFor="description">
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="What happened?"
              rows={3}
            />
          </FormField>
          <FormField label="Causes" htmlFor="causes">
            <Textarea
              id="causes"
              value={formData.causes}
              onChange={e => handleChange('causes', e.target.value)}
              placeholder="What led to this event?"
              rows={2}
            />
          </FormField>
          <FormField label="Consequences" htmlFor="consequences">
            <Textarea
              id="consequences"
              value={formData.consequences}
              onChange={e => handleChange('consequences', e.target.value)}
              placeholder="What were the results?"
              rows={2}
            />
          </FormField>
        </div>
      </div>

      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} loading={loading}>
          {isEdit ? 'Save Changes' : 'Create Event'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
