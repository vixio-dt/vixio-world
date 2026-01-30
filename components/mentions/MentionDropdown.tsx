'use client'

import { useEffect, useRef } from 'react'
import { Users, MapPin, Building2, Calendar, Package, Scale, BookOpen } from 'lucide-react'
import type { SearchResult } from '@/lib/actions/search'
import type { EntityType } from '@/lib/types/database'

interface MentionDropdownProps {
  results: SearchResult[]
  selectedIndex: number
  onSelect: (result: SearchResult) => void
  position: { top: number; left: number }
  loading: boolean
}

const entityIcons: Record<EntityType, typeof Users> = {
  character: Users,
  location: MapPin,
  organization: Building2,
  event: Calendar,
  item: Package,
  rule: Scale,
  story: BookOpen,
}

const entityColors: Record<EntityType, string> = {
  character: 'text-sky-600 bg-sky-50',
  location: 'text-emerald-600 bg-emerald-50',
  organization: 'text-purple-600 bg-purple-50',
  event: 'text-rose-600 bg-rose-50',
  item: 'text-amber-600 bg-amber-50',
  rule: 'text-indigo-600 bg-indigo-50',
  story: 'text-cyan-600 bg-cyan-50',
}

export function MentionDropdown({
  results,
  selectedIndex,
  onSelect,
  position,
  loading,
}: MentionDropdownProps) {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const selectedElement = listRef.current?.children[selectedIndex] as HTMLElement
    selectedElement?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  if (loading) {
    return (
      <div
        className="absolute z-50 bg-white border border-slate-200 rounded-lg shadow-lg p-3"
        style={{ top: position.top, left: position.left }}
      >
        <p className="text-sm text-slate-500">Searching...</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div
        className="absolute z-50 bg-white border border-slate-200 rounded-lg shadow-lg p-3"
        style={{ top: position.top, left: position.left }}
      >
        <p className="text-sm text-slate-500">No entities found</p>
      </div>
    )
  }

  return (
    <ul
      ref={listRef}
      className="absolute z-50 bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-y-auto w-72"
      style={{ top: position.top, left: position.left }}
    >
      {results.map((result, index) => {
        const Icon = entityIcons[result.type]
        const colorClass = entityColors[result.type]
        return (
          <li
            key={`${result.type}-${result.id}`}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${
              index === selectedIndex ? 'bg-slate-100' : 'hover:bg-slate-50'
            }`}
            onClick={() => onSelect(result)}
          >
            <span className={`p-1.5 rounded ${colorClass}`}>
              <Icon className="w-4 h-4" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{result.name}</p>
              <p className="text-xs text-slate-500 capitalize">{result.type}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
