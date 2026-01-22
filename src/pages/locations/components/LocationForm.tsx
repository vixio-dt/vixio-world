import { useState, useEffect, useMemo } from 'react'
import { Modal, ModalFooter, FormField, Input, Textarea, Select, Button } from '@/components/ui'
import type { Location } from '@/types/database'

interface LocationFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Location>) => Promise<boolean>
  location?: Location | null
  allLocations: Location[]
  loading?: boolean
}

const typeOptions = [
  { value: '', label: 'Select type...' },
  { value: 'planet', label: 'Planet' },
  { value: 'continent', label: 'Continent' },
  { value: 'country', label: 'Country' },
  { value: 'city', label: 'City' },
  { value: 'district', label: 'District' },
  { value: 'building', label: 'Building' },
  { value: 'room', label: 'Room' },
]

const initialFormData = {
  name: '',
  parent_location_id: '',
  type: '',
  description: '',
  atmosphere: '',
  climate: '',
  key_features: '',
  history: '',
  cultural_significance: '',
  visual_references: '',
  lighting_notes: '',
  sound_notes: '',
  asset_requirements: '',
}

export function LocationForm({
  isOpen,
  onClose,
  onSave,
  location,
  allLocations,
  loading = false,
}: LocationFormProps) {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEdit = !!location

  // Build parent options, excluding self and descendants
  const parentOptions = useMemo(() => {
    const options = [{ value: '', label: 'None (Top Level)' }]

    if (!location) {
      // Creating new - all locations are valid parents
      allLocations.forEach(loc => {
        options.push({ value: loc.id, label: loc.name })
      })
    } else {
      // Editing - exclude self and descendants
      const descendants = new Set<string>()
      const findDescendants = (id: string) => {
        descendants.add(id)
        allLocations.forEach(loc => {
          if (loc.parent_location_id === id) {
            findDescendants(loc.id)
          }
        })
      }
      findDescendants(location.id)

      allLocations.forEach(loc => {
        if (!descendants.has(loc.id)) {
          options.push({ value: loc.id, label: loc.name })
        }
      })
    }

    return options
  }, [allLocations, location])

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name || '',
        parent_location_id: location.parent_location_id || '',
        type: location.type || '',
        description: location.description || '',
        atmosphere: location.atmosphere || '',
        climate: location.climate || '',
        key_features: location.key_features || '',
        history: location.history || '',
        cultural_significance: location.cultural_significance || '',
        visual_references: location.visual_references || '',
        lighting_notes: location.lighting_notes || '',
        sound_notes: location.sound_notes || '',
        asset_requirements: location.asset_requirements || '',
      })
    } else {
      setFormData(initialFormData)
    }
    setErrors({})
  }, [location, isOpen])

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

    const data: Partial<Location> = {
      name: formData.name.trim(),
      parent_location_id: formData.parent_location_id || null,
      type: (formData.type || null) as Location['type'],
      description: formData.description.trim() || null,
      atmosphere: formData.atmosphere.trim() || null,
      climate: formData.climate.trim() || null,
      key_features: formData.key_features.trim() || null,
      history: formData.history.trim() || null,
      cultural_significance: formData.cultural_significance.trim() || null,
      visual_references: formData.visual_references.trim() || null,
      lighting_notes: formData.lighting_notes.trim() || null,
      sound_notes: formData.sound_notes.trim() || null,
      asset_requirements: formData.asset_requirements.trim() || null,
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
      title={isEdit ? 'Edit Location' : 'New Location'}
      size="lg"
    >
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 dark:text-white">Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Name" htmlFor="name" required error={errors.name}>
              <Input
                id="name"
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="Location name"
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
            <FormField label="Parent Location" htmlFor="parent" className="md:col-span-2">
              <Select
                id="parent"
                options={parentOptions}
                value={formData.parent_location_id}
                onChange={e => handleChange('parent_location_id', e.target.value)}
              />
            </FormField>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 dark:text-white">Description</h3>
          <FormField label="Description" htmlFor="description">
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Physical description of the location..."
              rows={3}
            />
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Atmosphere" htmlFor="atmosphere">
              <Textarea
                id="atmosphere"
                value={formData.atmosphere}
                onChange={e => handleChange('atmosphere', e.target.value)}
                placeholder="Mood and feeling..."
                rows={2}
              />
            </FormField>
            <FormField label="Climate" htmlFor="climate">
              <Textarea
                id="climate"
                value={formData.climate}
                onChange={e => handleChange('climate', e.target.value)}
                placeholder="Weather, environmental conditions..."
                rows={2}
              />
            </FormField>
          </div>
          <FormField label="Key Features" htmlFor="key_features">
            <Textarea
              id="key_features"
              value={formData.key_features}
              onChange={e => handleChange('key_features', e.target.value)}
              placeholder="Notable landmarks, characteristics..."
              rows={2}
            />
          </FormField>
        </div>

        {/* History & Culture */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 dark:text-white">History & Culture</h3>
          <FormField label="History" htmlFor="history">
            <Textarea
              id="history"
              value={formData.history}
              onChange={e => handleChange('history', e.target.value)}
              placeholder="Historical significance..."
              rows={3}
            />
          </FormField>
          <FormField label="Cultural Significance" htmlFor="cultural_significance">
            <Textarea
              id="cultural_significance"
              value={formData.cultural_significance}
              onChange={e => handleChange('cultural_significance', e.target.value)}
              placeholder="Cultural meaning, traditions..."
              rows={2}
            />
          </FormField>
        </div>

        {/* Production Notes */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 dark:text-white">Production Notes</h3>
          <FormField label="Visual References" htmlFor="visual_references">
            <Textarea
              id="visual_references"
              value={formData.visual_references}
              onChange={e => handleChange('visual_references', e.target.value)}
              placeholder="Notes for environment design..."
              rows={2}
            />
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Lighting Notes" htmlFor="lighting_notes">
              <Textarea
                id="lighting_notes"
                value={formData.lighting_notes}
                onChange={e => handleChange('lighting_notes', e.target.value)}
                placeholder="Lighting conditions..."
                rows={2}
              />
            </FormField>
            <FormField label="Sound Notes" htmlFor="sound_notes">
              <Textarea
                id="sound_notes"
                value={formData.sound_notes}
                onChange={e => handleChange('sound_notes', e.target.value)}
                placeholder="Ambient sound design..."
                rows={2}
              />
            </FormField>
          </div>
          <FormField label="Asset Requirements" htmlFor="asset_requirements">
            <Textarea
              id="asset_requirements"
              value={formData.asset_requirements}
              onChange={e => handleChange('asset_requirements', e.target.value)}
              placeholder="Props, set pieces needed..."
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
          {isEdit ? 'Save Changes' : 'Create Location'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
