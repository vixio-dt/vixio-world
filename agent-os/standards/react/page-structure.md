# Page Structure

## File Organization

```
src/pages/[section]/
├── [Section]Page.tsx      # Main page component
└── components/
    ├── index.ts           # Barrel export
    ├── [Entity]List.tsx   # List view
    ├── [Entity]Card.tsx   # Card for list items
    ├── [Entity]Detail.tsx # Detail view
    └── [Entity]Form.tsx   # Create/edit modal
```

## Page Component Pattern

```tsx
export function [Entity]Page() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const { data, loading, create, update, remove, getById } = useSupabaseCRUD<Entity>({
    table: 'entities'
  })

  const [selected, setSelected] = useState<Entity | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Entity | null>(null)

  // Load by ID from URL
  useEffect(() => {
    if (id) {
      getById(id).then(setSelected)
    }
  }, [id])

  // Show detail if selected
  if (selected) {
    return <EntityDetail entity={selected} onEdit={...} onDelete={...} />
  }

  // Show list otherwise
  return <EntityList entities={data} onSelect={...} onCreateNew={...} />
}
```

## URL Routing

- List: `/entities`
- Detail: `/entities/:id`
- Navigation: `navigate(\`/entities/\${entity.id}\`)`

## State Flow

1. URL has ID → load and show detail view
2. URL has no ID → show list view
3. Create/edit → modal form
4. Actions → toast feedback
