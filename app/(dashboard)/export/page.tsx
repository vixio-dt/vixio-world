import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ExportClient } from './export-client'

export default async function ExportPage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value

  if (!worldId) {
    redirect('/dashboard')
  }

  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: world } = await (supabase as any)
    .from('worlds')
    .select('name')
    .eq('id', worldId)
    .single()

  const worldData = world as { name: string } | null

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Export</h1>
        <p className="text-slate-600">
          Export your world data in various formats.
        </p>
      </div>

      <ExportClient worldId={worldId} worldName={worldData?.name || 'World'} />
    </div>
  )
}
