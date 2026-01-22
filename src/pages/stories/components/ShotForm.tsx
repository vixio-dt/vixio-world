import { useState, useEffect } from 'react'
import { Modal, ModalFooter, FormField, Input, Textarea, Select, Button } from '@/components/ui'
import type { Shot } from '@/types/database'

interface ShotFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Shot>) => Promise<boolean>
  shot?: Shot | null
  nextShotNumber: number
  loading?: boolean
}

const shotTypeOptions = [
  { value: '', label: 'Select type...' },
  { value: 'wide', label: 'Wide' },
  { value: 'medium', label: 'Medium' },
  { value: 'close_up', label: 'Close Up' },
  { value: 'extreme_close_up', label: 'Extreme Close Up' },
  { value: 'over_shoulder', label: 'Over Shoulder' },
  { value: 'pov', label: 'POV' },
  { value: 'aerial', label: 'Aerial' },
]

const cameraMovementOptions = [
  { value: '', label: 'Select movement...' },
  { value: 'static', label: 'Static' },
  { value: 'pan', label: 'Pan' },
  { value: 'tilt', label: 'Tilt' },
  { value: 'dolly', label: 'Dolly' },
  { value: 'crane', label: 'Crane' },
  { value: 'handheld', label: 'Handheld' },
  { value: 'steadicam', label: 'Steadicam' },
]

const initialFormData = {
  shot_number: '',
  shot_type: '',
  camera_movement: '',
  description: '',
  action: '',
  dialogue: '',
  mood: '',
  lighting_notes: '',
  duration_estimate: '',
  visual_prompt: '',
}

export function ShotForm({ isOpen, onClose, onSave, shot, nextShotNumber, loading = false }: ShotFormProps) {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = !!shot

  useEffect(() => {
    if (shot) {
      setFormData({
        shot_number: shot.shot_number?.toString() || '',
        shot_type: shot.shot_type || '',
        camera_movement: shot.camera_movement || '',
        description: shot.description || '',
        action: shot.action || '',
        dialogue: shot.dialogue || '',
        mood: shot.mood || '',
        lighting_notes: shot.lighting_notes || '',
        duration_estimate: shot.duration_estimate?.toString() || '',
        visual_prompt: shot.visual_prompt || '',
      })
    } else {
      setFormData({ ...initialFormData, shot_number: nextShotNumber.toString() })
    }
    setErrors({})
  }, [shot, isOpen, nextShotNumber])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.shot_number) newErrors.shot_number = 'Shot number is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    const data: Partial<Shot> = {
      shot_number: parseInt(formData.shot_number, 10),
      shot_type: (formData.shot_type || null) as Shot['shot_type'],
      camera_movement: (formData.camera_movement || null) as Shot['camera_movement'],
      description: formData.description.trim() || null,
      action: formData.action.trim() || null,
      dialogue: formData.dialogue.trim() || null,
      mood: formData.mood.trim() || null,
      lighting_notes: formData.lighting_notes.trim() || null,
      duration_estimate: formData.duration_estimate ? parseInt(formData.duration_estimate, 10) : null,
      visual_prompt: formData.visual_prompt.trim() || null,
    }
    const success = await onSave(data)
    if (success) onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Shot' : 'New Shot'} size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Shot Number" htmlFor="shot_number" required error={errors.shot_number}>
            <Input id="shot_number" type="number" value={formData.shot_number} onChange={e => handleChange('shot_number', e.target.value)} error={!!errors.shot_number} />
          </FormField>
          <FormField label="Shot Type" htmlFor="shot_type">
            <Select id="shot_type" options={shotTypeOptions} value={formData.shot_type} onChange={e => handleChange('shot_type', e.target.value)} />
          </FormField>
          <FormField label="Camera Movement" htmlFor="camera_movement">
            <Select id="camera_movement" options={cameraMovementOptions} value={formData.camera_movement} onChange={e => handleChange('camera_movement', e.target.value)} />
          </FormField>
        </div>
        <FormField label="Description" htmlFor="description">
          <Textarea id="description" value={formData.description} onChange={e => handleChange('description', e.target.value)} placeholder="What's in the shot?" rows={2} />
        </FormField>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Action" htmlFor="action">
            <Textarea id="action" value={formData.action} onChange={e => handleChange('action', e.target.value)} rows={2} />
          </FormField>
          <FormField label="Dialogue" htmlFor="dialogue">
            <Textarea id="dialogue" value={formData.dialogue} onChange={e => handleChange('dialogue', e.target.value)} rows={2} />
          </FormField>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Mood" htmlFor="mood">
            <Input id="mood" value={formData.mood} onChange={e => handleChange('mood', e.target.value)} />
          </FormField>
          <FormField label="Lighting Notes" htmlFor="lighting_notes">
            <Input id="lighting_notes" value={formData.lighting_notes} onChange={e => handleChange('lighting_notes', e.target.value)} />
          </FormField>
          <FormField label="Duration (sec)" htmlFor="duration_estimate">
            <Input id="duration_estimate" type="number" value={formData.duration_estimate} onChange={e => handleChange('duration_estimate', e.target.value)} />
          </FormField>
        </div>
        <FormField label="Visual Prompt" htmlFor="visual_prompt" hint="For AI image generation">
          <Textarea id="visual_prompt" value={formData.visual_prompt} onChange={e => handleChange('visual_prompt', e.target.value)} placeholder="Detailed visual description for AI generation" rows={3} />
        </FormField>
      </div>

      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} loading={loading}>{isEdit ? 'Save Changes' : 'Create Shot'}</Button>
      </ModalFooter>
    </Modal>
  )
}
