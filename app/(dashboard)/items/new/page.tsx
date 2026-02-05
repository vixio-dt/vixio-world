import Link from 'next/link'
import { ArrowLeft, Globe } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, EmptyState } from '@/components/ui'
import { ItemForm } from '@/components/items'
import { createItem } from '@/lib/actions/items'
import { cookies } from 'next/headers'

export default async function NewItemPage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value

  if (!worldId) {
    return (
      <EmptyState
        icon={Globe}
        title="No world selected"
        description="Please select or create a world before adding an item."
      />
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/items" 
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Items
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Item</CardTitle>
          <CardDescription>
            Add a new object to your world
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemForm
            worldId={worldId}
            action={createItem}
            submitLabel="Create Item"
          />
        </CardContent>
      </Card>
    </div>
  )
}
