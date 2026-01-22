import { useState, useMemo } from 'react'
import { MapPin, Plus, List, GitBranch } from 'lucide-react'
import { SearchInput, Select, EmptyState, Button } from '@/components/ui'
import { LocationCard } from './LocationCard'
import { LocationTree } from './LocationTree'
import type { Location } from '@/types/database'

interface LocationListProps {
  locations: Location[]
  loading: boolean
  onSelect: (location: Location) => void
  onCreateNew: () => void
}

const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'planet', label: 'Planet' },
  { value: 'continent', label: 'Continent' },
  { value: 'country', label: 'Country' },
  { value: 'city', label: 'City' },
  { value: 'district', label: 'District' },
  { value: 'building', label: 'Building' },
  { value: 'room', label: 'Room' },
]

type ViewMode = 'tree' | 'list'

export function LocationList({
  locations,
  loading,
  onSelect,
  onCreateNew,
}: LocationListProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [viewMode, setViewMode] = useState<ViewMode>('tree')

  // Create a map for parent names
  const parentMap = useMemo(() => {
    const map = new Map<string, string>()
    locations.forEach(loc => {
      map.set(loc.id, loc.name)
    })
    return map
  }, [locations])

  // Filter locations
  const filteredLocations = useMemo(() => {
    return locations.filter(location => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          location.name.toLowerCase().includes(searchLower) ||
          location.description?.toLowerCase().includes(searchLower) ||
          location.atmosphere?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Type filter
      if (typeFilter !== 'all' && location.type !== typeFilter) {
        return false
      }

      return true
    })
  }, [locations, search, typeFilter])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Locations
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Places and environments in your world
          </p>
        </div>
        <Button onClick={onCreateNew} icon={<Plus className="w-4 h-4" />}>
          Add Location
        </Button>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search locations..."
          className="flex-1"
        />
        <Select
          options={typeOptions}
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="w-full sm:w-40"
        />
        <div className="flex rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden">
          <button
            onClick={() => setViewMode('tree')}
            className={`p-2 ${
              viewMode === 'tree'
                ? 'bg-sky-500 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
            title="Tree View"
          >
            <GitBranch className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${
              viewMode === 'list'
                ? 'bg-sky-500 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
            title="List View"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      {filteredLocations.length === 0 ? (
        locations.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No locations yet"
            description="Where does your story take place? Create your first city, planet, or hidden dungeon."
            action={{ label: 'Create Location', onClick: onCreateNew }}
          />
        ) : (
          <EmptyState
            icon={MapPin}
            title="No locations match your search"
            description="Try adjusting your filters or search term"
          />
        )
      ) : viewMode === 'tree' ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <LocationTree
            locations={filteredLocations}
            onSelect={onSelect}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLocations.map(location => (
            <LocationCard
              key={location.id}
              location={location}
              onClick={() => onSelect(location)}
              parentName={
                location.parent_location_id
                  ? parentMap.get(location.parent_location_id)
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
