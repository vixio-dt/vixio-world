import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'
import type { World } from '@/types/database'

interface WorldContextType {
  worlds: World[]
  currentWorld: World | null
  setCurrentWorld: (world: World | null) => void
  loading: boolean
  refreshWorlds: () => Promise<void>
  createWorld: (name: string, genre?: string, tone?: string) => Promise<World | null>
}

const WorldContext = createContext<WorldContextType | undefined>(undefined)

export function WorldProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [worlds, setWorlds] = useState<World[]>([])
  const [currentWorld, setCurrentWorld] = useState<World | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshWorlds = async () => {
    if (!user) {
      setWorlds([])
      setCurrentWorld(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const { data, error } = await supabase
      .from('worlds')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching worlds:', error)
      setLoading(false)
      return
    }

    setWorlds(data || [])
    
    // Auto-select first world if none selected
    if (!currentWorld && data && data.length > 0) {
      setCurrentWorld(data[0])
    }
    
    setLoading(false)
  }

  const createWorld = async (name: string, genre?: string, tone?: string): Promise<World | null> => {
    if (!user) return null

    const { data, error } = await supabase
      .from('worlds')
      .insert({ user_id: user.id, name, genre, tone })
      .select()
      .single()

    if (error) {
      console.error('Error creating world:', error)
      return null
    }

    await refreshWorlds()
    return data
  }

  useEffect(() => {
    refreshWorlds()
  }, [user])

  return (
    <WorldContext.Provider value={{ worlds, currentWorld, setCurrentWorld, loading, refreshWorlds, createWorld }}>
      {children}
    </WorldContext.Provider>
  )
}

export function useWorld() {
  const context = useContext(WorldContext)
  if (context === undefined) {
    throw new Error('useWorld must be used within a WorldProvider')
  }
  return context
}
