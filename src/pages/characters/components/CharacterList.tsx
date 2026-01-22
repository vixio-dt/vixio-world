import { useState, useMemo } from 'react'
import { Users, Plus } from 'lucide-react'
import { SearchInput, Select, EmptyState, Button } from '@/components/ui'
import { CharacterCard } from './CharacterCard'
import type { Character } from '@/types/database'

interface CharacterListProps {
  characters: Character[]
  loading: boolean
  onSelect: (character: Character) => void
  onCreateNew: () => void
}

const roleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'protagonist', label: 'Protagonist' },
  { value: 'antagonist', label: 'Antagonist' },
  { value: 'supporting', label: 'Supporting' },
  { value: 'background', label: 'Background' },
]

export function CharacterList({
  characters,
  loading,
  onSelect,
  onCreateNew,
}: CharacterListProps) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  // Get unique species for filter
  const speciesOptions = useMemo(() => {
    const species = new Set(characters.map(c => c.species).filter(Boolean))
    return [
      { value: 'all', label: 'All Species' },
      ...Array.from(species).map(s => ({ value: s!, label: s! })),
    ]
  }, [characters])

  const [speciesFilter, setSpeciesFilter] = useState('all')

  // Filter characters
  const filteredCharacters = useMemo(() => {
    return characters.filter(character => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          character.name.toLowerCase().includes(searchLower) ||
          character.aliases?.some(a => a.toLowerCase().includes(searchLower)) ||
          character.species?.toLowerCase().includes(searchLower) ||
          character.personality?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Role filter
      if (roleFilter !== 'all' && character.role !== roleFilter) {
        return false
      }

      // Species filter
      if (speciesFilter !== 'all' && character.species !== speciesFilter) {
        return false
      }

      return true
    })
  }, [characters, search, roleFilter, speciesFilter])

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
            Characters
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            People, creatures, and entities in your world
          </p>
        </div>
        <Button onClick={onCreateNew} icon={<Plus className="w-4 h-4" />}>
          Add Character
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search characters..."
          className="flex-1"
        />
        <Select
          options={roleOptions}
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="w-full sm:w-40"
        />
        {speciesOptions.length > 1 && (
          <Select
            options={speciesOptions}
            value={speciesFilter}
            onChange={e => setSpeciesFilter(e.target.value)}
            className="w-full sm:w-40"
          />
        )}
      </div>

      {/* Character Grid */}
      {filteredCharacters.length === 0 ? (
        characters.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No characters yet"
            description="Characters are the heart of any story. Add your first protagonist, villain, or supporting cast."
            action={{ label: 'Create Character', onClick: onCreateNew }}
          />
        ) : (
          <EmptyState
            icon={Users}
            title="No characters match your search"
            description="Try adjusting your filters or search term"
          />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCharacters.map(character => (
            <CharacterCard
              key={character.id}
              character={character}
              onClick={() => onSelect(character)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
