import { createClient } from '@/lib/supabase/server'
import { DashboardCards } from './DashboardCards'

const tables = ['characters', 'locations', 'organizations', 'events', 'items', 'rules', 'stories']

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Get counts for each entity type
  const counts: Record<string, number> = {}
  
  for (const table of tables) {
    const { count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
    counts[table] = count || 0
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Welcome to your world</p>
      </div>

      <DashboardCards counts={counts} />
    </div>
  )
}
