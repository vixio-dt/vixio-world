import Link from 'next/link'
import { Plus, Scale, Globe, LayoutList, LayoutGrid } from 'lucide-react'
import { getRules } from '@/lib/actions/rules'
import { Button, EmptyState } from '@/components/ui'
import { RuleCard, RuleCategoryView } from '@/components/rules'
import { cookies } from 'next/headers'

interface RulesPageProps {
  searchParams: Promise<{ view?: string }>
}

export default async function RulesPage({ searchParams }: RulesPageProps) {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value
  const params = await searchParams
  const viewMode = params.view || 'sidebar'

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Rules</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Laws and systems of your world</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <Link href="/rules?view=sidebar">
              <button
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'sidebar'
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title="Sidebar view"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/rules?view=grid">
              <button
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </Link>
          </div>
          <Link href="/rules/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Rule
            </Button>
          </Link>
        </div>
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
      ) : viewMode === 'sidebar' ? (
        <RuleCategoryView rules={rules} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rules.map((rule, index) => (
            <RuleCard key={rule.id} rule={rule} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
