'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { Search, Users, MapPin, Building2, Calendar, Package, Scale, BookOpen, X } from 'lucide-react'
import { searchEntities, type SearchResult } from '@/lib/actions/search'
import type { EntityType } from '@/lib/types/database'

interface CommandPaletteProps {
  worldId: string | null
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

const entityPaths: Record<EntityType, string> = {
  character: '/characters',
  location: '/locations',
  organization: '/organizations',
  event: '/timeline',
  item: '/items',
  rule: '/rules',
  story: '/stories',
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

export function CommandPalette({ worldId }: CommandPaletteProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  // Open/close with Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([])
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Search when query changes
  useEffect(() => {
    if (!isOpen || !worldId || !query.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const searchResults = await searchEntities(worldId, query, 10)
        setResults(searchResults)
        setSelectedIndex(0)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      }
      setLoading(false)
    }, 200)

    return () => clearTimeout(timer)
  }, [query, worldId, isOpen])

  const handleSelect = useCallback(
    (result: SearchResult) => {
      const path = entityPaths[result.type]
      router.push(`${path}/${result.id}`)
      setIsOpen(false)
    },
    [router]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % Math.max(results.length, 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1))
      } else if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault()
        handleSelect(results[selectedIndex])
      }
    },
    [results, selectedIndex, handleSelect]
  )

  if (!isOpen) return null

  const content = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative flex min-h-full items-start justify-center p-4 pt-[20vh]">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search entities..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 outline-none text-slate-900 placeholder-slate-400"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-100 rounded"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {!worldId ? (
              <p className="px-4 py-8 text-center text-slate-500">
                Select a world to search
              </p>
            ) : loading ? (
              <p className="px-4 py-8 text-center text-slate-500">Searching...</p>
            ) : query && results.length === 0 ? (
              <p className="px-4 py-8 text-center text-slate-500">
                No results found for &quot;{query}&quot;
              </p>
            ) : results.length > 0 ? (
              <ul className="py-2">
                {results.map((result, index) => {
                  const Icon = entityIcons[result.type]
                  const colorClass = entityColors[result.type]
                  return (
                    <li
                      key={`${result.type}-${result.id}`}
                      className={`flex items-center gap-3 px-4 py-2 cursor-pointer ${
                        index === selectedIndex ? 'bg-slate-100' : 'hover:bg-slate-50'
                      }`}
                      onClick={() => handleSelect(result)}
                    >
                      <span className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {result.name}
                        </p>
                        {result.description && (
                          <p className="text-xs text-slate-500 truncate">
                            {result.description}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 capitalize">
                        {result.type}
                      </span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="px-4 py-8 text-center text-slate-500">
                <p>Type to search entities</p>
                <p className="text-xs mt-2">
                  Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">↑</kbd>{' '}
                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">↓</kbd> to navigate,{' '}
                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">Enter</kbd> to select
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
            <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200">⌘K</kbd> to toggle
          </div>
        </div>
      </div>
    </div>
  )

  // Use portal to render at document root
  return typeof window !== 'undefined' ? createPortal(content, document.body) : null
}
