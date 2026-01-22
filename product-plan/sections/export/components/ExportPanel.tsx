import { Package, CheckCircle2, AlertCircle } from 'lucide-react'
import { ExportCard, type ExportType } from './ExportCard'
import { cn } from '@/lib/utils'

interface ExportStats {
  characters: number
  locations: number
  organizations: number
  events: number
  items: number
  rules: number
  stories: number
}

interface ExportPanelProps {
  worldName: string
  stats: ExportStats
  onExport?: (type: ExportType) => void
}

export function ExportPanel({ worldName, stats, onExport }: ExportPanelProps) {
  const totalElements = Object.values(stats).reduce((a, b) => a + b, 0)
  const hasContent = totalElements > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Package className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Export {worldName}</h2>
        </div>
        <p className="text-sky-100 text-sm">
          Generate production-ready packages for your virtual production pipeline
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm">
          {hasContent ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-sky-200" />
              <span className="text-sky-100">{totalElements} world elements ready for export</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-sky-200" />
              <span className="text-sky-100">Add content to your world before exporting</span>
            </>
          )}
        </div>
      </div>

      {/* World Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Characters', count: stats.characters },
          { label: 'Locations', count: stats.locations },
          { label: 'Organizations', count: stats.organizations },
          { label: 'Events', count: stats.events },
          { label: 'Items', count: stats.items },
          { label: 'Rules', count: stats.rules },
          { label: 'Stories', count: stats.stories },
        ].map(({ label, count }) => (
          <div 
            key={label}
            className={cn(
              'p-3 rounded-lg border text-center',
              count > 0 
                ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
            )}
          >
            <p className={cn(
              'text-2xl font-bold',
              count > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
            )}>
              {count}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Export Options */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Export Packages
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ExportCard
            type="character_sheets"
            count={stats.characters}
            onExport={() => onExport?.('character_sheets')}
            disabled={stats.characters === 0}
          />
          <ExportCard
            type="location_briefs"
            count={stats.locations}
            onExport={() => onExport?.('location_briefs')}
            disabled={stats.locations === 0}
          />
          <ExportCard
            type="screenplay"
            count={stats.stories}
            onExport={() => onExport?.('screenplay')}
            disabled={stats.stories === 0}
          />
          <ExportCard
            type="storyboard_prompts"
            count={stats.stories}
            onExport={() => onExport?.('storyboard_prompts')}
            disabled={stats.stories === 0}
          />
          <ExportCard
            type="world_bible"
            onExport={() => onExport?.('world_bible')}
            disabled={!hasContent}
          />
          <ExportCard
            type="metahuman_specs"
            count={stats.characters}
            onExport={() => onExport?.('metahuman_specs')}
            disabled={stats.characters === 0}
          />
        </div>
      </div>
    </div>
  )
}
