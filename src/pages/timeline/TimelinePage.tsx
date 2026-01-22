import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSupabaseCRUD } from '@/lib/hooks'
import { useToast } from '@/components/ui'
import { EventList, EventForm, EventDetail } from './components'
import type { WorldEvent } from '@/types/database'

export function TimelinePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const { data: events, loading, create, update, remove, getById } = useSupabaseCRUD<WorldEvent>({
    table: 'events',
    orderBy: { column: 'date_sort', ascending: true },
  })

  const [selectedEvent, setSelectedEvent] = useState<WorldEvent | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<WorldEvent | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    async function loadEvent() {
      if (id) {
        const event = await getById(id)
        setSelectedEvent(event)
      } else {
        setSelectedEvent(null)
      }
    }
    loadEvent()
  }, [id, getById])

  const handleSelect = (event: WorldEvent) => navigate(`/timeline/${event.id}`)
  const handleCreateNew = () => {
    setEditingEvent(null)
    setShowForm(true)
  }
  const handleEdit = () => {
    if (selectedEvent) {
      setEditingEvent(selectedEvent)
      setShowForm(true)
    }
  }

  const handleSave = async (data: Partial<WorldEvent>): Promise<boolean> => {
    setFormLoading(true)
    try {
      if (editingEvent) {
        const updated = await update(editingEvent.id, data)
        if (updated) {
          setSelectedEvent(updated)
          toast.success('Event updated successfully')
          return true
        }
      } else {
        const created = await create(data as Omit<WorldEvent, 'id' | 'created_at' | 'updated_at'>)
        if (created) {
          toast.success('Event created successfully')
          navigate(`/timeline/${created.id}`)
          return true
        }
      }
      toast.error('Failed to save event')
      return false
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (): Promise<boolean> => {
    if (!selectedEvent) return false
    const success = await remove(selectedEvent.id)
    if (success) toast.success('Event deleted successfully')
    else toast.error('Failed to delete event')
    return success
  }

  if (selectedEvent) {
    return (
      <>
        <EventDetail event={selectedEvent} onEdit={handleEdit} onDelete={handleDelete} />
        <EventForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          event={editingEvent}
          loading={formLoading}
        />
      </>
    )
  }

  if (id && !selectedEvent) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </div>
    )
  }

  return (
    <>
      <EventList events={events} loading={loading} onSelect={handleSelect} onCreateNew={handleCreateNew} />
      <EventForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSave}
        event={editingEvent}
        loading={formLoading}
      />
    </>
  )
}
