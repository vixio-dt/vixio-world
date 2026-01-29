'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Plus, Globe } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { World } from '@/lib/types/database'

export function WorldSwitcher() {
  const [worlds, setWorlds] = useState<World[]>([])
  const [currentWorld, setCurrentWorld] = useState<World | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadWorlds() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('worlds')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setWorlds(data)
        // Set first world as current if available
        if (data.length > 0 && !currentWorld) {
          setCurrentWorld(data[0])
        }
      }
      setLoading(false)
    }

    loadWorlds()
  }, [currentWorld])

  function selectWorld(world: World) {
    setCurrentWorld(world)
    setIsOpen(false)
    // Store in localStorage for persistence
    localStorage.setItem('currentWorldId', world.id)
  }

  if (loading) {
    return (
      <div className="animate-pulse bg-slate-100 h-10 rounded-lg" />
    )
  }

  if (worlds.length === 0) {
    return (
      <button
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-sky-50 text-sky-600 rounded-lg text-sm font-medium hover:bg-sky-100 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Create your first world
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2 truncate">
          <Globe className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <span className="truncate">{currentWorld?.name || 'Select world'}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {worlds.map((world) => (
              <button
                key={world.id}
                onClick={() => selectWorld(world)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-slate-50 transition-colors ${
                  currentWorld?.id === world.id ? 'bg-sky-50 text-sky-600' : 'text-slate-700'
                }`}
              >
                <Globe className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{world.name}</span>
              </button>
            ))}
          </div>
          <div className="border-t border-slate-200">
            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-sky-600 hover:bg-sky-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create new world
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
