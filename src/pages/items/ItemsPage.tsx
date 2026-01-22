import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSupabaseCRUD } from '@/lib/hooks'
import { useToast } from '@/components/ui'
import { ItemList, ItemForm, ItemDetail } from './components'
import type { Item } from '@/types/database'

export function ItemsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const { data: items, loading, create, update, remove, getById } = useSupabaseCRUD<Item>({ table: 'items' })

  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    async function loadItem() {
      if (id) {
        const item = await getById(id)
        setSelectedItem(item)
      } else {
        setSelectedItem(null)
      }
    }
    loadItem()
  }, [id, getById])

  const handleSelect = (item: Item) => navigate(`/items/${item.id}`)
  const handleCreateNew = () => { setEditingItem(null); setShowForm(true) }
  const handleEdit = () => { if (selectedItem) { setEditingItem(selectedItem); setShowForm(true) } }

  const handleSave = async (data: Partial<Item>): Promise<boolean> => {
    setFormLoading(true)
    try {
      if (editingItem) {
        const updated = await update(editingItem.id, data)
        if (updated) { setSelectedItem(updated); toast.success('Item updated successfully'); return true }
      } else {
        const created = await create(data as Omit<Item, 'id' | 'created_at' | 'updated_at'>)
        if (created) { toast.success('Item created successfully'); navigate(`/items/${created.id}`); return true }
      }
      toast.error('Failed to save item'); return false
    } finally { setFormLoading(false) }
  }

  const handleDelete = async (): Promise<boolean> => {
    if (!selectedItem) return false
    const success = await remove(selectedItem.id)
    if (success) toast.success('Item deleted successfully')
    else toast.error('Failed to delete item')
    return success
  }

  if (selectedItem) {
    return (
      <>
        <ItemDetail item={selectedItem} onEdit={handleEdit} onDelete={handleDelete} />
        <ItemForm isOpen={showForm} onClose={() => setShowForm(false)} onSave={handleSave} item={editingItem} loading={formLoading} />
      </>
    )
  }

  if (id && !selectedItem) {
    return <div className="animate-pulse space-y-6"><div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" /><div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl" /></div>
  }

  return (
    <>
      <ItemList items={items} loading={loading} onSelect={handleSelect} onCreateNew={handleCreateNew} />
      <ItemForm isOpen={showForm} onClose={() => setShowForm(false)} onSave={handleSave} item={editingItem} loading={formLoading} />
    </>
  )
}
