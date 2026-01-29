import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ImportClient } from './import-client'

export default async function ImportPage() {
  const supabase = await createClient()
  
  // Get the first world (later: use selected world from context)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: worlds } = await (supabase as any)
    .from('worlds')
    .select('id, name')
    .limit(1)

  // If no world exists, redirect to dashboard
  if (!worlds || worlds.length === 0) {
    redirect('/dashboard')
  }

  const world = worlds[0] as { id: string; name: string }

  return <ImportClient worldId={world.id} worldName={world.name} />
}
