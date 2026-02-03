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
  const [isCreating, setIsCreating] = useState(false)
  const [newWorldName, setNewWorldName] = useState('')

  async function loadWorlds() {
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('worlds')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setWorlds(data as World[])
      // Set first world as current if available
      if (data.length > 0) {
        const savedWorldId = localStorage.getItem('currentWorldId')
        const savedWorld = (data as World[]).find(w => w.id === savedWorldId)
        setCurrentWorld(savedWorld || data[0])
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    loadWorlds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function createWorld() {
    if (!newWorldName.trim()) return

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('worlds')
      .insert({ user_id: user.id, name: newWorldName.trim() })
      .select()
      .single()

    if (!error && data) {
      const newWorld = data as World
      setWorlds([newWorld, ...worlds])
      setCurrentWorld(newWorld)
      localStorage.setItem('currentWorldId', newWorld.id)
      setNewWorldName('')
      setIsCreating(false)
      setIsOpen(false)
    }
  }

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

  if (worlds.length === 0 || isCreating) {
    return (
      <div className="space-y-2">
        <input
          type="text"
          value={newWorldName}
          onChange={(e) => setNewWorldName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && createWorld()}
          placeholder="Enter world name..."
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400 transition-all duration-200"
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={createWorld}
            disabled={!newWorldName.trim()}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 text-white rounded-xl text-sm font-medium hover:from-cyan-500 hover:to-teal-500 transition-all duration-200 disabled:opacity-50"
          >
            Create World
          </button>
          {worlds.length > 0 && (
            <button
              onClick={() => setIsCreating(false)}
              className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
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
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-cyan-50/50 transition-colors ${
                  currentWorld?.id === world.id ? 'bg-cyan-50 text-cyan-600' : 'text-slate-700'
                }`}
              >
                <Globe className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{world.name}</span>
              </button>
            ))}
          </div>
          <div className="border-t border-slate-200">
            <button
              onClick={() => { setIsCreating(true); setIsOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-cyan-600 hover:bg-cyan-50 transition-colors"
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
