import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, Scale } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button, Card, CardContent } from '@/components/ui'
import { ContentBlocksDisplay } from '@/components/content-blocks'
import { deleteRule } from '@/lib/actions/rules'
import type { Rule } from '@/lib/types/database'

interface RulePageProps {
  params: Promise<{ id: string }>
}

const categoryLabels: Record<string, string> = {
  physics: 'Physics',
  magic: 'Magic',
  technology: 'Technology',
  biology: 'Biology',
  social: 'Social',
  political: 'Political',
  economic: 'Economic',
  temporal: 'Temporal',
  cosmological: 'Cosmological',
}

export default async function RulePage({ params }: RulePageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rule, error } = await (supabase as any)
    .from('rules')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !rule) {
    notFound()
  }

  const rul = rule as unknown as Rule

  async function handleDelete() {
    'use server'
    await deleteRule(id)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/rules" 
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Rules
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <div className="p-4 bg-indigo-50 rounded-xl">
            <Scale className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{rul.name}</h1>
            {rul.category && (
              <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                {categoryLabels[rul.category] || rul.category}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/rules/${id}/edit`}>
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

      {rul.story_context && (
        <Card className="mb-6 border-indigo-200 bg-indigo-50">
          <CardContent className="py-4">
            <h3 className="text-sm font-medium text-indigo-700 mb-1">Story Context</h3>
            <p className="text-slate-900 whitespace-pre-wrap">{rul.story_context}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {rul.statement && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Statement</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{rul.statement}</p>
            </CardContent>
          </Card>
        )}

        {rul.scope && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Scope</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{rul.scope}</p>
            </CardContent>
          </Card>
        )}

        {rul.exceptions && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Exceptions</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{rul.exceptions}</p>
            </CardContent>
          </Card>
        )}

        {rul.consequences && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Consequences</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{rul.consequences}</p>
            </CardContent>
          </Card>
        )}

        {rul.examples && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Examples</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{rul.examples}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {rul.content_blocks && rul.content_blocks.length > 0 && (
        <div className="mt-8">
          <ContentBlocksDisplay blocks={rul.content_blocks} />
        </div>
      )}
    </div>
  )
}
