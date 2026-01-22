import { Sword, Car, Sparkles, Wrench, FileText, Shirt, Cpu, MapPin, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Item, ItemType, ItemSignificance } from '@product/sections/items/types'

const typeConfig: Record<ItemType, { icon: typeof Sword; label: string; color: string }> = {
  weapon: { icon: Sword, label: 'Weapon', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  vehicle: { icon: Car, label: 'Vehicle', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  artifact: { icon: Sparkles, label: 'Artifact', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  tool: { icon: Wrench, label: 'Tool', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  document: { icon: FileText, label: 'Document', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  clothing: { icon: Shirt, label: 'Clothing', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  technology: { icon: Cpu, label: 'Technology', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
}

const significanceColors: Record<ItemSignificance, string> = {
  background: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  minor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  major: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  critical: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
}

interface ItemCardProps {
  item: Item
  onClick?: () => void
  selected?: boolean
}

export function ItemCard({ item, onClick, selected }: ItemCardProps) {
  const config = typeConfig[item.type]
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
      <div className="flex items-start gap-3 mb-3">
        <div className={cn('p-2 rounded-lg', config.color)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">
            {item.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn('text-xs px-2 py-0.5 rounded-full', config.color)}>
              {config.label}
            </span>
            <span className={cn('text-xs px-2 py-0.5 rounded-full', significanceColors[item.significance])}>
              {item.significance}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
        {item.description}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        {item.ownerId && (
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            Owned
          </span>
        )}
        {item.locationId && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            Located
          </span>
        )}
        {item.rules.length > 0 && (
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            {item.rules.length} rule{item.rules.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </button>
  )
}
