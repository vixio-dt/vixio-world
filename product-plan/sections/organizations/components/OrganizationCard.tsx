import { Building2, Users, Shield, Sword, Crown, Church, Briefcase, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Organization, OrganizationType } from '@product/sections/organizations/types'

const typeConfig: Record<OrganizationType, { icon: typeof Building2; label: string; color: string }> = {
  government: { icon: Crown, label: 'Government', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  religion: { icon: Church, label: 'Religion', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  corporation: { icon: Briefcase, label: 'Corporation', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  guild: { icon: Users, label: 'Guild', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  family: { icon: Users, label: 'Family', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
  military: { icon: Shield, label: 'Military', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' },
  secret_society: { icon: Eye, label: 'Secret Society', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
}

interface OrganizationCardProps {
  organization: Organization
  onClick?: () => void
  selected?: boolean
}

export function OrganizationCard({ organization, onClick, selected }: OrganizationCardProps) {
  const config = typeConfig[organization.type]
  const Icon = config.icon

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 rounded-xl border transition-all duration-200',
        'hover:shadow-md hover:border-sky-200 dark:hover:border-sky-800',
        selected
          ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20 shadow-sm'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">
            {organization.name}
          </h3>
          <span className={cn('inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-1', config.color)}>
            <Icon className="h-3 w-3" />
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
          <Users className="h-4 w-4" />
          <span>{organization.memberCount}</span>
        </div>
      </div>

      {/* Purpose */}
      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
        {organization.purpose}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
        <span className={cn(
          'px-2 py-0.5 rounded-full',
          organization.status === 'active' 
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            : organization.status === 'disbanded'
            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
        )}>
          {organization.status}
        </span>
        {organization.leadership.holder && (
          <span className="flex items-center gap-1">
            <Crown className="h-3 w-3" />
            {organization.leadership.title}
          </span>
        )}
      </div>
    </button>
  )
}
