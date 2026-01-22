import { Download, FileText, Users, MapPin, Film, Palette, Code } from 'lucide-react'
import { cn } from '@/lib/utils'

type ExportType = 
  | 'character_sheets'
  | 'location_briefs'
  | 'screenplay'
  | 'storyboard_prompts'
  | 'world_bible'
  | 'metahuman_specs'
  | 'environment_briefs'

const exportConfig: Record<ExportType, { 
  icon: typeof FileText
  label: string
  description: string
  color: string
  format: string
}> = {
  character_sheets: {
    icon: Users,
    label: 'Character Sheets',
    description: 'Detailed character profiles with MetaHuman production specs',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    format: 'PDF / JSON',
  },
  location_briefs: {
    icon: MapPin,
    label: 'Location Briefs',
    description: 'Environment descriptions with atmosphere and production notes',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    format: 'PDF / JSON',
  },
  screenplay: {
    icon: FileText,
    label: 'Screenplay',
    description: 'Formatted screenplay from stories with scenes and dialogue',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    format: 'PDF / FDX',
  },
  storyboard_prompts: {
    icon: Film,
    label: 'Storyboard Prompts',
    description: 'AI image generation prompts for each shot',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    format: 'TXT / JSON',
  },
  world_bible: {
    icon: FileText,
    label: 'World Bible',
    description: 'Complete world documentation for production teams',
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    format: 'PDF',
  },
  metahuman_specs: {
    icon: Palette,
    label: 'MetaHuman Specs',
    description: 'Technical specifications for Unreal Engine MetaHuman creation',
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    format: 'JSON',
  },
  environment_briefs: {
    icon: Code,
    label: 'Environment Briefs',
    description: 'Technical specs for Unreal Engine environment artists',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    format: 'JSON',
  },
}

interface ExportCardProps {
  type: ExportType
  count?: number
  onExport?: () => void
  disabled?: boolean
}

export function ExportCard({ type, count, onExport, disabled }: ExportCardProps) {
  const config = exportConfig[type]
  const Icon = config.icon

  return (
    <div className={cn(
      'p-4 rounded-xl border transition-all duration-200',
      'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800',
      disabled && 'opacity-50'
    )}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={cn('p-2 rounded-lg', config.color)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {config.label}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {config.format}
          </p>
        </div>
        {count !== undefined && (
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {count} item{count !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        {config.description}
      </p>

      {/* Export Button */}
      <button
        onClick={onExport}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium text-sm transition-colors',
          disabled
            ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
            : 'bg-sky-500 hover:bg-sky-600 text-white'
        )}
      >
        <Download className="h-4 w-4" />
        Export
      </button>
    </div>
  )
}

export { type ExportType }
