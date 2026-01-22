import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Scale } from 'lucide-react'
import { Button, Badge, Card, CardContent, ConfirmDialog } from '@/components/ui'
import type { Rule } from '@/types/database'

interface RuleDetailProps {
  rule: Rule
  onEdit: () => void
  onDelete: () => Promise<boolean>
}

const categoryColors: Record<string, 'sky' | 'violet' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'slate'> = {
  physics: 'sky',
  magic: 'violet',
  technology: 'cyan',
  biology: 'emerald',
  social: 'amber',
  political: 'rose',
  economic: 'slate',
  temporal: 'sky',
  cosmological: 'violet',
}

export function RuleDetail({ rule, onEdit, onDelete }: RuleDetailProps) {
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    const success = await onDelete()
    setDeleting(false)
    if (success) {
      setShowDeleteConfirm(false)
      navigate('/rules')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate('/rules')}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Rules
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
              <Scale className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              {rule.code && (
                <span className="text-sm font-mono text-slate-500 dark:text-slate-400">{rule.code}</span>
              )}
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{rule.name}</h1>
              {rule.category && (
                <Badge variant={categoryColors[rule.category] || 'slate'} className="mt-1">
                  {rule.category}
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
        {rule.statement && (
          <Card>
            <CardContent>
              <h3 className="font-medium text-slate-900 dark:text-white mb-2">Statement</h3>
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap text-lg">{rule.statement}</p>
            </CardContent>
          </Card>
        )}

        {rule.scope && (
          <Card>
            <CardContent>
              <h3 className="font-medium text-slate-900 dark:text-white mb-2">Scope</h3>
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{rule.scope}</p>
            </CardContent>
          </Card>
        )}

        {rule.exceptions && (
          <Card>
            <CardContent>
              <h3 className="font-medium text-slate-900 dark:text-white mb-2">Exceptions</h3>
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{rule.exceptions}</p>
            </CardContent>
          </Card>
        )}

        {rule.consequences && (
          <Card>
            <CardContent>
              <h3 className="font-medium text-slate-900 dark:text-white mb-2">Consequences</h3>
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{rule.consequences}</p>
            </CardContent>
          </Card>
        )}

        {rule.examples && (
          <Card>
            <CardContent>
              <h3 className="font-medium text-slate-900 dark:text-white mb-2">Examples</h3>
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{rule.examples}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Rule"
        message={`Are you sure you want to delete "${rule.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  )
}
