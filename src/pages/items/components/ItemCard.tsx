import { Package } from 'lucide-react'
import { Badge } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Item } from '@/types/database'

interface ItemCardProps {
  item: Item
  onClick: () => void
}

const typeColors: Record<string, 'rose' | 'sky' | 'violet' | 'amber' | 'emerald' | 'slate' | 'cyan'> = {
  weapon: 'rose',
  vehicle: 'sky',
  artifact: 'violet',
  tool: 'slate',
  document: 'amber',
  clothing: 'emerald',
  technology: 'cyan',
}

export function ItemCard({ item, onClick }: ItemCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700',
        'hover:border-sky-500 dark:hover:border-sky-500 cursor-pointer transition-colors p-4'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0">
          <Package className="w-6 h-6 text-rose-600 dark:text-rose-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">{item.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            {item.type && (
              <Badge variant={typeColors[item.type] || 'slate'} size="sm">
                {item.type}
              </Badge>
            )}
          </div>
          {item.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
