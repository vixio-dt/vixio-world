import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { CharacterForm } from '@/components/characters'
import { createCharacter } from '@/lib/actions/characters'

export default async function NewCharacterPage() {
  const supabase = await createClient()
  
  // Get the first world for now (later: use selected world from context)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: worlds } = await (supabase as any)
    .from('worlds')
    .select('id')
    .limit(1)

  // If no world exists, redirect to dashboard
  // (In a full implementation, we'd prompt to create a world first)
  if (!worlds || worlds.length === 0) {
    redirect('/dashboard')
  }

  const worldId = (worlds[0] as { id: string }).id

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create Character</CardTitle>
          <CardDescription>
            Add a new character to your world
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CharacterForm
            worldId={worldId}
            action={createCharacter}
            submitLabel="Create Character"
          />
        </CardContent>
      </Card>
    </div>
  )
}
