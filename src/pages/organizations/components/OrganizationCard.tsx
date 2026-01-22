import { Building2 } from 'lucide-react'
import { Badge } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Organization } from '@/types/database'

interface OrganizationCardProps {
  organization: Organization
  onClick: () => void
}

const typeColors: Record<string, 'violet' | 'sky' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'slate'> = {
  government: 'sky',
  religion: 'violet',
  corporation: 'emerald',
  guild: 'amber',
  family: 'rose',
  military: 'slate',
  secret_society: 'cyan',
}

export function OrganizationCard({ organization, onClick }: OrganizationCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700',
        'hover:border-sky-500 dark:hover:border-sky-500 cursor-pointer transition-colors p-4'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-6 h-6 text-violet-600 dark:text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">
            {organization.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {organization.type && (
              <Badge variant={typeColors[organization.type] || 'slate'} size="sm">
                {organization.type.replace('_', ' ')}
              </Badge>
            )}
          </div>
          {organization.purpose && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
              {organization.purpose}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
