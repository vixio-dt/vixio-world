'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Plus, Globe } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { setCurrentWorldId, getCurrentWorldId } from '@/lib/utils/world-context'
import { WorldOnboarding } from './WorldOnboarding'
import type { World } from '@/lib/types/database'

export function WorldSwitcher() {
  const [worlds, setWorlds] = useState<World[]>([])
  const [currentWorld, setCurrentWorld] = useState<World | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)

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
        const savedWorldId = getCurrentWorldId()
        const savedWorld = (data as World[]).find(w => w.id === savedWorldId)
        const worldToSelect = savedWorld || data[0]
        setCurrentWorld(worldToSelect)
        // Sync to both localStorage and cookie
        setCurrentWorldId(worldToSelect.id)
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    loadWorlds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function selectWorld(world: World) {
    setCurrentWorld(world)
    setIsOpen(false)
    // Sync to both localStorage and cookie
    setCurrentWorldId(world.id)
    // Refresh to update server components
    window.location.reload()
  }

  // Show onboarding when no worlds exist
  useEffect(() => {
    if (!loading && worlds.length === 0) {
      setShowOnboarding(true)
    }
  }, [loading, worlds.length])

  function handleWorldCreated(world: World) {
    setWorlds([world, ...worlds])
    setCurrentWorld(world)
    setShowOnboarding(false)
  }

  if (loading) {
    return (
      <div className="animate-pulse bg-slate-100 h-10 rounded-lg" />
    )
  }

  // When no worlds, show a button to open onboarding
  if (worlds.length === 0) {
    return (
      <>
        <button
          onClick={() => setShowOnboarding(true)}
          className="w-full px-3 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 text-white rounded-xl text-sm font-medium hover:from-cyan-500 hover:to-teal-500 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Get Started
        </button>
        <WorldOnboarding
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onWorldCreated={handleWorldCreated}
        />
      </>
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
              onClick={() => { setShowOnboarding(true); setIsOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-cyan-600 hover:bg-cyan-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create new world
            </button>
          </div>
        </div>
      )}

      {/* Onboarding modal for creating/importing worlds */}
      <WorldOnboarding
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onWorldCreated={handleWorldCreated}
      />
    </div>
  )
}
