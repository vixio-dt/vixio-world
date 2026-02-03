'use client'

import { Button, Input } from '@/components/ui'
import { Users, MapPin, Building2, Calendar, Package, Scale, BookOpen, Maximize2, Home } from 'lucide-react'
import type { EntityType } from '@/lib/types/database'

interface GraphControlsProps {
  typeFilters: Record<EntityType, boolean>
  onToggleType: (type: EntityType) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onCenter: () => void
  onFullscreen: () => void
}

const entityTypes: { type: EntityType; icon: typeof Users; label: string; color: string }[] = [
  { type: 'character', icon: Users, label: 'Characters', color: 'bg-cyan-500' },
  { type: 'location', icon: MapPin, label: 'Locations', color: 'bg-emerald-500' },
  { type: 'organization', icon: Building2, label: 'Organizations', color: 'bg-purple-500' },
  { type: 'event', icon: Calendar, label: 'Events', color: 'bg-rose-500' },
  { type: 'item', icon: Package, label: 'Items', color: 'bg-amber-500' },
  { type: 'rule', icon: Scale, label: 'Rules', color: 'bg-indigo-500' },
  { type: 'story', icon: BookOpen, label: 'Stories', color: 'bg-cyan-500' },
]

export function GraphControls({
  typeFilters,
  onToggleType,
  searchQuery,
  onSearchChange,
  onCenter,
  onFullscreen,
}: GraphControlsProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-4">
      {/* Type filters */}
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur rounded-lg p-2 shadow-lg">
        {entityTypes.map(({ type, icon: Icon, label, color }) => (
          <button
            key={type}
            onClick={() => onToggleType(type)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-all ${
              typeFilters[type]
                ? `${color} text-white`
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
            title={`Toggle ${label}`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Search and actions */}
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur rounded-lg p-2 shadow-lg">
        <Input
          type="search"
          placeholder="Search entities..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-48 h-8 text-sm"
        />
        <Button variant="outline" size="sm" onClick={onCenter} title="Center view">
          <Home className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onFullscreen} title="Fullscreen">
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
