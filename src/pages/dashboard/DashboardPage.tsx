import { useState, useEffect } from 'react'
import { useWorld } from '@/contexts/WorldContext'
import { useCounts } from '@/lib/hooks'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import {
  Users,
  MapPin,
  Building2,
  Clock,
  Package,
  Scale,
  BookOpen,
  AlertTriangle,
  Plus,
  ChevronRight,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

interface Activity {
  id: string
  type: 'character' | 'location' | 'organization' | 'event' | 'item' | 'rule' | 'story'
  name: string
  action: 'created' | 'updated'
  time: string
}

export function DashboardPage() {
  const { currentWorld, loading } = useWorld()

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!currentWorld) {
    return <EmptyWorldState />
  }

  return (
    <div className="space-y-8">
      <WorldHeader world={currentWorld} />
      <StatsGrid />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WarningsCard />
        <ActivityCard />
      </div>
    </div>
  )
}

function EmptyWorldState() {
  const { createWorld, setCurrentWorld } = useWorld()

  const handleCreateWorld = async () => {
    const world = await createWorld('My First World', 'Fantasy', 'Epic')
    if (world) {
      setCurrentWorld(world)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-6">
        <Plus className="w-10 h-10 text-sky-500" />
      </div>
      <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Create your first world
      </h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
        Start building your universe. Add characters, locations, rules, and weave them into compelling stories.
      </p>
      <button
        onClick={handleCreateWorld}
        className="px-6 py-3 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold transition-colors"
      >
        Create World
      </button>
    </div>
  )
}

function WorldHeader({ world }: { world: any }) {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const quickAddOptions = [
    { label: 'Character', href: '/characters', icon: Users },
    { label: 'Location', href: '/locations', icon: MapPin },
    { label: 'Organization', href: '/organizations', icon: Building2 },
    { label: 'Event', href: '/timeline', icon: Clock },
    { label: 'Item', href: '/items', icon: Package },
    { label: 'Rule', href: '/rules', icon: Scale },
    { label: 'Story', href: '/stories', icon: BookOpen },
  ]

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            {world.name}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            {world.genre && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300">
                {world.genre}
              </span>
            )}
            {world.tone && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                {world.tone}
              </span>
            )}
          </div>
          {world.logline && (
            <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl">
              {world.logline}
            </p>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                {quickAddOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => {
                      setShowMenu(false)
                      navigate(option.href)
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    <option.icon className="w-4 h-4" />
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function StatsGrid() {
  const { counts, loading } = useCounts()

  const stats = [
    { label: 'Characters', count: counts.characters, icon: Users, href: '/characters', bgColor: 'bg-sky-100 dark:bg-sky-900/30', iconColor: 'text-sky-600 dark:text-sky-400' },
    { label: 'Locations', count: counts.locations, icon: MapPin, href: '/locations', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Organizations', count: counts.organizations, icon: Building2, href: '/organizations', bgColor: 'bg-violet-100 dark:bg-violet-900/30', iconColor: 'text-violet-600 dark:text-violet-400' },
    { label: 'Events', count: counts.events, icon: Clock, href: '/timeline', bgColor: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400' },
    { label: 'Items', count: counts.items, icon: Package, href: '/items', bgColor: 'bg-rose-100 dark:bg-rose-900/30', iconColor: 'text-rose-600 dark:text-rose-400' },
    { label: 'Rules', count: counts.rules, icon: Scale, href: '/rules', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30', iconColor: 'text-cyan-600 dark:text-cyan-400' },
    { label: 'Stories', count: counts.stories, icon: BookOpen, href: '/stories', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30', iconColor: 'text-indigo-600 dark:text-indigo-400' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {stats.map((stat) => (
        <Link
          key={stat.label}
          to={stat.href}
          className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-500 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', stat.bgColor)}>
              <stat.icon className={cn('w-5 h-5', stat.iconColor)} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {loading ? '-' : stat.count}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

function WarningsCard() {
  const warnings: any[] = []

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h2 className="font-display font-semibold text-slate-900 dark:text-white">
            Consistency Warnings
          </h2>
        </div>
        {warnings.length > 0 && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
            {warnings.length}
          </span>
        )}
      </div>
      <div className="p-4">
        {warnings.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              World is consistent!
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {warnings.map((warning, i) => (
              <li key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
                <span className="text-sm text-slate-700 dark:text-slate-300">{warning.message}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function ActivityCard() {
  const { currentWorld } = useWorld()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchActivity() {
      if (!currentWorld) return

      setLoading(true)
      const recentItems: Activity[] = []

      // Fetch recent items from each table
      const tables = [
        { table: 'characters', type: 'character' as const },
        { table: 'locations', type: 'location' as const },
        { table: 'organizations', type: 'organization' as const },
        { table: 'events', type: 'event' as const },
        { table: 'items', type: 'item' as const },
        { table: 'rules', type: 'rule' as const },
        { table: 'stories', type: 'story' as const },
      ]

      for (const { table, type } of tables) {
        const { data } = await supabase
          .from(table)
          .select('id, name, title, created_at, updated_at')
          .eq('world_id', currentWorld.id)
          .order('updated_at', { ascending: false })
          .limit(3)

        if (data) {
          data.forEach((item: any) => {
            const name = item.name || item.title
            const createdAt = new Date(item.created_at)
            const updatedAt = new Date(item.updated_at)
            const isNew = updatedAt.getTime() - createdAt.getTime() < 1000 // Within 1 second

            recentItems.push({
              id: `${type}-${item.id}`,
              type,
              name,
              action: isNew ? 'created' : 'updated',
              time: item.updated_at,
            })
          })
        }
      }

      // Sort by time and take top 10
      recentItems.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      setActivities(recentItems.slice(0, 10))
      setLoading(false)
    }

    fetchActivity()
  }, [currentWorld])

  const formatTime = (time: string) => {
    const date = new Date(time)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const icons: Record<string, any> = {
    character: Users,
    location: MapPin,
    organization: Building2,
    event: Clock,
    item: Package,
    rule: Scale,
    story: BookOpen,
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="font-display font-semibold text-slate-900 dark:text-white">
          Recent Activity
        </h2>
      </div>
      <div className="p-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-slate-600 dark:text-slate-400">
              No recent activity
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
              Start adding elements to your world
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {activities.map((activity) => {
              const Icon = icons[activity.type]
              return (
                <li key={activity.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-medium">{activity.name}</span>{' '}
                      <span className="text-slate-500">was {activity.action}</span>
                    </p>
                    <p className="text-xs text-slate-500">{formatTime(activity.time)}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
