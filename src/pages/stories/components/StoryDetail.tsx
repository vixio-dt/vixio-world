import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, BookOpen, Plus, Film, Video, ChevronRight, ChevronDown } from 'lucide-react'
import { Button, Badge, Card, CardContent, ConfirmDialog } from '@/components/ui'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui'
import { SceneForm } from './SceneForm'
import { ShotForm } from './ShotForm'
import type { Story, Scene, Shot } from '@/types/database'

interface StoryDetailProps {
  story: Story
  onEdit: () => void
  onDelete: () => Promise<boolean>
}

const statusColors: Record<string, 'slate' | 'amber' | 'sky' | 'emerald'> = {
  concept: 'slate',
  outline: 'amber',
  draft: 'sky',
  complete: 'emerald',
}

export function StoryDetail({ story, onEdit, onDelete }: StoryDetailProps) {
  const navigate = useNavigate()
  const toast = useToast()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Scenes and shots
  const [scenes, setScenes] = useState<Scene[]>([])
  const [shotsMap, setShotsMap] = useState<Record<string, Shot[]>>({})
  const [loadingScenes, setLoadingScenes] = useState(true)
  const [expandedScenes, setExpandedScenes] = useState<Set<string>>(new Set())

  // Forms
  const [showSceneForm, setShowSceneForm] = useState(false)
  const [editingScene, setEditingScene] = useState<Scene | null>(null)
  const [showShotForm, setShowShotForm] = useState(false)
  const [editingShot, setEditingShot] = useState<Shot | null>(null)
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  // Fetch scenes
  useEffect(() => {
    async function fetchScenes() {
      setLoadingScenes(true)
      const { data, error } = await supabase
        .from('scenes')
        .select('*')
        .eq('story_id', story.id)
        .order('scene_number', { ascending: true })
      if (error) {
        console.error('Error fetching scenes:', error)
      } else {
        setScenes(data || [])
        // Fetch shots for all scenes
        if (data && data.length > 0) {
          const sceneIds = (data as Scene[]).map(s => s.id)
          const { data: shotsData } = await supabase
            .from('shots')
            .select('*')
            .in('scene_id', sceneIds)
            .order('shot_number', { ascending: true })
          if (shotsData) {
            const map: Record<string, Shot[]> = {}
            ;(shotsData as Shot[]).forEach(shot => {
              if (!map[shot.scene_id]) map[shot.scene_id] = []
              map[shot.scene_id].push(shot)
            })
            setShotsMap(map)
          }
        }
      }
      setLoadingScenes(false)
    }
    fetchScenes()
  }, [story.id])

  const handleDelete = async () => {
    setDeleting(true)
    const success = await onDelete()
    setDeleting(false)
    if (success) {
      setShowDeleteConfirm(false)
      navigate('/stories')
    }
  }

  const toggleScene = (sceneId: string) => {
    setExpandedScenes(prev => {
      const next = new Set(prev)
      if (next.has(sceneId)) next.delete(sceneId)
      else next.add(sceneId)
      return next
    })
  }

  // Scene CRUD
  const handleCreateScene = () => {
    setEditingScene(null)
    setShowSceneForm(true)
  }

  const handleEditScene = (scene: Scene) => {
    setEditingScene(scene)
    setShowSceneForm(true)
  }

  const handleSaveScene = async (sceneData: Partial<Scene>): Promise<boolean> => {
    setFormLoading(true)
    try {
      if (editingScene) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: updated, error } = await (supabase as any)
          .from('scenes')
          .update(sceneData)
          .eq('id', editingScene.id)
          .select()
          .single()
        if (error) throw error
        setScenes(prev => prev.map(s => s.id === editingScene.id ? (updated as Scene) : s))
        toast.success('Scene updated')
        return true
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: created, error } = await (supabase as any)
          .from('scenes')
          .insert({ ...sceneData, story_id: story.id })
          .select()
          .single()
        if (error) throw error
        setScenes(prev => [...prev, created as Scene].sort((a, b) => a.scene_number - b.scene_number))
        toast.success('Scene created')
        return true
      }
    } catch (err) {
      toast.error('Failed to save scene')
      return false
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteScene = async (sceneId: string) => {
    const { error } = await supabase.from('scenes').delete().eq('id', sceneId)
    if (error) {
      toast.error('Failed to delete scene')
    } else {
      setScenes(prev => prev.filter(s => s.id !== sceneId))
      toast.success('Scene deleted')
    }
  }

  // Shot CRUD
  const handleCreateShot = (sceneId: string) => {
    setCurrentSceneId(sceneId)
    setEditingShot(null)
    setShowShotForm(true)
  }

  const handleEditShot = (shot: Shot) => {
    setCurrentSceneId(shot.scene_id)
    setEditingShot(shot)
    setShowShotForm(true)
  }

  const handleSaveShot = async (shotData: Partial<Shot>): Promise<boolean> => {
    if (!currentSceneId) return false
    setFormLoading(true)
    try {
      if (editingShot) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: updated, error } = await (supabase as any)
          .from('shots')
          .update(shotData)
          .eq('id', editingShot.id)
          .select()
          .single()
        if (error) throw error
        setShotsMap(prev => ({
          ...prev,
          [currentSceneId]: (prev[currentSceneId] || []).map(s => s.id === editingShot.id ? (updated as Shot) : s),
        }))
        toast.success('Shot updated')
        return true
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: created, error } = await (supabase as any)
          .from('shots')
          .insert({ ...shotData, scene_id: currentSceneId })
          .select()
          .single()
        if (error) throw error
        setShotsMap(prev => ({
          ...prev,
          [currentSceneId]: [...(prev[currentSceneId] || []), created as Shot].sort((a, b) => a.shot_number - b.shot_number),
        }))
        toast.success('Shot created')
        return true
      }
    } catch (err) {
      toast.error('Failed to save shot')
      return false
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteShot = async (shotId: string, sceneId: string) => {
    const { error } = await supabase.from('shots').delete().eq('id', shotId)
    if (error) {
      toast.error('Failed to delete shot')
    } else {
      setShotsMap(prev => ({
        ...prev,
        [sceneId]: (prev[sceneId] || []).filter(s => s.id !== shotId),
      }))
      toast.success('Shot deleted')
    }
  }

  const nextSceneNumber = scenes.length > 0 ? Math.max(...scenes.map(s => s.scene_number)) + 1 : 1
  const getNextShotNumber = (sceneId: string) => {
    const shots = shotsMap[sceneId] || []
    return shots.length > 0 ? Math.max(...shots.map(s => s.shot_number)) + 1 : 1
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button onClick={() => navigate('/stories')} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Stories
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{story.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                {story.status && <Badge variant={statusColors[story.status] || 'slate'}>{story.status}</Badge>}
                {story.genre && <span className="text-slate-500">{story.genre}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onEdit} icon={<Edit className="w-4 h-4" />}>Edit</Button>
          <Button variant="ghost" onClick={() => setShowDeleteConfirm(true)} icon={<Trash2 className="w-4 h-4" />} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Delete</Button>
        </div>
      </div>

      {/* Story Info */}
      {(story.logline || story.tone || story.theme) && (
        <Card>
          <CardContent className="space-y-3">
            {story.logline && <div><span className="font-medium text-slate-900 dark:text-white">Logline:</span> <span className="text-slate-600 dark:text-slate-400">{story.logline}</span></div>}
            <div className="flex gap-6">
              {story.tone && <div><span className="font-medium text-slate-900 dark:text-white">Tone:</span> <span className="text-slate-600 dark:text-slate-400">{story.tone}</span></div>}
              {story.theme && <div><span className="font-medium text-slate-900 dark:text-white">Theme:</span> <span className="text-slate-600 dark:text-slate-400">{story.theme}</span></div>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scenes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Scenes ({scenes.length})</h2>
          <Button onClick={handleCreateScene} size="sm" icon={<Plus className="w-4 h-4" />}>Add Scene</Button>
        </div>

        {loadingScenes ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />)}
          </div>
        ) : scenes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Film className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No scenes yet. Add your first scene to start building your story.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {scenes.map(scene => {
              const shots = shotsMap[scene.id] || []
              const isExpanded = expandedScenes.has(scene.id)
              return (
                <Card key={scene.id}>
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleScene(scene.id)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                        {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                      </button>
                      <Film className="w-5 h-5 text-indigo-500" />
                      <div className="flex-1">
                        <span className="font-medium text-slate-900 dark:text-white">Scene {scene.scene_number}</span>
                        {scene.time && <span className="text-sm text-slate-500 ml-2">• {scene.time}</span>}
                        {scene.purpose && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{scene.purpose}</p>}
                      </div>
                      <span className="text-xs text-slate-400">{shots.length} shot{shots.length !== 1 ? 's' : ''}</span>
                      <Button size="sm" variant="ghost" onClick={() => handleEditScene(scene)}>Edit</Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteScene(scene.id)} className="text-red-500">Delete</Button>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 ml-8 space-y-2">
                        {scene.summary && <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{scene.summary}</p>}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Shots</span>
                          <Button size="sm" variant="secondary" onClick={() => handleCreateShot(scene.id)} icon={<Plus className="w-3 h-3" />}>Add Shot</Button>
                        </div>
                        {shots.length === 0 ? (
                          <p className="text-sm text-slate-400 py-2">No shots yet</p>
                        ) : (
                          <div className="space-y-1">
                            {shots.map(shot => (
                              <div key={shot.id} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <Video className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Shot {shot.shot_number}</span>
                                {shot.shot_type && <Badge size="sm" variant="slate">{shot.shot_type.replace('_', ' ')}</Badge>}
                                {shot.description && <span className="text-sm text-slate-500 truncate flex-1">{shot.description}</span>}
                                <Button size="sm" variant="ghost" onClick={() => handleEditShot(shot)}>Edit</Button>
                                <Button size="sm" variant="ghost" onClick={() => handleDeleteShot(shot.id, scene.id)} className="text-red-500">Delete</Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Forms */}
      <SceneForm isOpen={showSceneForm} onClose={() => setShowSceneForm(false)} onSave={handleSaveScene} scene={editingScene} nextSceneNumber={nextSceneNumber} loading={formLoading} />
      <ShotForm isOpen={showShotForm} onClose={() => setShowShotForm(false)} onSave={handleSaveShot} shot={editingShot} nextShotNumber={currentSceneId ? getNextShotNumber(currentSceneId) : 1} loading={formLoading} />
      <ConfirmDialog isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={handleDelete} title="Delete Story" message={`Are you sure you want to delete "${story.title}"? All scenes and shots will also be deleted.`} confirmLabel="Delete" loading={deleting} />
    </div>
  )
}
