import { Users } from 'lucide-react'
import { Badge } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Character } from '@/types/database'

interface CharacterCardProps {
  character: Character
  onClick: () => void
}

const roleColors: Record<string, 'sky' | 'rose' | 'violet' | 'slate'> = {
  protagonist: 'sky',
  antagonist: 'rose',
  supporting: 'violet',
  background: 'slate',
}

export function CharacterCard({ character, onClick }: CharacterCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700',
        'hover:border-sky-500 dark:hover:border-sky-500 cursor-pointer transition-colors p-4'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
          <Users className="w-6 h-6 text-slate-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">
            {character.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {character.role && (
              <Badge variant={roleColors[character.role] || 'slate'} size="sm">
                {character.role}
              </Badge>
            )}
            {character.species && (
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {character.species}
              </span>
            )}
          </div>
          {character.personality && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
              {character.personality}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
