import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { RelationshipGraph } from '@/components/graph'
import { getGraphData } from '@/lib/actions/graph'

export default async function GraphPage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value

  if (!worldId) {
    redirect('/dashboard')
  }

  const graphData = await getGraphData(worldId)

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Relationship Graph</h1>
        <p className="text-slate-600">
          Visualize connections between entities. Click a node to view details.
        </p>
      </div>
      <div className="h-[calc(100%-5rem)]">
        <RelationshipGraph data={graphData} />
      </div>
    </div>
  )
}
