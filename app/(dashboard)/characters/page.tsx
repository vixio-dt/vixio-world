import Link from 'next/link'
import { Plus, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button, EmptyState } from '@/components/ui'
import { CharacterCard } from '@/components/characters'
import type { Character } from '@/lib/types/database'

export default async function CharactersPage() {
  const supabase = await createClient()
  
  // For now, get all characters (later: filter by selected world)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: characters, error } = await (supabase as any)
    .from('characters')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching characters:', error)
  }

  const characterList = (characters || []) as unknown as Character[]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Characters</h1>
          <p className="text-slate-600 mt-2">
            {characterList.length} character{characterList.length !== 1 ? 's' : ''} in your world
          </p>
        </div>
        <Link href="/characters/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Character
          </Button>
        </Link>
      </div>

      {characterList.length === 0 ? (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characterList.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      )}
    </div>
  )
}
