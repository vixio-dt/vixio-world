import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { 
  Users, 
  MapPin, 
  Building2, 
  Calendar, 
  Package, 
  Scale, 
  BookOpen,
  ArrowRight
} from 'lucide-react'

const entityTypes = [
  { 
    href: '/characters', 
    label: 'Characters', 
    icon: Users,
    description: 'Create and manage your cast of characters',
    table: 'characters'
  },
  { 
    href: '/locations', 
    label: 'Locations', 
    icon: MapPin,
    description: 'Define the places in your world',
    table: 'locations'
  },
  { 
    href: '/organizations', 
    label: 'Organizations', 
    icon: Building2,
    description: 'Build factions, governments, and groups',
    table: 'organizations'
  },
  { 
    href: '/timeline', 
    label: 'Timeline', 
    icon: Calendar,
    description: 'Track events and history',
    table: 'events'
  },
  { 
    href: '/items', 
    label: 'Items', 
    icon: Package,
    description: 'Catalog important objects and artifacts',
    table: 'items'
  },
  { 
    href: '/rules', 
    label: 'Rules', 
    icon: Scale,
    description: 'Document the laws of your world',
    table: 'rules'
  },
  { 
    href: '/stories', 
    label: 'Stories', 
    icon: BookOpen,
    description: 'Write and organize your narratives',
    table: 'stories'
  },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Get counts for each entity type
  const counts: Record<string, number> = {}
  
  for (const entity of entityTypes) {
    const { count } = await supabase
      .from(entity.table)
      .select('*', { count: 'exact', head: true })
    counts[entity.table] = count || 0
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome to your world</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entityTypes.map((entity) => (
          <Link
            key={entity.href}
            href={entity.href}
            className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-sky-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-sky-50 rounded-lg group-hover:bg-sky-100 transition-colors">
                <entity.icon className="w-6 h-6 text-sky-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">
                {counts[entity.table]}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              {entity.label}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {entity.description}
            </p>
            <div className="flex items-center text-sm text-sky-600 font-medium group-hover:gap-2 transition-all">
              <span>View all</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
