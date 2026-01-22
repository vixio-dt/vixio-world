import { useState, useMemo } from 'react'
import { Package, Plus } from 'lucide-react'
import { SearchInput, Select, EmptyState, Button } from '@/components/ui'
import { ItemCard } from './ItemCard'
import type { Item } from '@/types/database'

interface ItemListProps {
  items: Item[]
  loading: boolean
  onSelect: (item: Item) => void
  onCreateNew: () => void
}

const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'weapon', label: 'Weapon' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'artifact', label: 'Artifact' },
  { value: 'tool', label: 'Tool' },
  { value: 'document', label: 'Document' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'technology', label: 'Technology' },
]

export function ItemList({ items, loading, onSelect, onCreateNew }: ItemListProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          item.name.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }
      if (typeFilter !== 'all' && item.type !== typeFilter) return false
      return true
    })
  }, [items, search, typeFilter])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Items</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Props, artifacts, and significant objects
          </p>
        </div>
        <Button onClick={onCreateNew} icon={<Plus className="w-4 h-4" />}>
          Add Item
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search items..." className="flex-1" />
        <Select
          options={typeOptions}
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="w-full sm:w-40"
        />
      </div>

      {filteredItems.length === 0 ? (
        items.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No items yet"
            description="Add weapons, artifacts, vehicles, and other significant objects."
            action={{ label: 'Create Item', onClick: onCreateNew }}
          />
        ) : (
          <EmptyState icon={Package} title="No items match your search" description="Try adjusting your filters" />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} onClick={() => onSelect(item)} />
          ))}
        </div>
      )}
    </div>
  )
}
