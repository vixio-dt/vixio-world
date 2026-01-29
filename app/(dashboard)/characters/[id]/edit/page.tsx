import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { CharacterForm } from '@/components/characters'
import { updateCharacter } from '@/lib/actions/characters'
import type { Character } from '@/lib/types/database'

interface EditCharacterPageProps {
  params: Promise<{ id: string }>
}

export default async function EditCharacterPage({ params }: EditCharacterPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: character, error } = await (supabase as any)
    .from('characters')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !character) {
    notFound()
  }

  const char = character as unknown as Character

  async function handleUpdate(formData: FormData) {
    'use server'
    return updateCharacter(id, formData)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link 
          href={`/characters/${id}`}
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to {char.name}
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Character</CardTitle>
          <CardDescription>
            Update {char.name}&apos;s details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CharacterForm
            character={char}
            worldId={char.world_id}
            action={handleUpdate}
            submitLabel="Save Changes"
          />
        </CardContent>
      </Card>
    </div>
  )
}
