import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button, Card, CardContent } from '@/components/ui'
import { ContentBlocksDisplay } from '@/components/content-blocks'
import { deleteCharacter } from '@/lib/actions/characters'
import type { Character } from '@/lib/types/database'

interface CharacterPageProps {
  params: Promise<{ id: string }>
}

const roleLabels = {
  protagonist: 'Protagonist',
  antagonist: 'Antagonist',
  supporting: 'Supporting',
  background: 'Background',
}

export default async function CharacterPage({ params }: CharacterPageProps) {
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

  async function handleDelete() {
    'use server'
    await deleteCharacter(id)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/characters" 
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Characters
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <div className="p-4 bg-sky-50 rounded-xl">
            <User className="w-8 h-8 text-sky-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{char.name}</h1>
            {char.role && (
              <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                {roleLabels[char.role]}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/characters/${id}/edit`}>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <form action={handleDelete}>
            <Button variant="destructive" type="submit">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </form>
        </div>
      </div>

      {char.story_context && (
        <Card className="mb-6 border-sky-200 bg-sky-50">
          <CardContent className="py-4">
            <h3 className="text-sm font-medium text-sky-700 mb-1">Story Context</h3>
            <p className="text-slate-900 whitespace-pre-wrap">{char.story_context}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {char.species && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Species</h3>
              <p className="text-slate-900">{char.species}</p>
            </CardContent>
          </Card>
        )}

        {char.appearance && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Appearance</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{char.appearance}</p>
            </CardContent>
          </Card>
        )}

        {char.personality && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Personality</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{char.personality}</p>
            </CardContent>
          </Card>
        )}

        {char.background && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Background</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{char.background}</p>
            </CardContent>
          </Card>
        )}

        {char.motivations && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Motivations</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{char.motivations}</p>
            </CardContent>
          </Card>
        )}

        {char.arc_potential && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Character Arc</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{char.arc_potential}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {char.content_blocks && char.content_blocks.length > 0 && (
        <div className="mt-8">
          <ContentBlocksDisplay blocks={char.content_blocks} />
        </div>
      )}
    </div>
  )
}
