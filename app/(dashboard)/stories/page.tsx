import Link from 'next/link'
import { Plus, BookOpen, Globe } from 'lucide-react'
import { getStories } from '@/lib/actions/stories'
import { Button, EmptyState } from '@/components/ui'
import { StoryCard } from '@/components/stories'
import { cookies } from 'next/headers'

export default async function StoriesPage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value

  if (!worldId) {
    return (
      <EmptyState
        icon={Globe}
        title="No world selected"
        description="Please select or create a world to view stories."
      />
    )
  }

  const stories = await getStories(worldId)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Stories</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Narratives set in your world</p>
        </div>
        <Link href="/stories/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Story
          </Button>
        </Link>
      </div>

      {stories.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No stories yet"
          description="Create your first story to start writing in your world."
          action={{
            label: 'Create Story',
            href: '/stories/new',
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  )
}
