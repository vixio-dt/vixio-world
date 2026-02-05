import { cookies } from 'next/headers'
import { Globe } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, EmptyState } from '@/components/ui'
import { CharacterForm } from '@/components/characters'
import { createCharacter } from '@/lib/actions/characters'

export default async function NewCharacterPage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value

  if (!worldId) {
    return (
      <EmptyState
        icon={Globe}
        title="No world selected"
        description="Please select or create a world before creating a character."
      />
    )
  }

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
