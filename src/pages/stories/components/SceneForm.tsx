import { useState, useEffect } from 'react'
import { Modal, ModalFooter, FormField, Input, Textarea, Button } from '@/components/ui'
import type { Scene } from '@/types/database'

interface SceneFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Scene>) => Promise<boolean>
  scene?: Scene | null
  nextSceneNumber: number
  loading?: boolean
}

const initialFormData = {
  scene_number: '',
  time: '',
  purpose: '',
  summary: '',
  emotional_beat: '',
  key_dialogue: '',
  action: '',
  props_needed: '',
  setup_payoff: '',
}

export function SceneForm({ isOpen, onClose, onSave, scene, nextSceneNumber, loading = false }: SceneFormProps) {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = !!scene

  useEffect(() => {
    if (scene) {
      setFormData({
        scene_number: scene.scene_number?.toString() || '',
        time: scene.time || '',
        purpose: scene.purpose || '',
        summary: scene.summary || '',
        emotional_beat: scene.emotional_beat || '',
        key_dialogue: scene.key_dialogue || '',
        action: scene.action || '',
        props_needed: scene.props_needed || '',
        setup_payoff: scene.setup_payoff || '',
      })
    } else {
      setFormData({ ...initialFormData, scene_number: nextSceneNumber.toString() })
    }
    setErrors({})
  }, [scene, isOpen, nextSceneNumber])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.scene_number) newErrors.scene_number = 'Scene number is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    const data: Partial<Scene> = {
      scene_number: parseInt(formData.scene_number, 10),
      time: formData.time.trim() || null,
      purpose: formData.purpose.trim() || null,
      summary: formData.summary.trim() || null,
      emotional_beat: formData.emotional_beat.trim() || null,
      key_dialogue: formData.key_dialogue.trim() || null,
      action: formData.action.trim() || null,
      props_needed: formData.props_needed.trim() || null,
      setup_payoff: formData.setup_payoff.trim() || null,
    }
    const success = await onSave(data)
    if (success) onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Scene' : 'New Scene'} size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Scene Number" htmlFor="scene_number" required error={errors.scene_number}>
            <Input id="scene_number" type="number" value={formData.scene_number} onChange={e => handleChange('scene_number', e.target.value)} error={!!errors.scene_number} />
          </FormField>
          <FormField label="Time" htmlFor="time">
            <Input id="time" value={formData.time} onChange={e => handleChange('time', e.target.value)} placeholder="DAY, NIGHT, DUSK..." />
          </FormField>
        </div>
        <FormField label="Purpose" htmlFor="purpose">
          <Textarea id="purpose" value={formData.purpose} onChange={e => handleChange('purpose', e.target.value)} placeholder="What does this scene accomplish?" rows={2} />
        </FormField>
        <FormField label="Summary" htmlFor="summary">
          <Textarea id="summary" value={formData.summary} onChange={e => handleChange('summary', e.target.value)} placeholder="Brief scene description" rows={3} />
        </FormField>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Emotional Beat" htmlFor="emotional_beat">
            <Input id="emotional_beat" value={formData.emotional_beat} onChange={e => handleChange('emotional_beat', e.target.value)} />
          </FormField>
          <FormField label="Props Needed" htmlFor="props_needed">
            <Input id="props_needed" value={formData.props_needed} onChange={e => handleChange('props_needed', e.target.value)} />
          </FormField>
        </div>
        <FormField label="Key Dialogue" htmlFor="key_dialogue">
          <Textarea id="key_dialogue" value={formData.key_dialogue} onChange={e => handleChange('key_dialogue', e.target.value)} rows={2} />
        </FormField>
        <FormField label="Action" htmlFor="action">
          <Textarea id="action" value={formData.action} onChange={e => handleChange('action', e.target.value)} rows={2} />
        </FormField>
      </div>

      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} loading={loading}>{isEdit ? 'Save Changes' : 'Create Scene'}</Button>
      </ModalFooter>
    </Modal>
  )
}
