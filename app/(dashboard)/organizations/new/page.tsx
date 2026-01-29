import Link from 'next/link'
import { ArrowLeft, Globe } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, EmptyState } from '@/components/ui'
import { OrganizationForm } from '@/components/organizations'
import { createOrganization } from '@/lib/actions/organizations'
import { cookies } from 'next/headers'

export default async function NewOrganizationPage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('selected_world_id')?.value

  if (!worldId) {
    return (
      <EmptyState
        icon={Globe}
        title="No world selected"
        description="Please select or create a world before adding an organization."
      />
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/organizations" 
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Organizations
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Organization</CardTitle>
          <CardDescription>
            Add a new group or faction to your world
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrganizationForm
            worldId={worldId}
            action={createOrganization}
            submitLabel="Create Organization"
          />
        </CardContent>
      </Card>
    </div>
  )
}
