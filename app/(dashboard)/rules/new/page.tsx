import Link from 'next/link'
import { ArrowLeft, Globe } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, EmptyState } from '@/components/ui'
import { RuleForm } from '@/components/rules'
import { createRule } from '@/lib/actions/rules'
import { cookies } from 'next/headers'

export default async function NewRulePage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('selected_world_id')?.value

  if (!worldId) {
    return (
      <EmptyState
        icon={Globe}
        title="No world selected"
        description="Please select or create a world before adding a rule."
      />
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/rules" 
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Rules
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Rule</CardTitle>
          <CardDescription>
            Define a new law or system for your world
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RuleForm
            worldId={worldId}
            action={createRule}
            submitLabel="Create Rule"
          />
        </CardContent>
      </Card>
    </div>
  )
}
