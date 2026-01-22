import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Building2, Users, MapPin, Shield } from 'lucide-react'
import { Button, Badge, Tabs, TabList, Tab, TabPanel, Card, CardContent, ConfirmDialog } from '@/components/ui'
import type { Organization } from '@/types/database'

interface OrganizationDetailProps {
  organization: Organization
  onEdit: () => void
  onDelete: () => Promise<boolean>
}

const typeColors: Record<string, 'violet' | 'sky' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'slate'> = {
  government: 'sky',
  religion: 'violet',
  corporation: 'emerald',
  guild: 'amber',
  family: 'rose',
  military: 'slate',
  secret_society: 'cyan',
}

export function OrganizationDetail({ organization, onEdit, onDelete }: OrganizationDetailProps) {
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    const success = await onDelete()
    setDeleting(false)
    if (success) {
      setShowDeleteConfirm(false)
      navigate('/organizations')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate('/organizations')}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Organizations
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                {organization.name}
              </h1>
              {organization.type && (
                <Badge variant={typeColors[organization.type] || 'slate'} className="mt-1">
                  {organization.type.replace('_', ' ')}
                </Badge>
              )}
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

      <Tabs defaultTab="overview">
        <TabList>
          <Tab value="overview">Overview</Tab>
          <Tab value="members">Members</Tab>
          <Tab value="relations">Relations</Tab>
          <Tab value="history">History</Tab>
        </TabList>

        <TabPanel value="overview" className="mt-6 space-y-6">
          {organization.purpose && (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Purpose</h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {organization.purpose}
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {organization.structure && (
              <Card>
                <CardContent>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-2">Structure</h3>
                  <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                    {organization.structure}
                  </p>
                </CardContent>
              </Card>
            )}
            {organization.leadership && (
              <Card>
                <CardContent>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-2">Leadership</h3>
                  <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                    {organization.leadership}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {organization.territory && (
              <Card>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <h3 className="font-medium text-slate-900 dark:text-white">Territory</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{organization.territory}</p>
                </CardContent>
              </Card>
            )}
            {organization.resources && (
              <Card>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <h3 className="font-medium text-slate-900 dark:text-white">Resources</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{organization.resources}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {organization.beliefs && (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Beliefs</h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {organization.beliefs}
                </p>
              </CardContent>
            </Card>
          )}

          {organization.symbols && (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Symbols</h3>
                <p className="text-slate-600 dark:text-slate-400">{organization.symbols}</p>
              </CardContent>
            </Card>
          )}
        </TabPanel>

        <TabPanel value="members" className="mt-6">
          <Card>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-slate-400" />
                <h3 className="font-medium text-slate-900 dark:text-white">Member Roster</h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No members assigned yet. Link characters to this organization to see them here.
              </p>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value="relations" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-4">Allies</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">No allies defined yet</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-4">Enemies</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">No enemies defined yet</p>
              </CardContent>
            </Card>
          </div>
        </TabPanel>

        <TabPanel value="history" className="mt-6">
          {organization.history ? (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">History</h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {organization.history}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">No history documented yet</p>
                <Button variant="secondary" onClick={onEdit} className="mt-4">
                  Add History
                </Button>
              </CardContent>
            </Card>
          )}
        </TabPanel>
      </Tabs>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Organization"
        message={`Are you sure you want to delete "${organization.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  )
}
