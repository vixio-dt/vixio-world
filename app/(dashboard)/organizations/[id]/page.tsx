import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, Building2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button, Card, CardContent } from '@/components/ui'
import { ContentBlocksDisplay } from '@/components/content-blocks'
import { deleteOrganization } from '@/lib/actions/organizations'
import type { Organization } from '@/lib/types/database'

interface OrganizationPageProps {
  params: Promise<{ id: string }>
}

const typeLabels: Record<string, string> = {
  government: 'Government',
  religion: 'Religion',
  corporation: 'Corporation',
  guild: 'Guild',
  family: 'Family',
  military: 'Military',
  secret_society: 'Secret Society',
}

export default async function OrganizationPage({ params }: OrganizationPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: organization, error } = await (supabase as any)
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !organization) {
    notFound()
  }

  const org = organization as unknown as Organization

  async function handleDelete() {
    'use server'
    await deleteOrganization(id)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/organizations" 
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Organizations
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <div className="p-4 bg-purple-50 rounded-xl">
            <Building2 className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{org.name}</h1>
            {org.type && (
              <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                {typeLabels[org.type] || org.type}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/organizations/${id}/edit`}>
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

      {org.story_context && (
        <Card className="mb-6 border-purple-200 bg-purple-50">
          <CardContent className="py-4">
            <h3 className="text-sm font-medium text-purple-700 mb-1">Story Context</h3>
            <p className="text-slate-900 whitespace-pre-wrap">{org.story_context}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {org.purpose && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Purpose</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{org.purpose}</p>
            </CardContent>
          </Card>
        )}

        {org.structure && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Structure</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{org.structure}</p>
            </CardContent>
          </Card>
        )}

        {org.leadership && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Leadership</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{org.leadership}</p>
            </CardContent>
          </Card>
        )}

        {org.beliefs && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Beliefs & Values</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{org.beliefs}</p>
            </CardContent>
          </Card>
        )}

        {org.history && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">History</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{org.history}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {org.content_blocks && org.content_blocks.length > 0 && (
        <div className="mt-8">
          <ContentBlocksDisplay blocks={org.content_blocks} />
        </div>
      )}
    </div>
  )
}
