import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { ItemCard } from './ItemCard'
import type { Item, ItemType, ItemSignificance } from '@product/sections/items/types'

const typeFilters: { value: ItemType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'weapon', label: 'Weapons' },
  { value: 'vehicle', label: 'Vehicles' },
  { value: 'artifact', label: 'Artifacts' },
  { value: 'tool', label: 'Tools' },
  { value: 'document', label: 'Documents' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'technology', label: 'Technology' },
]

const significanceFilters: { value: ItemSignificance | 'all'; label: string }[] = [
  { value: 'all', label: 'All Significance' },
  { value: 'critical', label: 'Critical' },
  { value: 'major', label: 'Major' },
  { value: 'minor', label: 'Minor' },
  { value: 'background', label: 'Background' },
]

interface ItemListProps {
  items: Item[]
  selectedId?: string
  onSelect?: (item: Item) => void
}

export function ItemList({ items, selectedId, onSelect }: ItemListProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<ItemType | 'all'>('all')
  const [significanceFilter, setSignificanceFilter] = useState<ItemSignificance | 'all'>('all')

  const filtered = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    const matchesSignificance = significanceFilter === 'all' || item.significance === significanceFilter
    return matchesSearch && matchesType && matchesSignificance
  })

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ItemType | 'all')}
              className="pl-10 pr-8 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer"
            >
              {typeFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
          <select
            value={significanceFilter}
            onChange={(e) => setSignificanceFilter(e.target.value as ItemSignificance | 'all')}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer"
          >
            {significanceFilters.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {filtered.length} item{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            selected={item.id === selectedId}
            onClick={() => onSelect?.(item)}
          />
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">
            No items found matching your criteria.
          </p>
        </div>
      )}
    </div>
  )
}
