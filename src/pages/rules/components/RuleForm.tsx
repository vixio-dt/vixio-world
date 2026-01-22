import { useState, useEffect, useMemo } from 'react'
import { Modal, ModalFooter, FormField, Input, Textarea, Select, Button } from '@/components/ui'
import type { Rule } from '@/types/database'

interface RuleFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Rule>) => Promise<boolean>
  rule?: Rule | null
  allRules: Rule[]
  loading?: boolean
}

const categoryOptions = [
  { value: '', label: 'Select category...' },
  { value: 'physics', label: 'Physics' },
  { value: 'magic', label: 'Magic' },
  { value: 'technology', label: 'Technology' },
  { value: 'biology', label: 'Biology' },
  { value: 'social', label: 'Social' },
  { value: 'political', label: 'Political' },
  { value: 'economic', label: 'Economic' },
  { value: 'temporal', label: 'Temporal' },
  { value: 'cosmological', label: 'Cosmological' },
]

const categoryPrefixes: Record<string, string> = {
  physics: 'PHY',
  magic: 'MAGIC',
  technology: 'TECH',
  biology: 'BIO',
  social: 'SOC',
  political: 'POL',
  economic: 'ECON',
  temporal: 'TEMP',
  cosmological: 'COSM',
}

const initialFormData = {
  name: '',
  code: '',
  category: '',
  statement: '',
  scope: '',
  exceptions: '',
  consequences: '',
  examples: '',
}

export function RuleForm({ isOpen, onClose, onSave, rule, allRules, loading = false }: RuleFormProps) {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = !!rule

  // Generate next code for category
  const suggestedCode = useMemo(() => {
    if (!formData.category || isEdit) return ''
    const prefix = categoryPrefixes[formData.category] || formData.category.toUpperCase().slice(0, 4)
    const existingCodes = allRules
      .filter(r => r.category === formData.category && r.code)
      .map(r => {
        const match = r.code?.match(new RegExp(`${prefix}-(\\d+)`))
        return match ? parseInt(match[1], 10) : 0
      })
    const nextNum = Math.max(0, ...existingCodes) + 1
    return `${prefix}-${String(nextNum).padStart(3, '0')}`
  }, [formData.category, allRules, isEdit])

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name || '',
        code: rule.code || '',
        category: rule.category || '',
        statement: rule.statement || '',
        scope: rule.scope || '',
        exceptions: rule.exceptions || '',
        consequences: rule.consequences || '',
        examples: rule.examples || '',
      })
    } else {
      setFormData(initialFormData)
    }
    setErrors({})
  }, [rule, isOpen])

  // Auto-update code when category changes (for new rules)
  useEffect(() => {
    if (!isEdit && suggestedCode && !formData.code) {
      setFormData(prev => ({ ...prev, code: suggestedCode }))
    }
  }, [suggestedCode, isEdit, formData.code])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value,
      code: isEdit ? prev.code : '', // Reset code on category change for new rules
    }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    const data: Partial<Rule> = {
      name: formData.name.trim(),
      code: formData.code.trim() || null,
      category: (formData.category || null) as Rule['category'],
      statement: formData.statement.trim() || null,
      scope: formData.scope.trim() || null,
      exceptions: formData.exceptions.trim() || null,
      consequences: formData.consequences.trim() || null,
      examples: formData.examples.trim() || null,
    }
    const success = await onSave(data)
    if (success) onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Rule' : 'New Rule'} size="lg">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 dark:text-white">Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Category" htmlFor="category">
              <Select
                id="category"
                options={categoryOptions}
                value={formData.category}
                onChange={e => handleCategoryChange(e.target.value)}
              />
            </FormField>
            <FormField label="Code" htmlFor="code" hint="Auto-generated based on category">
              <Input
                id="code"
                value={formData.code}
                onChange={e => handleChange('code', e.target.value)}
                placeholder={suggestedCode || 'e.g., MAGIC-001'}
              />
            </FormField>
          </div>
          <FormField label="Name" htmlFor="name" required error={errors.name}>
            <Input
              id="name"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="Rule name"
              error={!!errors.name}
            />
          </FormField>
          <FormField label="Statement" htmlFor="statement" hint="Clear, concise statement of the rule">
            <Textarea
              id="statement"
              value={formData.statement}
              onChange={e => handleChange('statement', e.target.value)}
              placeholder="What does this rule state?"
              rows={3}
            />
          </FormField>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 dark:text-white">Details</h3>
          <FormField label="Scope" htmlFor="scope">
            <Textarea
              id="scope"
              value={formData.scope}
              onChange={e => handleChange('scope', e.target.value)}
              placeholder="Where/when does this rule apply?"
              rows={2}
            />
          </FormField>
          <FormField label="Exceptions" htmlFor="exceptions">
            <Textarea
              id="exceptions"
              value={formData.exceptions}
              onChange={e => handleChange('exceptions', e.target.value)}
              placeholder="Known exceptions to this rule"
              rows={2}
            />
          </FormField>
          <FormField label="Consequences" htmlFor="consequences">
            <Textarea
              id="consequences"
              value={formData.consequences}
              onChange={e => handleChange('consequences', e.target.value)}
              placeholder="What happens when this rule is violated?"
              rows={2}
            />
          </FormField>
          <FormField label="Examples" htmlFor="examples">
            <Textarea
              id="examples"
              value={formData.examples}
              onChange={e => handleChange('examples', e.target.value)}
              placeholder="Illustrative examples"
              rows={2}
            />
          </FormField>
        </div>
      </div>

      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} loading={loading}>{isEdit ? 'Save Changes' : 'Create Rule'}</Button>
      </ModalFooter>
    </Modal>
  )
}
