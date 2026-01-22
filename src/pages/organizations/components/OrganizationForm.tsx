import { useState, useEffect } from 'react'
import { Modal, ModalFooter, FormField, Input, Textarea, Select, Button } from '@/components/ui'
import type { Organization } from '@/types/database'

interface OrganizationFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Organization>) => Promise<boolean>
  organization?: Organization | null
  loading?: boolean
}

const typeOptions = [
  { value: '', label: 'Select type...' },
  { value: 'government', label: 'Government' },
  { value: 'religion', label: 'Religion' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'guild', label: 'Guild' },
  { value: 'family', label: 'Family' },
  { value: 'military', label: 'Military' },
  { value: 'secret_society', label: 'Secret Society' },
]

const initialFormData = {
  name: '',
  type: '',
  purpose: '',
  structure: '',
  leadership: '',
  territory: '',
  resources: '',
  beliefs: '',
  symbols: '',
  history: '',
}

export function OrganizationForm({
  isOpen,
  onClose,
  onSave,
  organization,
  loading = false,
}: OrganizationFormProps) {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEdit = !!organization

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || '',
        type: organization.type || '',
        purpose: organization.purpose || '',
        structure: organization.structure || '',
        leadership: organization.leadership || '',
        territory: organization.territory || '',
        resources: organization.resources || '',
        beliefs: organization.beliefs || '',
        symbols: organization.symbols || '',
        history: organization.history || '',
      })
    } else {
      setFormData(initialFormData)
    }
    setErrors({})
  }, [organization, isOpen])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    const data: Partial<Organization> = {
      name: formData.name.trim(),
      type: (formData.type || null) as Organization['type'],
      purpose: formData.purpose.trim() || null,
      structure: formData.structure.trim() || null,
      leadership: formData.leadership.trim() || null,
      territory: formData.territory.trim() || null,
      resources: formData.resources.trim() || null,
      beliefs: formData.beliefs.trim() || null,
      symbols: formData.symbols.trim() || null,
      history: formData.history.trim() || null,
    }

    const success = await onSave(data)
    if (success) {
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Organization' : 'New Organization'}
      size="lg"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 dark:text-white">Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Name" htmlFor="name" required error={errors.name}>
              <Input
                id="name"
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="Organization name"
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
          </div>
          <FormField label="Purpose" htmlFor="purpose">
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={e => handleChange('purpose', e.target.value)}
              placeholder="What is this organization's primary goal?"
              rows={2}
            />
          </FormField>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 dark:text-white">Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Structure" htmlFor="structure">
              <Textarea
                id="structure"
                value={formData.structure}
                onChange={e => handleChange('structure', e.target.value)}
                placeholder="How is it organized?"
                rows={2}
              />
            </FormField>
            <FormField label="Leadership" htmlFor="leadership">
              <Textarea
                id="leadership"
                value={formData.leadership}
                onChange={e => handleChange('leadership', e.target.value)}
                placeholder="Who leads it?"
                rows={2}
              />
            </FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Territory" htmlFor="territory">
              <Input
                id="territory"
                value={formData.territory}
                onChange={e => handleChange('territory', e.target.value)}
                placeholder="Areas of influence"
              />
            </FormField>
            <FormField label="Resources" htmlFor="resources">
              <Input
                id="resources"
                value={formData.resources}
                onChange={e => handleChange('resources', e.target.value)}
                placeholder="Wealth, power, assets"
              />
            </FormField>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 dark:text-white">Identity</h3>
          <FormField label="Beliefs" htmlFor="beliefs">
            <Textarea
              id="beliefs"
              value={formData.beliefs}
              onChange={e => handleChange('beliefs', e.target.value)}
              placeholder="Core beliefs and values"
              rows={2}
            />
          </FormField>
          <FormField label="Symbols" htmlFor="symbols">
            <Input
              id="symbols"
              value={formData.symbols}
              onChange={e => handleChange('symbols', e.target.value)}
              placeholder="Flags, emblems, colors"
            />
          </FormField>
          <FormField label="History" htmlFor="history">
            <Textarea
              id="history"
              value={formData.history}
              onChange={e => handleChange('history', e.target.value)}
              placeholder="How did this organization come to be?"
              rows={3}
            />
          </FormField>
        </div>
      </div>

      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} loading={loading}>
          {isEdit ? 'Save Changes' : 'Create Organization'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
