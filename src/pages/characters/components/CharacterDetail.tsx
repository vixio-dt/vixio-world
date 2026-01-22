import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  Building2,
  MapPin,
} from 'lucide-react'
import {
  Button,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Card,
  CardContent,
  ConfirmDialog,
} from '@/components/ui'
import type { Character } from '@/types/database'

interface CharacterDetailProps {
  character: Character
  onEdit: () => void
  onDelete: () => Promise<boolean>
}

const roleColors: Record<string, 'sky' | 'rose' | 'violet' | 'slate'> = {
  protagonist: 'sky',
  antagonist: 'rose',
  supporting: 'violet',
  background: 'slate',
}

export function CharacterDetail({
  character,
  onEdit,
  onDelete,
}: CharacterDetailProps) {
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    const success = await onDelete()
    setDeleting(false)
    if (success) {
      setShowDeleteConfirm(false)
      navigate('/characters')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate('/characters')}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Characters
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                {character.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {character.role && (
                  <Badge variant={roleColors[character.role] || 'slate'}>
                    {character.role}
                  </Badge>
                )}
                {character.species && (
                  <span className="text-slate-500 dark:text-slate-400">
                    {character.species}
                  </span>
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

      {/* Tabs */}
      <Tabs defaultTab="overview">
        <TabList>
          <Tab value="overview">Overview</Tab>
          <Tab value="background">Background</Tab>
          <Tab value="relationships">Relationships</Tab>
          <Tab value="production">Production</Tab>
        </TabList>

        <TabPanel value="overview" className="mt-6 space-y-6">
          {character.aliases && character.aliases.length > 0 && (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Also Known As
                </h3>
                <div className="flex flex-wrap gap-2">
                  {character.aliases.map((alias, i) => (
                    <Badge key={i} variant="slate">
                      {alias}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {character.appearance && (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Appearance
                </h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {character.appearance}
                </p>
              </CardContent>
            </Card>
          )}

          {character.personality && (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Personality
                </h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {character.personality}
                </p>
              </CardContent>
            </Card>
          )}

          {character.motivations && (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Motivations
                </h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {character.motivations}
                </p>
              </CardContent>
            </Card>
          )}

          {character.arc_potential && (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Arc Potential
                </h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {character.arc_potential}
                </p>
              </CardContent>
            </Card>
          )}
        </TabPanel>

        <TabPanel value="background" className="mt-6">
          {character.background ? (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Background
                </h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {character.background}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">
                  No background information yet
                </p>
                <Button variant="secondary" onClick={onEdit} className="mt-4">
                  Add Background
                </Button>
              </CardContent>
            </Card>
          )}
        </TabPanel>

        <TabPanel value="relationships" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-slate-400" />
                  <h3 className="font-medium text-slate-900 dark:text-white">
                    Organizations
                  </h3>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  No organization memberships yet
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <h3 className="font-medium text-slate-900 dark:text-white">
                    Locations
                  </h3>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  No location connections yet
                </p>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-slate-400" />
                  <h3 className="font-medium text-slate-900 dark:text-white">
                    Character Relationships
                  </h3>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  No relationships defined yet
                </p>
              </CardContent>
            </Card>
          </div>
        </TabPanel>

        <TabPanel value="production" className="mt-6 space-y-6">
          {character.visual_references && (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Visual References
                </h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {character.visual_references}
                </p>
              </CardContent>
            </Card>
          )}

          {character.voice_notes && (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Voice Notes
                </h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {character.voice_notes}
                </p>
              </CardContent>
            </Card>
          )}

          {character.movement_notes && (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Movement Notes
                </h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {character.movement_notes}
                </p>
              </CardContent>
            </Card>
          )}

          {!character.visual_references &&
            !character.voice_notes &&
            !character.movement_notes && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-slate-500 dark:text-slate-400">
                    No production notes yet
                  </p>
                  <Button variant="secondary" onClick={onEdit} className="mt-4">
                    Add Production Notes
                  </Button>
                </CardContent>
              </Card>
            )}
        </TabPanel>
      </Tabs>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Character"
        message={`Are you sure you want to delete "${character.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  )
}
