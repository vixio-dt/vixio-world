import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { WorldSwitcher } from './WorldSwitcher'
import { UserMenu } from './UserMenu'
import {
  LayoutDashboard,
  Users,
  MapPin,
  Building2,
  Clock,
  Package,
  Scale,
  BookOpen,
  Download,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const worldElements: NavItem[] = [
  { label: 'Characters', href: '/characters', icon: <Users className="h-5 w-5" /> },
  { label: 'Locations', href: '/locations', icon: <MapPin className="h-5 w-5" /> },
  { label: 'Organizations', href: '/organizations', icon: <Building2 className="h-5 w-5" /> },
  { label: 'Timeline', href: '/timeline', icon: <Clock className="h-5 w-5" /> },
  { label: 'Items', href: '/items', icon: <Package className="h-5 w-5" /> },
  { label: 'Rules', href: '/rules', icon: <Scale className="h-5 w-5" /> },
]

const storytelling: NavItem[] = [
  { label: 'Stories', href: '/stories', icon: <BookOpen className="h-5 w-5" /> },
  { label: 'Export', href: '/export', icon: <Download className="h-5 w-5" /> },
]

export function Sidebar() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved === 'true'
  })

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed))
  }, [collapsed])

  // Keyboard shortcut: Cmd/Ctrl + B
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        setCollapsed(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-all duration-200',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'p-4 border-b border-slate-200 dark:border-slate-700 flex items-center',
        collapsed ? 'justify-center' : 'gap-3'
      )}>
        <img 
          src="/vixio-logo.svg" 
          alt="Vixio" 
          className={cn(
            'transition-all duration-200',
            collapsed ? 'w-8 h-8' : 'w-10 h-10'
          )}
        />
        {!collapsed && (
          <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
            Vixio
          </span>
        )}
      </div>

      {/* World Switcher */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-700">
        <WorldSwitcher collapsed={collapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Dashboard */}
        <NavLink
          href="/"
          icon={<LayoutDashboard className="h-5 w-5" />}
          label="Dashboard"
          active={location.pathname === '/'}
          collapsed={collapsed}
        />

        {/* World Elements */}
        <div>
          {!collapsed && (
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-3">
              World Elements
            </h3>
          )}
          <div className="space-y-1">
            {worldElements.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={location.pathname.startsWith(item.href)}
                collapsed={collapsed}
              />
            ))}
          </div>
        </div>

        {/* Storytelling */}
        <div>
          {!collapsed && (
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-3">
              Storytelling
            </h3>
          )}
          <div className="space-y-1">
            {storytelling.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={location.pathname.startsWith(item.href)}
                collapsed={collapsed}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
        <UserMenu collapsed={collapsed} />
        
        <button
          onClick={() => setCollapsed(prev => !prev)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>
    </aside>
  )
}

interface NavLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  active: boolean
  collapsed: boolean
}

function NavLink({ href, icon, label, active, collapsed }: NavLinkProps) {
  return (
    <Link
      to={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors',
        active
          ? 'bg-sky-500 text-white'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
        collapsed && 'justify-center'
      )}
      title={collapsed ? label : undefined}
    >
      {icon}
      {!collapsed && <span className="font-display">{label}</span>}
    </Link>
  )
}
