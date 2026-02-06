import Link from 'next/link'
import { Plus, Package, Globe } from 'lucide-react'
import { getItems } from '@/lib/actions/items'
import { Button, EmptyState } from '@/components/ui'
import { ItemCard } from '@/components/items'
import { cookies } from 'next/headers'

export default async function ItemsPage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value

  if (!worldId) {
    return (
      <EmptyState
        icon={Globe}
        title="No world selected"
        description="Please select or create a world to view items."
      />
    )
  }

  const items = await getItems(worldId)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Items</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Objects and artifacts in your world</p>
        </div>
        <Link href="/items/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Item
          </Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No items yet"
          description="Create your first item to populate your world."
          action={{
            label: 'Create Item',
            href: '/items/new',
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
