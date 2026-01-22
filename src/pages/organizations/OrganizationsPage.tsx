import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSupabaseCRUD } from '@/lib/hooks'
import { useToast } from '@/components/ui'
import { OrganizationList, OrganizationForm, OrganizationDetail } from './components'
import type { Organization } from '@/types/database'

export function OrganizationsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const { data: organizations, loading, create, update, remove, getById } = useSupabaseCRUD<Organization>({
    table: 'organizations',
  })

  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    async function loadOrganization() {
      if (id) {
        const org = await getById(id)
        setSelectedOrganization(org)
      } else {
        setSelectedOrganization(null)
      }
    }
    loadOrganization()
  }, [id, getById])

  const handleSelect = (org: Organization) => {
    navigate(`/organizations/${org.id}`)
  }

  const handleCreateNew = () => {
    setEditingOrganization(null)
    setShowForm(true)
  }

  const handleEdit = () => {
    if (selectedOrganization) {
      setEditingOrganization(selectedOrganization)
      setShowForm(true)
    }
  }

  const handleSave = async (data: Partial<Organization>): Promise<boolean> => {
    setFormLoading(true)
    try {
      if (editingOrganization) {
        const updated = await update(editingOrganization.id, data)
        if (updated) {
          setSelectedOrganization(updated)
          toast.success('Organization updated successfully')
          return true
        }
      } else {
        const created = await create(data as Omit<Organization, 'id' | 'created_at' | 'updated_at'>)
        if (created) {
          toast.success('Organization created successfully')
          navigate(`/organizations/${created.id}`)
          return true
        }
      }
      toast.error('Failed to save organization')
      return false
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (): Promise<boolean> => {
    if (!selectedOrganization) return false
    const success = await remove(selectedOrganization.id)
    if (success) {
      toast.success('Organization deleted successfully')
    } else {
      toast.error('Failed to delete organization')
    }
    return success
  }

  if (selectedOrganization) {
    return (
      <>
        <OrganizationDetail
          organization={selectedOrganization}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <OrganizationForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          organization={editingOrganization}
          loading={formLoading}
        />
      </>
    )
  }

  if (id && !selectedOrganization) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </div>
    )
  }

  return (
    <>
      <OrganizationList
        organizations={organizations}
        loading={loading}
        onSelect={handleSelect}
        onCreateNew={handleCreateNew}
      />
      <OrganizationForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSave}
        organization={editingOrganization}
        loading={formLoading}
      />
    </>
  )
}
