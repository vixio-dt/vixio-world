import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { ItemForm } from '@/components/items'
import { updateItem } from '@/lib/actions/items'
import type { Item } from '@/lib/types/database'

interface EditItemPageProps {
  params: Promise<{ id: string }>
}

export default async function EditItemPage({ params }: EditItemPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: item, error } = await (supabase as any)
    .from('items')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !item) {
    notFound()
  }

  const itm = item as unknown as Item

  async function handleUpdate(formData: FormData) {
    'use server'
    return updateItem(id, formData)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link 
          href={`/items/${id}`}
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to {itm.name}
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Item</CardTitle>
          <CardDescription>
            Update {itm.name}&apos;s details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemForm
            item={itm}
            worldId={itm.world_id}
            action={handleUpdate}
            submitLabel="Save Changes"
          />
        </CardContent>
      </Card>
    </div>
  )
}
