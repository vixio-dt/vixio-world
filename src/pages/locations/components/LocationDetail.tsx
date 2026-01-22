import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Users,
  Clock,
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
import type { Location } from '@/types/database'

interface LocationDetailProps {
  location: Location
  parentLocation?: Location | null
  childLocations: Location[]
  onEdit: () => void
  onDelete: () => Promise<boolean>
  onSelectLocation: (location: Location) => void
}

const typeColors: Record<string, 'emerald' | 'sky' | 'violet' | 'amber' | 'rose' | 'slate'> = {
  planet: 'violet',
  continent: 'sky',
  country: 'emerald',
  city: 'amber',
  district: 'rose',
  building: 'slate',
  room: 'slate',
}

export function LocationDetail({
  location,
  parentLocation,
  childLocations,
  onEdit,
  onDelete,
  onSelectLocation,
}: LocationDetailProps) {
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    const success = await onDelete()
    setDeleting(false)
    if (success) {
      setShowDeleteConfirm(false)
      navigate('/locations')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate('/locations')}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Locations
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                {location.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {location.type && (
                  <Badge variant={typeColors[location.type] || 'slate'}>
                    {location.type}
                  </Badge>
                )}
                {parentLocation && (
                  <button
                    onClick={() => onSelectLocation(parentLocation)}
                    className="text-sm text-slate-500 hover:text-sky-500 dark:text-slate-400"
                  >
                    {parentLocation.name}
                  </button>
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
          <Tab value="features">Features</Tab>
          <Tab value="production">Production</Tab>
          <Tab value="sub-locations">Sub-locations ({childLocations.length})</Tab>
        </TabList>

        <TabPanel value="overview" className="mt-6 space-y-6">
          {location.description && (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Description
                </h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {location.description}
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {location.atmosphere && (
              <Card>
                <CardContent>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                    Atmosphere
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                    {location.atmosphere}
                  </p>
                </CardContent>
              </Card>
            )}

            {location.climate && (
              <Card>
                <CardContent>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                    Climate
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                    {location.climate}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {location.history && (
            <Card>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <h3 className="font-medium text-slate-900 dark:text-white">
                    History
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {location.history}
                </p>
              </CardContent>
            </Card>
          )}

          {location.cultural_significance && (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Cultural Significance
                </h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {location.cultural_significance}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Inhabitants placeholder */}
          <Card>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-slate-400" />
                <h3 className="font-medium text-slate-900 dark:text-white">
                  Inhabitants
                </h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No character connections yet
              </p>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value="features" className="mt-6">
          {location.key_features ? (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Key Features
                </h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {location.key_features}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">
                  No key features documented yet
                </p>
                <Button variant="secondary" onClick={onEdit} className="mt-4">
                  Add Features
                </Button>
              </CardContent>
            </Card>
          )}
        </TabPanel>

        <TabPanel value="production" className="mt-6 space-y-6">
          {location.visual_references && (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Visual References
                </h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {location.visual_references}
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {location.lighting_notes && (
              <Card>
                <CardContent>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                    Lighting Notes
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                    {location.lighting_notes}
                  </p>
                </CardContent>
              </Card>
            )}

            {location.sound_notes && (
              <Card>
                <CardContent>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                    Sound Notes
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                    {location.sound_notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {location.asset_requirements && (
            <Card>
              <CardContent>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Asset Requirements
                </h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {location.asset_requirements}
                </p>
              </CardContent>
            </Card>
          )}

          {!location.visual_references &&
            !location.lighting_notes &&
            !location.sound_notes &&
            !location.asset_requirements && (
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

        <TabPanel value="sub-locations" className="mt-6">
          {childLocations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {childLocations.map(child => (
                <Card
                  key={child.id}
                  hoverable
                  onClick={() => onSelectLocation(child)}
                  className="p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        {child.name}
                      </h3>
                      {child.type && (
                        <span className="text-xs text-slate-500">
                          {child.type}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">
                  No sub-locations yet
                </p>
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
        title="Delete Location"
        message={`Are you sure you want to delete "${location.name}"? ${
          childLocations.length > 0
            ? `This will also affect ${childLocations.length} sub-location(s).`
            : ''
        } This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  )
}
