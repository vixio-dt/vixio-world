import { useState, useEffect } from 'react'
import { Modal, ModalFooter, FormField, Input, Textarea, Select, Button } from '@/components/ui'
import type { Item } from '@/types/database'

interface ItemFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Item>) => Promise<boolean>
  item?: Item | null
  loading?: boolean
}

const typeOptions = [
  { value: '', label: 'Select type...' },
  { value: 'weapon', label: 'Weapon' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'artifact', label: 'Artifact' },
  { value: 'tool', label: 'Tool' },
  { value: 'document', label: 'Document' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'technology', label: 'Technology' },
]

const initialFormData = {
  name: '',
  type: '',
  description: '',
  function: '',
  origin: '',
  significance: '',
  rules: '',
  visual_references: '',
  scale: '',
  material_notes: '',
}

export function ItemForm({ isOpen, onClose, onSave, item, loading = false }: ItemFormProps) {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = !!item

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        type: item.type || '',
        description: item.description || '',
        function: item.function || '',
        origin: item.origin || '',
        significance: item.significance || '',
        rules: item.rules || '',
        visual_references: item.visual_references || '',
        scale: item.scale || '',
        material_notes: item.material_notes || '',
      })
    } else {
      setFormData(initialFormData)
    }
    setErrors({})
  }, [item, isOpen])

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
    const data: Partial<Item> = {
      name: formData.name.trim(),
      type: (formData.type || null) as Item['type'],
      description: formData.description.trim() || null,
      function: formData.function.trim() || null,
      origin: formData.origin.trim() || null,
      significance: formData.significance.trim() || null,
      rules: formData.rules.trim() || null,
      visual_references: formData.visual_references.trim() || null,
      scale: formData.scale.trim() || null,
      material_notes: formData.material_notes.trim() || null,
    }
    const success = await onSave(data)
    if (success) onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Item' : 'New Item'} size="lg">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 dark:text-white">Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Name" htmlFor="name" required error={errors.name}>
              <Input id="name" value={formData.name} onChange={e => handleChange('name', e.target.value)} error={!!errors.name} />
            </FormField>
            <FormField label="Type" htmlFor="type">
              <Select id="type" options={typeOptions} value={formData.type} onChange={e => handleChange('type', e.target.value)} />
            </FormField>
          </div>
          <FormField label="Description" htmlFor="description">
            <Textarea id="description" value={formData.description} onChange={e => handleChange('description', e.target.value)} rows={3} />
          </FormField>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 dark:text-white">Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Function" htmlFor="function">
              <Textarea id="function" value={formData.function} onChange={e => handleChange('function', e.target.value)} placeholder="What does it do?" rows={2} />
            </FormField>
            <FormField label="Origin" htmlFor="origin">
              <Textarea id="origin" value={formData.origin} onChange={e => handleChange('origin', e.target.value)} placeholder="Where did it come from?" rows={2} />
            </FormField>
          </div>
          <FormField label="Significance" htmlFor="significance">
            <Textarea id="significance" value={formData.significance} onChange={e => handleChange('significance', e.target.value)} placeholder="Why is it important?" rows={2} />
          </FormField>
          <FormField label="Rules" htmlFor="rules" hint="For magical or special items">
            <Textarea id="rules" value={formData.rules} onChange={e => handleChange('rules', e.target.value)} placeholder="What it can/cannot do" rows={2} />
          </FormField>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 dark:text-white">Production</h3>
          <FormField label="Visual References" htmlFor="visual_references">
            <Textarea id="visual_references" value={formData.visual_references} onChange={e => handleChange('visual_references', e.target.value)} rows={2} />
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Scale" htmlFor="scale">
              <Input id="scale" value={formData.scale} onChange={e => handleChange('scale', e.target.value)} placeholder="Size, dimensions" />
            </FormField>
            <FormField label="Material Notes" htmlFor="material_notes">
              <Input id="material_notes" value={formData.material_notes} onChange={e => handleChange('material_notes', e.target.value)} />
            </FormField>
          </div>
        </div>
      </div>

      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} loading={loading}>{isEdit ? 'Save Changes' : 'Create Item'}</Button>
      </ModalFooter>
    </Modal>
  )
}
