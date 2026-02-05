import Link from 'next/link'
import { Plus, Scale, Globe } from 'lucide-react'
import { getRules } from '@/lib/actions/rules'
import { Button, EmptyState } from '@/components/ui'
import { RuleCard } from '@/components/rules'
import { cookies } from 'next/headers'

export default async function RulesPage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value

  if (!worldId) {
    return (
      <EmptyState
        icon={Globe}
        title="No world selected"
        description="Please select or create a world to view rules."
      />
    )
  }

  const rules = await getRules(worldId)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rules</h1>
          <p className="text-slate-500 mt-1">Laws and systems of your world</p>
        </div>
        <Link href="/rules/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Rule
          </Button>
        </Link>
      </div>

      {rules.length === 0 ? (
        <EmptyState
          icon={Scale}
          title="No rules yet"
          description="Create your first rule to define how your world works."
          action={{
            label: 'Create Rule',
            href: '/rules/new',
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rules.map((rule) => (
            <RuleCard key={rule.id} rule={rule} />
          ))}
        </div>
      )}
    </div>
  )
}
