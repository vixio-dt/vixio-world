import Link from 'next/link'
import { User } from 'lucide-react'
import type { Character } from '@/lib/types/database'

interface CharacterCardProps {
  character: Character
}

const roleColors = {
  protagonist: 'bg-green-100 text-green-700',
  antagonist: 'bg-red-100 text-red-700',
  supporting: 'bg-blue-100 text-blue-700',
  background: 'bg-slate-100 dark:bg-slate-700 text-slate-700',
}

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Link
      href={`/characters/${character.id}`}
      className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:border-cyan-300 dark:hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/20 transition-colors">
          <User className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
            {character.name}
          </h3>
          {character.role && (
            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium capitalize ${roleColors[character.role] || roleColors.background}`}>
              {character.role}
            </span>
          )}
          {character.species && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{character.species}</p>
          )}
          {character.personality && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
              {character.personality}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
