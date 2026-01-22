import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Clock, Users, MapPin } from 'lucide-react'
import { Button, Badge, Card, CardContent, ConfirmDialog } from '@/components/ui'
import type { WorldEvent } from '@/types/database'

interface EventDetailProps {
  event: WorldEvent
  onEdit: () => void
  onDelete: () => Promise<boolean>
}

const typeColors: Record<string, 'amber' | 'sky' | 'violet' | 'emerald'> = {
  historical: 'amber',
  plot_point: 'sky',
  scheduled: 'violet',
  recurring: 'emerald',
}

export function EventDetail({ event, onEdit, onDelete }: EventDetailProps) {
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    const success = await onDelete()
    setDeleting(false)
    if (success) {
      setShowDeleteConfirm(false)
      navigate('/timeline')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate('/timeline')}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Timeline
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                {event.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {event.type && (
                  <Badge variant={typeColors[event.type] || 'slate'}>
                    {event.type.replace('_', ' ')}
                  </Badge>
                )}
                {event.date && (
                  <span className="text-slate-500 dark:text-slate-400">{event.date}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onEdit} icon={<Edit className="w-4 h-4" />}>
            Edit
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowDeleteConfirm(true)}
            icon={<Trash2 className="w-4 h-4" />}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {event.description && (
          <Card>
            <CardContent>
              <h3 className="font-medium text-slate-900 dark:text-white mb-2">Description</h3>
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                {event.description}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {event.causes && (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Causes</h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {event.causes}
                </p>
              </CardContent>
            </Card>
          )}
          {event.consequences && (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Consequences</h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {event.consequences}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-slate-400" />
                <h3 className="font-medium text-slate-900 dark:text-white">Participants</h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No participants linked yet
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-slate-400" />
                <h3 className="font-medium text-slate-900 dark:text-white">Location</h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No location linked yet
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${event.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  )
}
