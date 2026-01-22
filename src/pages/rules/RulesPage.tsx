import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSupabaseCRUD } from '@/lib/hooks'
import { useToast } from '@/components/ui'
import { RuleList, RuleForm, RuleDetail } from './components'
import type { Rule } from '@/types/database'

export function RulesPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const { data: rules, loading, create, update, remove, getById } = useSupabaseCRUD<Rule>({ table: 'rules' })

  const [selectedRule, setSelectedRule] = useState<Rule | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    async function loadRule() {
      if (id) {
        const rule = await getById(id)
        setSelectedRule(rule)
      } else {
        setSelectedRule(null)
      }
    }
    loadRule()
  }, [id, getById])

  const handleSelect = (rule: Rule) => navigate(`/rules/${rule.id}`)
  const handleCreateNew = () => { setEditingRule(null); setShowForm(true) }
  const handleEdit = () => { if (selectedRule) { setEditingRule(selectedRule); setShowForm(true) } }

  const handleSave = async (data: Partial<Rule>): Promise<boolean> => {
    setFormLoading(true)
    try {
      if (editingRule) {
        const updated = await update(editingRule.id, data)
        if (updated) { setSelectedRule(updated); toast.success('Rule updated successfully'); return true }
      } else {
        const created = await create(data as Omit<Rule, 'id' | 'created_at' | 'updated_at'>)
        if (created) { toast.success('Rule created successfully'); navigate(`/rules/${created.id}`); return true }
      }
      toast.error('Failed to save rule'); return false
    } finally { setFormLoading(false) }
  }

  const handleDelete = async (): Promise<boolean> => {
    if (!selectedRule) return false
    const success = await remove(selectedRule.id)
    if (success) toast.success('Rule deleted successfully')
    else toast.error('Failed to delete rule')
    return success
  }

  if (selectedRule) {
    return (
      <>
        <RuleDetail rule={selectedRule} onEdit={handleEdit} onDelete={handleDelete} />
        <RuleForm isOpen={showForm} onClose={() => setShowForm(false)} onSave={handleSave} rule={editingRule} allRules={rules} loading={formLoading} />
      </>
    )
  }

  if (id && !selectedRule) {
    return <div className="animate-pulse space-y-6"><div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" /><div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl" /></div>
  }

  return (
    <>
      <RuleList rules={rules} loading={loading} onSelect={handleSelect} onCreateNew={handleCreateNew} />
      <RuleForm isOpen={showForm} onClose={() => setShowForm(false)} onSave={handleSave} rule={editingRule} allRules={rules} loading={formLoading} />
    </>
  )
}
