'use client'

import { useState } from 'react'
import { Globe, FileText, Plus, Sparkles, X, Rocket } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { setCurrentWorldId } from '@/lib/utils/world-context'
import { createTemplateWorld } from '@/lib/actions/seed-template'
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
  const [scriptLoading, setScriptLoading] = useState(false)
  const [referencesLoading, setReferencesLoading] = useState(false)
  const [templateLoading, setTemplateLoading] = useState(false)

  if (!isOpen) return null

  // Create a template project with sample data
  async function handleTemplate() {
    setTemplateLoading(true)
    
    try {
      const result = await createTemplateWorld()
      
      if (!result.success || !result.worldId) {
        alert(result.error || 'Failed to create demo project')
        setTemplateLoading(false)
        return
      }

      setCurrentWorldId(result.worldId)
      window.location.reload()
    } catch (err) {
      console.error('Error:', err)
      alert('An error occurred. Please try again.')
      setTemplateLoading(false)
    }
  }

  async function createProject(initialName: string) {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Please log in to create a project' }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('worlds')
      .insert({ user_id: user.id, name: initialName })
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', JSON.stringify(error, null, 2))
      return { error: error.message || JSON.stringify(error) }
    }

    return { world: data as World }
  }

  async function handleImport(entry: 'script-breakdown' | 'references') {
    if (entry === 'script-breakdown') {
      setScriptLoading(true)
    } else {
      setReferencesLoading(true)
    }
    
    try {
      const projectName =
        entry === 'script-breakdown' ? 'New Script Breakdown Project' : 'Imported References Project'
      const result = await createProject(projectName)

      if ('error' in result && result.error) {
        alert(result.error)
        if (entry === 'script-breakdown') {
          setScriptLoading(false)
        } else {
          setReferencesLoading(false)
        }
        return
      }

      if (result.world) {
        setCurrentWorldId(result.world.id)
        onWorldCreated(result.world)
        window.location.href = `/import?entry=${entry}`
      }
    } catch (err) {
      console.error('Error:', err)
      alert('An error occurred. Please try again.')
      if (entry === 'script-breakdown') {
        setScriptLoading(false)
      } else {
        setReferencesLoading(false)
      }
    }
  }

  async function handleCreate() {
    if (!worldName.trim()) return
    setLoading(true)

    try {
      const result = await createProject(worldName.trim())

      if ('error' in result && result.error) {
        alert(result.error)
        setLoading(false)
        return
      }

      if (result.world) {
        setCurrentWorldId(result.world.id)
        onWorldCreated(result.world)
        window.location.href = '/boards?entry=project-brief'
      }
    } catch (err) {
      console.error('Error creating project:', err)
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
              {mode === 'choose' ? 'Welcome to Vixio Studio' : 'Create New Project'}
            </h2>
          </div>
          <button
            onClick={mode === 'create' ? () => setMode('choose') : onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {mode === 'choose' ? (
            <>
              <p className="text-slate-600 mb-6">
                Choose how you want to start this project. Begin from a brief, break down a script, or bring in references you already have.
              </p>

              <div className="grid gap-4">
                {/* Template Option */}
                <button
                  type="button"
                  onClick={handleTemplate}
                  disabled={templateLoading}
                  className="group flex items-start gap-4 p-4 bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-wait"
                >
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow transition-shadow">
                    <Rocket className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {templateLoading ? 'Creating...' : 'Explore demo project'}
                      </h3>
                      <span className="px-2 py-0.5 bg-violet-200 text-violet-700 text-xs font-medium rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                      Open a pre-populated sample project to see the stage-based workflow in context.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('create')}
                  className="group flex items-start gap-4 p-4 bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200 rounded-xl hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 text-left"
                >
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow transition-shadow">
                    <Plus className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Start from project brief</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Create a new project from a concept, logline, tone, and reference direction.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleImport('script-breakdown')}
                  disabled={scriptLoading}
                  className="group flex items-start gap-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-wait"
                >
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow transition-shadow">
                    <FileText className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {scriptLoading ? 'Setting up...' : 'Start from script breakdown'}
                      </h3>
                      <span className="px-2 py-0.5 bg-amber-200 text-amber-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI-assisted
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                      Paste a screenplay or treatment and turn it into scenes, beats, and downstream boards.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleImport('references')}
                  disabled={referencesLoading}
                  className="group flex items-start gap-4 p-4 bg-gradient-to-br from-slate-50 to-zinc-50 border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-lg hover:shadow-slate-500/10 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-wait"
                >
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow transition-shadow">
                    <Sparkles className="w-6 h-6 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {referencesLoading ? 'Setting up...' : 'Import existing references'}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Bring in decks, notes, lookbooks, scripts, or worldbuilding docs as supporting canon.
                    </p>
                  </div>
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-slate-600 mb-4">
                Give your project a working title to start from a creative brief.
              </p>

              <input
                type="text"
                value={worldName}
                onChange={(e) => setWorldName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="e.g., Dream Architect, The Living City, Untitled pilot..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400 transition-all duration-200 text-lg"
                autoFocus
              />

              <button
                onClick={handleCreate}
                disabled={!worldName.trim() || loading}
                className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-cyan-400 to-teal-400 text-white font-medium rounded-xl hover:from-cyan-500 hover:to-teal-500 focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-500/20"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
