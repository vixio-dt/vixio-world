import { MapPin } from 'lucide-react'
import { Badge } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Location } from '@/types/database'

interface LocationCardProps {
  location: Location
  onClick: () => void
  parentName?: string
}

const typeColors: Record<string, 'emerald' | 'sky' | 'violet' | 'amber' | 'rose' | 'slate'> = {
  planet: 'violet',
  continent: 'sky',
  country: 'emerald',
  city: 'amber',
  district: 'rose',
  building: 'slate',
  room: 'slate',
}

export function LocationCard({ location, onClick, parentName }: LocationCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700',
        'hover:border-sky-500 dark:hover:border-sky-500 cursor-pointer transition-colors p-4'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
          <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">
            {location.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {location.type && (
              <Badge variant={typeColors[location.type] || 'slate'} size="sm">
                {location.type}
              </Badge>
            )}
            {parentName && (
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {parentName}
              </span>
            )}
          </div>
          {location.atmosphere && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
              {location.atmosphere}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
