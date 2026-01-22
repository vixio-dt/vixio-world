import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSupabaseCRUD } from '@/lib/hooks'
import { useToast } from '@/components/ui'
import { CharacterList, CharacterForm, CharacterDetail } from './components'
import type { Character } from '@/types/database'

export function CharactersPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const {
    data: characters,
    loading,
    create,
    update,
    remove,
    getById,
  } = useSupabaseCRUD<Character>({ table: 'characters' })

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  // Load character when URL has ID
  useEffect(() => {
    async function loadCharacter() {
      if (id) {
        const character = await getById(id)
        setSelectedCharacter(character)
      } else {
        setSelectedCharacter(null)
      }
    }
    loadCharacter()
  }, [id, getById])

  const handleSelect = (character: Character) => {
    navigate(`/characters/${character.id}`)
  }

  const handleCreateNew = () => {
    setEditingCharacter(null)
    setShowForm(true)
  }

  const handleEdit = () => {
    if (selectedCharacter) {
      setEditingCharacter(selectedCharacter)
      setShowForm(true)
    }
  }

  const handleSave = async (data: Partial<Character>): Promise<boolean> => {
    setFormLoading(true)
    try {
      if (editingCharacter) {
        const updated = await update(editingCharacter.id, data)
        if (updated) {
          setSelectedCharacter(updated)
          toast.success('Character updated successfully')
          return true
        }
      } else {
        const created = await create(data as Omit<Character, 'id' | 'created_at' | 'updated_at'>)
        if (created) {
          toast.success('Character created successfully')
          navigate(`/characters/${created.id}`)
          return true
        }
      }
      toast.error('Failed to save character')
      return false
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (): Promise<boolean> => {
    if (!selectedCharacter) return false
    const success = await remove(selectedCharacter.id)
    if (success) {
      toast.success('Character deleted successfully')
    } else {
      toast.error('Failed to delete character')
    }
    return success
  }

  // Show detail view if character is selected
  if (selectedCharacter) {
    return (
      <>
        <CharacterDetail
          character={selectedCharacter}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <CharacterForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          character={editingCharacter}
          loading={formLoading}
        />
      </>
    )
  }

  // Show loading state while fetching character by ID
  if (id && !selectedCharacter) {
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
      <CharacterList
        characters={characters}
        loading={loading}
        onSelect={handleSelect}
        onCreateNew={handleCreateNew}
      />
      <CharacterForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSave}
        character={editingCharacter}
        loading={formLoading}
      />
    </>
  )
}
