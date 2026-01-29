import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { OrganizationForm } from '@/components/organizations'
import { updateOrganization } from '@/lib/actions/organizations'
import type { Organization } from '@/lib/types/database'

interface EditOrganizationPageProps {
  params: Promise<{ id: string }>
}

export default async function EditOrganizationPage({ params }: EditOrganizationPageProps) {
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

  async function handleUpdate(formData: FormData) {
    'use server'
    return updateOrganization(id, formData)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link 
          href={`/organizations/${id}`}
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to {org.name}
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Organization</CardTitle>
          <CardDescription>
            Update {org.name}&apos;s details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrganizationForm
            organization={org}
            worldId={org.world_id}
            action={handleUpdate}
            submitLabel="Save Changes"
          />
        </CardContent>
      </Card>
    </div>
  )
}
