# Form Patterns

## Form Component Structure

```tsx
interface [Entity]FormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Entity>) => Promise<boolean>
  entity?: Entity | null  // null = create, entity = edit
  loading?: boolean
}

const initialFormData = {
  name: '',
  field1: '',
  // ... all fields with defaults
}

export function [Entity]Form({ isOpen, onClose, onSave, entity, loading }: Props) {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when entity changes
  useEffect(() => {
    if (entity) {
      setFormData({ /* map entity to form data */ })
    } else {
      setFormData(initialFormData)
    }
    setErrors({})
  }, [entity, isOpen])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => { /* return true if valid */ }

  const handleSubmit = async () => {
    if (!validate()) return
    const success = await onSave(/* mapped data */)
    if (success) onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="...">
      {/* Form fields */}
      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} loading={loading}>Save</Button>
      </ModalFooter>
    </Modal>
  )
}
```

## Validation

- Client-side validation before submit
- Store errors in `Record<string, string>`
- Clear field error when value changes
- Only `name` is typically required

## Field Components

```tsx
<FormField label="Name" htmlFor="name" required error={errors.name}>
  <Input
    id="name"
    value={formData.name}
    onChange={e => handleChange('name', e.target.value)}
    error={!!errors.name}
  />
</FormField>
```

## Data Transformation

- Form stores strings (for inputs)
- Transform to entity types on save
- Arrays: `aliases.split(',').map(a => a.trim()).filter(Boolean)`
- Nullable: `value.trim() || null`
