import { useState, useMemo } from 'react'
import { BookOpen, Plus } from 'lucide-react'
import { SearchInput, Select, EmptyState, Button } from '@/components/ui'
import { StoryCard } from './StoryCard'
import type { Story } from '@/types/database'

interface StoryListProps {
  stories: Story[]
  loading: boolean
  onSelect: (story: Story) => void
  onCreateNew: () => void
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'concept', label: 'Concept' },
  { value: 'outline', label: 'Outline' },
  { value: 'draft', label: 'Draft' },
  { value: 'complete', label: 'Complete' },
]

export function StoryList({ stories, loading, onSelect, onCreateNew }: StoryListProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredStories = useMemo(() => {
    return stories.filter(story => {
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          story.title.toLowerCase().includes(searchLower) ||
          story.logline?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }
      if (statusFilter !== 'all' && story.status !== statusFilter) return false
      return true
    })
  }, [stories, search, statusFilter])

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
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Stories</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Narratives, scenes, and shot breakdowns
          </p>
        </div>
        <Button onClick={onCreateNew} icon={<Plus className="w-4 h-4" />}>
          Add Story
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search stories..." className="flex-1" />
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="w-full sm:w-40"
        />
      </div>

      {filteredStories.length === 0 ? (
        stories.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No stories yet"
            description="Create stories with scenes and shots for production planning."
            action={{ label: 'Create Story', onClick: onCreateNew }}
          />
        ) : (
          <EmptyState icon={BookOpen} title="No stories match your search" description="Try adjusting your filters" />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStories.map(story => (
            <StoryCard key={story.id} story={story} onClick={() => onSelect(story)} />
          ))}
        </div>
      )}
    </div>
  )
}
