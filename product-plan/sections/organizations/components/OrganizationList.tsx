import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { OrganizationCard } from './OrganizationCard'
import type { Organization, OrganizationType } from '@product/sections/organizations/types'

const typeFilters: { value: OrganizationType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'government', label: 'Government' },
  { value: 'religion', label: 'Religion' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'guild', label: 'Guild' },
  { value: 'family', label: 'Family' },
  { value: 'military', label: 'Military' },
  { value: 'secret_society', label: 'Secret Society' },
]

interface OrganizationListProps {
  organizations: Organization[]
  selectedId?: string
  onSelect?: (organization: Organization) => void
}

export function OrganizationList({ organizations, selectedId, onSelect }: OrganizationListProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<OrganizationType | 'all'>('all')

  const filtered = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.purpose.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || org.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search organizations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as OrganizationType | 'all')}
            className="pl-10 pr-8 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer"
          >
            {typeFilters.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {filtered.length} organization{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Organization Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(org => (
          <OrganizationCard
            key={org.id}
            organization={org}
            selected={org.id === selectedId}
            onClick={() => onSelect?.(org)}
          />
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">
            No organizations found matching your criteria.
          </p>
        </div>
      )}
    </div>
  )
}
