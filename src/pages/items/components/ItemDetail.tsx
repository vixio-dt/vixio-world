import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Package, Users, MapPin } from 'lucide-react'
import { Button, Badge, Card, CardContent, ConfirmDialog } from '@/components/ui'
import type { Item } from '@/types/database'

interface ItemDetailProps {
  item: Item
  onEdit: () => void
  onDelete: () => Promise<boolean>
}

const typeColors: Record<string, 'rose' | 'sky' | 'violet' | 'amber' | 'emerald' | 'slate' | 'cyan'> = {
  weapon: 'rose',
  vehicle: 'sky',
  artifact: 'violet',
  tool: 'slate',
  document: 'amber',
  clothing: 'emerald',
  technology: 'cyan',
}

export function ItemDetail({ item, onEdit, onDelete }: ItemDetailProps) {
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    const success = await onDelete()
    setDeleting(false)
    if (success) {
      setShowDeleteConfirm(false)
      navigate('/items')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate('/items')}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Items
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
              <Package className="w-8 h-8 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{item.name}</h1>
              {item.type && (
                <Badge variant={typeColors[item.type] || 'slate'} className="mt-1">
                  {item.type}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onEdit} icon={<Edit className="w-4 h-4" />}>Edit</Button>
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
        {item.description && (
          <Card>
            <CardContent>
              <h3 className="font-medium text-slate-900 dark:text-white mb-2">Description</h3>
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{item.description}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {item.function && (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Function</h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{item.function}</p>
              </CardContent>
            </Card>
          )}
          {item.origin && (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Origin</h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{item.origin}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {item.significance && (
          <Card>
            <CardContent>
              <h3 className="font-medium text-slate-900 dark:text-white mb-2">Significance</h3>
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{item.significance}</p>
            </CardContent>
          </Card>
        )}

        {item.rules && (
          <Card>
            <CardContent>
              <h3 className="font-medium text-slate-900 dark:text-white mb-2">Rules</h3>
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{item.rules}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-slate-400" />
                <h3 className="font-medium text-slate-900 dark:text-white">Owners</h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">No owners linked yet</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-slate-400" />
                <h3 className="font-medium text-slate-900 dark:text-white">Location</h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">No location linked yet</p>
            </CardContent>
          </Card>
        </div>

        {(item.visual_references || item.scale || item.material_notes) && (
          <Card>
            <CardContent>
              <h3 className="font-medium text-slate-900 dark:text-white mb-4">Production Notes</h3>
              <div className="space-y-3">
                {item.visual_references && (
                  <div><span className="text-sm font-medium text-slate-500">Visual:</span> <span className="text-slate-600 dark:text-slate-400">{item.visual_references}</span></div>
                )}
                {item.scale && (
                  <div><span className="text-sm font-medium text-slate-500">Scale:</span> <span className="text-slate-600 dark:text-slate-400">{item.scale}</span></div>
                )}
                {item.material_notes && (
                  <div><span className="text-sm font-medium text-slate-500">Materials:</span> <span className="text-slate-600 dark:text-slate-400">{item.material_notes}</span></div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Item"
        message={`Are you sure you want to delete "${item.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  )
}
