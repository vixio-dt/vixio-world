import { useState, useEffect } from 'react'
import { Modal, ModalFooter, FormField, Input, Textarea, Select, Button } from '@/components/ui'
import type { Character } from '@/types/database'

interface CharacterFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Character>) => Promise<boolean>
  character?: Character | null
  loading?: boolean
}

const roleOptions = [
  { value: '', label: 'Select role...' },
  { value: 'protagonist', label: 'Protagonist' },
  { value: 'antagonist', label: 'Antagonist' },
  { value: 'supporting', label: 'Supporting' },
  { value: 'background', label: 'Background' },
]

const initialFormData = {
  name: '',
  aliases: '',
  role: '',
  species: '',
  appearance: '',
  personality: '',
  background: '',
  motivations: '',
  arc_potential: '',
  visual_references: '',
  voice_notes: '',
  movement_notes: '',
}

export function CharacterForm({
  isOpen,
  onClose,
  onSave,
  character,
  loading = false,
}: CharacterFormProps) {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEdit = !!character

  useEffect(() => {
    if (character) {
      setFormData({
        name: character.name || '',
        aliases: character.aliases?.join(', ') || '',
        role: character.role || '',
        species: character.species || '',
        appearance: character.appearance || '',
        personality: character.personality || '',
        background: character.background || '',
        motivations: character.motivations || '',
        arc_potential: character.arc_potential || '',
        visual_references: character.visual_references || '',
        voice_notes: character.voice_notes || '',
        movement_notes: character.movement_notes || '',
      })
    } else {
      setFormData(initialFormData)
    }
    setErrors({})
  }, [character, isOpen])

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

    const data: Partial<Character> = {
      name: formData.name.trim(),
      aliases: formData.aliases ? formData.aliases.split(',').map(a => a.trim()).filter(Boolean) : null,
      role: (formData.role || null) as Character['role'],
      species: formData.species.trim() || null,
      appearance: formData.appearance.trim() || null,
      personality: formData.personality.trim() || null,
      background: formData.background.trim() || null,
      motivations: formData.motivations.trim() || null,
      arc_potential: formData.arc_potential.trim() || null,
      visual_references: formData.visual_references.trim() || null,
      voice_notes: formData.voice_notes.trim() || null,
      movement_notes: formData.movement_notes.trim() || null,
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
      title={isEdit ? 'Edit Character' : 'New Character'}
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
                placeholder="Character name"
                error={!!errors.name}
              />
            </FormField>
            <FormField label="Role" htmlFor="role">
              <Select
                id="role"
                options={roleOptions}
                value={formData.role}
                onChange={e => handleChange('role', e.target.value)}
              />
            </FormField>
            <FormField label="Species" htmlFor="species">
              <Input
                id="species"
                value={formData.species}
                onChange={e => handleChange('species', e.target.value)}
                placeholder="Human, Elf, Android..."
              />
            </FormField>
            <FormField label="Aliases" htmlFor="aliases" hint="Comma-separated">
              <Input
                id="aliases"
                value={formData.aliases}
                onChange={e => handleChange('aliases', e.target.value)}
                placeholder="The Shadow, Old Bones..."
              />
            </FormField>
          </div>
        </div>

        {/* Appearance & Personality */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 dark:text-white">Character</h3>
          <FormField label="Appearance" htmlFor="appearance">
            <Textarea
              id="appearance"
              value={formData.appearance}
              onChange={e => handleChange('appearance', e.target.value)}
              placeholder="Physical description, distinguishing features..."
              rows={3}
            />
          </FormField>
          <FormField label="Personality" htmlFor="personality">
            <Textarea
              id="personality"
              value={formData.personality}
              onChange={e => handleChange('personality', e.target.value)}
              placeholder="Personality traits, behavior patterns..."
              rows={3}
            />
          </FormField>
        </div>

        {/* Background & Motivations */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 dark:text-white">Story</h3>
          <FormField label="Background" htmlFor="background">
            <Textarea
              id="background"
              value={formData.background}
              onChange={e => handleChange('background', e.target.value)}
              placeholder="History, origin story..."
              rows={3}
            />
          </FormField>
          <FormField label="Motivations" htmlFor="motivations">
            <Textarea
              id="motivations"
              value={formData.motivations}
              onChange={e => handleChange('motivations', e.target.value)}
              placeholder="Goals, driving forces..."
              rows={2}
            />
          </FormField>
          <FormField label="Arc Potential" htmlFor="arc_potential">
            <Textarea
              id="arc_potential"
              value={formData.arc_potential}
              onChange={e => handleChange('arc_potential', e.target.value)}
              placeholder="How might this character change?"
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
              placeholder="Notes for MetaHuman creation, costume design..."
              rows={2}
            />
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Voice Notes" htmlFor="voice_notes">
              <Textarea
                id="voice_notes"
                value={formData.voice_notes}
                onChange={e => handleChange('voice_notes', e.target.value)}
                placeholder="Speech patterns, accent..."
                rows={2}
              />
            </FormField>
            <FormField label="Movement Notes" htmlFor="movement_notes">
              <Textarea
                id="movement_notes"
                value={formData.movement_notes}
                onChange={e => handleChange('movement_notes', e.target.value)}
                placeholder="Physicality, gestures..."
                rows={2}
              />
            </FormField>
          </div>
        </div>
      </div>

      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} loading={loading}>
          {isEdit ? 'Save Changes' : 'Create Character'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
