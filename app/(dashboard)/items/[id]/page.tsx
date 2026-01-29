import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button, Card, CardContent } from '@/components/ui'
import { ContentBlocksDisplay } from '@/components/content-blocks'
import { deleteItem } from '@/lib/actions/items'
import type { Item } from '@/lib/types/database'

interface ItemPageProps {
  params: Promise<{ id: string }>
}

const typeLabels: Record<string, string> = {
  weapon: 'Weapon',
  vehicle: 'Vehicle',
  artifact: 'Artifact',
  tool: 'Tool',
  document: 'Document',
  clothing: 'Clothing',
  technology: 'Technology',
}

export default async function ItemPage({ params }: ItemPageProps) {
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

  async function handleDelete() {
    'use server'
    await deleteItem(id)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/items" 
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Items
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <div className="p-4 bg-amber-50 rounded-xl">
            <Package className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{itm.name}</h1>
            {itm.type && (
              <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                {typeLabels[itm.type] || itm.type}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/items/${id}/edit`}>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <form action={handleDelete}>
            <Button variant="destructive" type="submit">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </form>
        </div>
      </div>

      {itm.story_context && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="py-4">
            <h3 className="text-sm font-medium text-amber-700 mb-1">Story Context</h3>
            <p className="text-slate-900 whitespace-pre-wrap">{itm.story_context}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {itm.description && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Description</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{itm.description}</p>
            </CardContent>
          </Card>
        )}

        {itm.function && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Function</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{itm.function}</p>
            </CardContent>
          </Card>
        )}

        {itm.origin && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Origin</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{itm.origin}</p>
            </CardContent>
          </Card>
        )}

        {itm.significance && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Significance</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{itm.significance}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {itm.content_blocks && itm.content_blocks.length > 0 && (
        <div className="mt-8">
          <ContentBlocksDisplay blocks={itm.content_blocks} />
        </div>
      )}
    </div>
  )
}
