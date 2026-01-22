import { Scale } from 'lucide-react'
import { Badge } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Rule } from '@/types/database'

interface RuleCardProps {
  rule: Rule
  onClick: () => void
}

const categoryColors: Record<string, 'sky' | 'violet' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'slate'> = {
  physics: 'sky',
  magic: 'violet',
  technology: 'cyan',
  biology: 'emerald',
  social: 'amber',
  political: 'rose',
  economic: 'slate',
  temporal: 'sky',
  cosmological: 'violet',
}

export function RuleCard({ rule, onClick }: RuleCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700',
        'hover:border-sky-500 dark:hover:border-sky-500 cursor-pointer transition-colors p-4'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
          <Scale className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {rule.code && (
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {rule.code}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">{rule.name}</h3>
          {rule.category && (
            <Badge variant={categoryColors[rule.category] || 'slate'} size="sm" className="mt-1">
              {rule.category}
            </Badge>
          )}
          {rule.statement && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
              {rule.statement}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
