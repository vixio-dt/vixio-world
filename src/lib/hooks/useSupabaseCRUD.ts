import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useWorld } from '@/contexts/WorldContext'

interface UseSupabaseCRUDOptions<T> {
  table: string
  worldScoped?: boolean
  orderBy?: { column: keyof T; ascending?: boolean }
  filter?: { column: string; value: unknown }
}

interface CRUDState<T> {
  data: T[]
  loading: boolean
  error: string | null
}

export function useSupabaseCRUD<T extends { id: string }>({
  table,
  worldScoped = true,
  orderBy,
  filter,
}: UseSupabaseCRUDOptions<T>) {
  const { currentWorld } = useWorld()
  const [state, setState] = useState<CRUDState<T>>({
    data: [],
    loading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    if (worldScoped && !currentWorld) {
      setState({ data: [], loading: false, error: null })
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      let query = supabase.from(table).select('*')

      if (worldScoped && currentWorld) {
        query = query.eq('world_id', currentWorld.id)
      }

      if (filter) {
        query = query.eq(filter.column, filter.value as string)
      }

      if (orderBy) {
        query = query.order(orderBy.column as string, { ascending: orderBy.ascending ?? true })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error

      setState({ data: (data as T[]) || [], loading: false, error: null })
    } catch (err) {
      console.error(`Error fetching ${table}:`, err)
      setState(prev => ({ ...prev, loading: false, error: (err as Error).message }))
    }
  }, [table, currentWorld, worldScoped, filter?.column, filter?.value, orderBy?.column, orderBy?.ascending])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const create = async (item: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T | null> => {
    try {
      const insertData = worldScoped && currentWorld
        ? { ...item, world_id: currentWorld.id }
        : item

      const { data, error } = await supabase
        .from(table)
        .insert(insertData as any)
        .select()
        .single()

      if (error) throw error

      setState(prev => ({ ...prev, data: [data as T, ...prev.data] }))
      return data as T
    } catch (err) {
      console.error(`Error creating ${table}:`, err)
      return null
    }
  }

  const update = async (id: string, updates: Partial<T>): Promise<T | null> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setState(prev => ({
        ...prev,
        data: prev.data.map(item => (item.id === id ? (data as T) : item)),
      }))
      return data as T
    } catch (err) {
      console.error(`Error updating ${table}:`, err)
      return null
    }
  }

  const remove = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from(table).delete().eq('id', id)

      if (error) throw error

      setState(prev => ({
        ...prev,
        data: prev.data.filter(item => item.id !== id),
      }))
      return true
    } catch (err) {
      console.error(`Error deleting ${table}:`, err)
      return false
    }
  }

  const getById = async (id: string): Promise<T | null> => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return data as T
    } catch (err) {
      console.error(`Error fetching ${table} by id:`, err)
      return null
    }
  }

  return {
    ...state,
    refresh: fetchData,
    create,
    update,
    remove,
    getById,
  }
}

// Hook for fetching a single item with relations
export function useSupabaseItem<T>(table: string, id: string | undefined, select = '*') {
  const [item, setItem] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItem = useCallback(async () => {
    if (!id) {
      setItem(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from(table)
        .select(select)
        .eq('id', id)
        .single()

      if (error) throw error

      setItem(data as T)
    } catch (err) {
      console.error(`Error fetching ${table}:`, err)
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [table, id, select])

  useEffect(() => {
    fetchItem()
  }, [fetchItem])

  return { item, loading, error, refresh: fetchItem }
}
