'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Globe, FileText, Plus, Sparkles, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { setCurrentWorldId } from '@/lib/utils/world-context'
import type { World } from '@/lib/types/database'

interface WorldOnboardingProps {
  isOpen: boolean
  onClose: () => void
  onWorldCreated: (world: World) => void
}

export function WorldOnboarding({ isOpen, onClose, onWorldCreated }: WorldOnboardingProps) {
  const [mode, setMode] = useState<'choose' | 'create'>('choose')
  const [worldName, setWorldName] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  async function handleCreate() {
    if (!worldName.trim()) return
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('Please log in to create a world')
        setLoading(false)
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('worlds')
        .insert({ user_id: user.id, name: worldName.trim() })
        .select()
        .single()

      if (error) {
        console.error('Error creating world:', error)
        alert('Failed to create world. Please try again.')
        setLoading(false)
        return
      }

      if (data) {
        const newWorld = data as World
        setCurrentWorldId(newWorld.id)
        // Refresh to update server components with new cookie
        window.location.reload()
      }
    } catch (err) {
      console.error('Error creating world:', err)
      alert('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl">
              <Globe className="w-5 h-5 text-cyan-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              {mode === 'choose' ? 'Welcome to Vixio' : 'Create New World'}
            </h2>
          </div>
          {mode === 'create' && (
            <button
              onClick={() => setMode('choose')}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {mode === 'choose' ? (
            <>
              <p className="text-slate-600 mb-6">
                Get started by creating a new world or importing an existing one from your documents.
              </p>

              <div className="grid gap-4">
                {/* Import Option - Use Link for reliable navigation */}
                <Link
                  href="/import"
                  className="group flex items-start gap-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-200 text-left"
                >
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow transition-shadow">
                    <FileText className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">Import from Document</h3>
                      <span className="px-2 py-0.5 bg-amber-200 text-amber-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI-Powered
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                      Paste your story, script, or world bible and let AI extract characters, locations, and more.
                    </p>
                  </div>
                </Link>

                {/* Create Option */}
                <button
                  onClick={() => setMode('create')}
                  className="group flex items-start gap-4 p-4 bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200 rounded-xl hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 text-left"
                >
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow transition-shadow">
                    <Plus className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Create from Scratch</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Start with a blank world and build it step by step.
                    </p>
                  </div>
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-slate-600 mb-4">
                Give your world a name to get started.
              </p>

              <input
                type="text"
                value={worldName}
                onChange={(e) => setWorldName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="e.g., Middle Earth, Westeros, My Story World..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400 transition-all duration-200 text-lg"
                autoFocus
              />

              <button
                onClick={handleCreate}
                disabled={!worldName.trim() || loading}
                className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-cyan-400 to-teal-400 text-white font-medium rounded-xl hover:from-cyan-500 hover:to-teal-500 focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-500/20"
              >
                {loading ? 'Creating...' : 'Create World'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
