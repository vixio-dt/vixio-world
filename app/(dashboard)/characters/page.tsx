import Link from 'next/link'
import { Plus, Users, Globe } from 'lucide-react'
import { cookies } from 'next/headers'
import { getCharacters } from '@/lib/actions/characters'
import { Button, EmptyState } from '@/components/ui'
import { CharacterCard } from '@/components/characters'

export default async function CharactersPage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value

  if (!worldId) {
    return (
      <EmptyState
        icon={Globe}
        title="No world selected"
        description="Please select or create a world to view characters."
      />
    )
  }

  const characters = await getCharacters(worldId)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Characters</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {characters.length} character{characters.length !== 1 ? 's' : ''} in your world
          </p>
        </div>
        <Link href="/characters/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Character
          </Button>
        </Link>
      </div>

      {characters.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No characters yet"
          description="Create your first character to start building your cast"
          action={{
            label: 'Create Character',
            href: '/characters/new',
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {characters.map((character, index) => (
            <CharacterCard key={character.id} character={character} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
