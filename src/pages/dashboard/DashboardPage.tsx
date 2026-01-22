import { useWorld } from '@/contexts/WorldContext'
import { cn } from '@/lib/utils'
import {
  Users,
  MapPin,
  Building2,
  Clock,
  Package,
  Scale,
  AlertTriangle,
  Plus,
  ChevronRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'

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
      {/* World Header */}
      <WorldHeader world={currentWorld} />

      {/* Stats Grid */}
      <StatsGrid />

      {/* Warnings and Activity */}
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
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-medium transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>
    </div>
  )
}

function StatsGrid() {
  // TODO: Fetch actual counts from Supabase
  const stats = [
    { label: 'Characters', count: 0, icon: Users, href: '/characters', color: 'sky' },
    { label: 'Locations', count: 0, icon: MapPin, href: '/locations', color: 'emerald' },
    { label: 'Organizations', count: 0, icon: Building2, href: '/organizations', color: 'violet' },
    { label: 'Events', count: 0, icon: Clock, href: '/timeline', color: 'amber' },
    { label: 'Items', count: 0, icon: Package, href: '/items', color: 'rose' },
    { label: 'Rules', count: 0, icon: Scale, href: '/rules', color: 'cyan' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <Link
          key={stat.label}
          to={stat.href}
          className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-500 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              `bg-${stat.color}-100 dark:bg-${stat.color}-900/30`
            )}>
              <stat.icon className={cn('w-5 h-5', `text-${stat.color}-600 dark:text-${stat.color}-400`)} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stat.count}
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
  // TODO: Implement consistency checking
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
  // TODO: Implement activity tracking
  const activities: any[] = []

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="font-display font-semibold text-slate-900 dark:text-white">
          Recent Activity
        </h2>
      </div>
      <div className="p-4">
        {activities.length === 0 ? (
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
            {activities.map((activity, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {activity.message}
                  </p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
