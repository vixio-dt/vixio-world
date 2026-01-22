import { BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Story } from '@/types/database'

interface StoryCardProps {
  story: Story
  onClick: () => void
}

const statusColors: Record<string, 'slate' | 'amber' | 'sky' | 'emerald'> = {
  concept: 'slate',
  outline: 'amber',
  draft: 'sky',
  complete: 'emerald',
}

export function StoryCard({ story, onClick }: StoryCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700',
        'hover:border-sky-500 dark:hover:border-sky-500 cursor-pointer transition-colors p-4'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">{story.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            {story.status && (
              <Badge variant={statusColors[story.status] || 'slate'} size="sm">
                {story.status}
              </Badge>
            )}
            {story.genre && (
              <span className="text-xs text-slate-500 dark:text-slate-400">{story.genre}</span>
            )}
          </div>
          {story.logline && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
              {story.logline}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
