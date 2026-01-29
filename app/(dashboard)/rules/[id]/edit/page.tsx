import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { RuleForm } from '@/components/rules'
import { updateRule } from '@/lib/actions/rules'
import type { Rule } from '@/lib/types/database'

interface EditRulePageProps {
  params: Promise<{ id: string }>
}

export default async function EditRulePage({ params }: EditRulePageProps) {
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

  async function handleUpdate(formData: FormData) {
    'use server'
    return updateRule(id, formData)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link 
          href={`/rules/${id}`}
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to {rul.name}
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Rule</CardTitle>
          <CardDescription>
            Update {rul.name}&apos;s details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RuleForm
            rule={rul}
            worldId={rul.world_id}
            action={handleUpdate}
            submitLabel="Save Changes"
          />
        </CardContent>
      </Card>
    </div>
  )
}
