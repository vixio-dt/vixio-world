import { useState, useMemo } from 'react'
import { Building2, Plus } from 'lucide-react'
import { SearchInput, Select, EmptyState, Button } from '@/components/ui'
import { OrganizationCard } from './OrganizationCard'
import type { Organization } from '@/types/database'

interface OrganizationListProps {
  organizations: Organization[]
  loading: boolean
  onSelect: (organization: Organization) => void
  onCreateNew: () => void
}

const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'government', label: 'Government' },
  { value: 'religion', label: 'Religion' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'guild', label: 'Guild' },
  { value: 'family', label: 'Family' },
  { value: 'military', label: 'Military' },
  { value: 'secret_society', label: 'Secret Society' },
]

export function OrganizationList({
  organizations,
  loading,
  onSelect,
  onCreateNew,
}: OrganizationListProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredOrganizations = useMemo(() => {
    return organizations.filter(org => {
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          org.name.toLowerCase().includes(searchLower) ||
          org.purpose?.toLowerCase().includes(searchLower) ||
          org.beliefs?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      if (typeFilter !== 'all' && org.type !== typeFilter) {
        return false
      }

      return true
    })
  }, [organizations, search, typeFilter])

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
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Organizations
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Factions, governments, and groups in your world
          </p>
        </div>
        <Button onClick={onCreateNew} icon={<Plus className="w-4 h-4" />}>
          Add Organization
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search organizations..."
          className="flex-1"
        />
        <Select
          options={typeOptions}
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="w-full sm:w-48"
        />
      </div>

      {filteredOrganizations.length === 0 ? (
        organizations.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No organizations yet"
            description="Create factions, governments, guilds, and other groups that shape your world."
            action={{ label: 'Create Organization', onClick: onCreateNew }}
          />
        ) : (
          <EmptyState
            icon={Building2}
            title="No organizations match your search"
            description="Try adjusting your filters or search term"
          />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrganizations.map(org => (
            <OrganizationCard
              key={org.id}
              organization={org}
              onClick={() => onSelect(org)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
