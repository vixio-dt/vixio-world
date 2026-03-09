import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ImportClient } from './import-client'

export default async function ImportPage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value

  if (!worldId) {
    redirect('/dashboard')
  }

  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: world } = await (supabase as any)
    .from('worlds')
    .select('id, name')
    .eq('id', worldId)
    .single()

  if (!world) {
    redirect('/dashboard')
  }

  return (
    <Suspense fallback={null}>
      <ImportClient worldId={world.id} worldName={world.name} />
    </Suspense>
  )
}
