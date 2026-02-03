'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Building2, 
  Calendar, 
  Package, 
  Scale, 
  BookOpen,
  MessageSquare,
  Download,
  Network
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { WorldSwitcher } from './WorldSwitcher'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/characters', label: 'Characters', icon: Users },
  { href: '/locations', label: 'Locations', icon: MapPin },
  { href: '/organizations', label: 'Organizations', icon: Building2 },
  { href: '/timeline', label: 'Timeline', icon: Calendar },
  { href: '/items', label: 'Items', icon: Package },
  { href: '/rules', label: 'Rules', icon: Scale },
  { href: '/stories', label: 'Stories', icon: BookOpen },
  { href: '/graph', label: 'Graph', icon: Network },
]

const bottomNavItems = [
  { href: '/chat', label: 'AI Chat', icon: MessageSquare },
  { href: '/export', label: 'Export', icon: Download },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-slate-200">
        <Link href="/dashboard" className="flex items-center justify-center">
          <Image
            src="/vixio-logo.svg"
            alt="Vixio"
            width={160}
            height={80}
            className="h-20 w-auto"
          />
        </Link>
      </div>

      {/* World Switcher */}
      <div className="p-4 border-b border-slate-200">
        <WorldSwitcher />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-cyan-50 to-teal-50 text-cyan-600 shadow-sm'
                  : 'text-slate-600 hover:bg-cyan-50/50 hover:text-cyan-700'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-slate-200 space-y-1">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-cyan-50 to-teal-50 text-cyan-600 shadow-sm'
                  : 'text-slate-600 hover:bg-cyan-50/50 hover:text-cyan-700'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
