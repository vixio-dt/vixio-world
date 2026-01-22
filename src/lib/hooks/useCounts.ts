import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useWorld } from '@/contexts/WorldContext'

interface WorldCounts {
  characters: number
  locations: number
  organizations: number
  events: number
  items: number
  rules: number
  stories: number
  scenes: number
  shots: number
}

const defaultCounts: WorldCounts = {
  characters: 0,
  locations: 0,
  organizations: 0,
  events: 0,
  items: 0,
  rules: 0,
  stories: 0,
  scenes: 0,
  shots: 0,
}

export function useCounts() {
  const { currentWorld } = useWorld()
  const [counts, setCounts] = useState<WorldCounts>(defaultCounts)
  const [loading, setLoading] = useState(true)

  const fetchCounts = useCallback(async () => {
    if (!currentWorld) {
      setCounts(defaultCounts)
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const worldId = currentWorld.id

      // Fetch all counts in parallel
      const [
        charactersRes,
        locationsRes,
        organizationsRes,
        eventsRes,
        itemsRes,
        rulesRes,
        storiesRes,
      ] = await Promise.all([
        supabase.from('characters').select('id', { count: 'exact', head: true }).eq('world_id', worldId),
        supabase.from('locations').select('id', { count: 'exact', head: true }).eq('world_id', worldId),
        supabase.from('organizations').select('id', { count: 'exact', head: true }).eq('world_id', worldId),
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('world_id', worldId),
        supabase.from('items').select('id', { count: 'exact', head: true }).eq('world_id', worldId),
        supabase.from('rules').select('id', { count: 'exact', head: true }).eq('world_id', worldId),
        supabase.from('stories').select('id', { count: 'exact', head: true }).eq('world_id', worldId),
      ])

      // Get story IDs to fetch scenes count
      const { data: storyIds } = await supabase
        .from('stories')
        .select('id')
        .eq('world_id', worldId)

      let scenesCount = 0
      let shotsCount = 0

      if (storyIds && storyIds.length > 0) {
        const ids = storyIds.map(s => s.id)
        const scenesRes = await supabase
          .from('scenes')
          .select('id', { count: 'exact', head: true })
          .in('story_id', ids)
        scenesCount = scenesRes.count || 0

        // Get scene IDs to fetch shots count
        const { data: sceneIds } = await supabase
          .from('scenes')
          .select('id')
          .in('story_id', ids)

        if (sceneIds && sceneIds.length > 0) {
          const shotsRes = await supabase
            .from('shots')
            .select('id', { count: 'exact', head: true })
            .in('scene_id', sceneIds.map(s => s.id))
          shotsCount = shotsRes.count || 0
        }
      }

      setCounts({
        characters: charactersRes.count || 0,
        locations: locationsRes.count || 0,
        organizations: organizationsRes.count || 0,
        events: eventsRes.count || 0,
        items: itemsRes.count || 0,
        rules: rulesRes.count || 0,
        stories: storiesRes.count || 0,
        scenes: scenesCount,
        shots: shotsCount,
      })
    } catch (err) {
      console.error('Error fetching counts:', err)
    } finally {
      setLoading(false)
    }
  }, [currentWorld])

  useEffect(() => {
    fetchCounts()
  }, [fetchCounts])

  return { counts, loading, refresh: fetchCounts }
}
