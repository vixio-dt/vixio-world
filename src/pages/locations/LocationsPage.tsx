import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSupabaseCRUD } from '@/lib/hooks'
import { useToast } from '@/components/ui'
import { LocationList, LocationForm, LocationDetail } from './components'
import type { Location } from '@/types/database'

export function LocationsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const {
    data: locations,
    loading,
    create,
    update,
    remove,
    getById,
  } = useSupabaseCRUD<Location>({ table: 'locations' })

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  // Load location when URL has ID
  useEffect(() => {
    async function loadLocation() {
      if (id) {
        const location = await getById(id)
        setSelectedLocation(location)
      } else {
        setSelectedLocation(null)
      }
    }
    loadLocation()
  }, [id, getById])

  // Get parent and child locations
  const parentLocation = useMemo(() => {
    if (!selectedLocation?.parent_location_id) return null
    return locations.find(l => l.id === selectedLocation.parent_location_id) || null
  }, [selectedLocation, locations])

  const childLocations = useMemo(() => {
    if (!selectedLocation) return []
    return locations.filter(l => l.parent_location_id === selectedLocation.id)
  }, [selectedLocation, locations])

  const handleSelect = (location: Location) => {
    navigate(`/locations/${location.id}`)
  }

  const handleCreateNew = () => {
    setEditingLocation(null)
    setShowForm(true)
  }

  const handleEdit = () => {
    if (selectedLocation) {
      setEditingLocation(selectedLocation)
      setShowForm(true)
    }
  }

  const handleSave = async (data: Partial<Location>): Promise<boolean> => {
    setFormLoading(true)
    try {
      if (editingLocation) {
        const updated = await update(editingLocation.id, data)
        if (updated) {
          setSelectedLocation(updated)
          toast.success('Location updated successfully')
          return true
        }
      } else {
        const created = await create(data as Omit<Location, 'id' | 'created_at' | 'updated_at'>)
        if (created) {
          toast.success('Location created successfully')
          navigate(`/locations/${created.id}`)
          return true
        }
      }
      toast.error('Failed to save location')
      return false
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (): Promise<boolean> => {
    if (!selectedLocation) return false
    const success = await remove(selectedLocation.id)
    if (success) {
      toast.success('Location deleted successfully')
    } else {
      toast.error('Failed to delete location')
    }
    return success
  }

  // Show detail view if location is selected
  if (selectedLocation) {
    return (
      <>
        <LocationDetail
          location={selectedLocation}
          parentLocation={parentLocation}
          childLocations={childLocations}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelectLocation={handleSelect}
        />
        <LocationForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          location={editingLocation}
          allLocations={locations}
          loading={formLoading}
        />
      </>
    )
  }

  // Show loading state while fetching location by ID
  if (id && !selectedLocation) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </div>
    )
  }

  // Show list view
  return (
    <>
      <LocationList
        locations={locations}
        loading={loading}
        onSelect={handleSelect}
        onCreateNew={handleCreateNew}
      />
      <LocationForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSave}
        location={editingLocation}
        allLocations={locations}
        loading={formLoading}
      />
    </>
  )
}
