import { useState, useMemo } from 'react'
import { Scale, Plus } from 'lucide-react'
import { SearchInput, Select, EmptyState, Button } from '@/components/ui'
import { RuleCard } from './RuleCard'
import type { Rule } from '@/types/database'

interface RuleListProps {
  rules: Rule[]
  loading: boolean
  onSelect: (rule: Rule) => void
  onCreateNew: () => void
}

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
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

export function RuleList({ rules, loading, onSelect, onCreateNew }: RuleListProps) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Group rules by category
  const groupedRules = useMemo(() => {
    const filtered = rules.filter(rule => {
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          rule.name.toLowerCase().includes(searchLower) ||
          rule.code?.toLowerCase().includes(searchLower) ||
          rule.statement?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }
      if (categoryFilter !== 'all' && rule.category !== categoryFilter) return false
      return true
    })

    // Group by category
    const groups: Record<string, Rule[]> = {}
    filtered.forEach(rule => {
      const cat = rule.category || 'uncategorized'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(rule)
    })

    return groups
  }, [rules, search, categoryFilter])

  const sortedCategories = Object.keys(groupedRules).sort()
  const totalFiltered = Object.values(groupedRules).flat().length

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Rules</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Laws and constraints that govern your world
          </p>
        </div>
        <Button onClick={onCreateNew} icon={<Plus className="w-4 h-4" />}>
          Add Rule
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search rules..." className="flex-1" />
        <Select
          options={categoryOptions}
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="w-full sm:w-48"
        />
      </div>

      {totalFiltered === 0 ? (
        rules.length === 0 ? (
          <EmptyState
            icon={Scale}
            title="No rules yet"
            description="Define the laws of physics, magic, society, and more that govern your world."
            action={{ label: 'Create Rule', onClick: onCreateNew }}
          />
        ) : (
          <EmptyState icon={Scale} title="No rules match your search" description="Try adjusting your filters" />
        )
      ) : (
        <div className="space-y-8">
          {sortedCategories.map(category => (
            <div key={category}>
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                {category} ({groupedRules[category].length})
              </h2>
              <div className="space-y-3">
                {groupedRules[category].map(rule => (
                  <RuleCard key={rule.id} rule={rule} onClick={() => onSelect(rule)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
