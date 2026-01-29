import Link from 'next/link'
import { Plus, Building2, Globe } from 'lucide-react'
import { getOrganizations } from '@/lib/actions/organizations'
import { Button, EmptyState } from '@/components/ui'
import { OrganizationCard } from '@/components/organizations'
import { cookies } from 'next/headers'

export default async function OrganizationsPage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('selected_world_id')?.value

  if (!worldId) {
    return (
      <EmptyState
        icon={Globe}
        title="No world selected"
        description="Please select or create a world to view organizations."
      />
    )
  }

  const organizations = await getOrganizations(worldId)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Organizations</h1>
          <p className="text-slate-500 mt-1">Groups and factions in your world</p>
        </div>
        <Link href="/organizations/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Organization
          </Button>
        </Link>
      </div>

      {organizations.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No organizations yet"
          description="Create your first organization to build your world's factions."
          action={{
            label: 'Create Organization',
            href: '/organizations/new',
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizations.map((org) => (
            <OrganizationCard key={org.id} organization={org} />
          ))}
        </div>
      )}
    </div>
  )
}
