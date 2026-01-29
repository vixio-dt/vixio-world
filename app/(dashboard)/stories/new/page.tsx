import Link from 'next/link'
import { ArrowLeft, Globe } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, EmptyState } from '@/components/ui'
import { StoryForm } from '@/components/stories'
import { createStory } from '@/lib/actions/stories'
import { cookies } from 'next/headers'

export default async function NewStoryPage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('selected_world_id')?.value

  if (!worldId) {
    return (
      <EmptyState
        icon={Globe}
        title="No world selected"
        description="Please select or create a world before adding a story."
      />
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/stories" 
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Stories
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Story</CardTitle>
          <CardDescription>
            Create a new narrative set in your world
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StoryForm
            worldId={worldId}
            action={createStory}
            submitLabel="Create Story"
          />
        </CardContent>
      </Card>
    </div>
  )
}
