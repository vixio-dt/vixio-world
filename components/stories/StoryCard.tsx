'use client'

import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import type { Story } from '@/lib/types/database'

interface StoryCardProps {
  story: Story
}

const statusLabels: Record<string, string> = {
  concept: 'Concept',
  outline: 'Outline',
  draft: 'Draft',
  complete: 'Complete',
}

const statusColors: Record<string, string> = {
  concept: 'bg-slate-100 text-slate-700',
  outline: 'bg-yellow-100 text-yellow-700',
  draft: 'bg-blue-100 text-blue-700',
  complete: 'bg-green-100 text-green-700',
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <Link href={`/stories/${story.id}`}>
      <Card className="hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-cyan-50 rounded-lg">
              <BookOpen className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">{story.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                {story.status && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[story.status] || 'bg-slate-100 text-slate-700'}`}>
                    {statusLabels[story.status] || story.status}
                  </span>
                )}
                {story.genre && (
                  <span className="text-sm text-slate-500">{story.genre}</span>
                )}
              </div>
              {story.logline && (
                <p className="mt-2 text-sm text-slate-600 line-clamp-2">{story.logline}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
