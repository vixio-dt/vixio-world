import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { WorldSwitcher } from './WorldSwitcher'
import { UserMenu } from './UserMenu'
import * as Dialog from '@radix-ui/react-dialog'
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  MapPin,
  Building2,
  Clock,
  Package,
  Scale,
  BookOpen,
  Download,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Characters', href: '/characters', icon: <Users className="h-5 w-5" /> },
  { label: 'Locations', href: '/locations', icon: <MapPin className="h-5 w-5" /> },
  { label: 'Organizations', href: '/organizations', icon: <Building2 className="h-5 w-5" /> },
  { label: 'Timeline', href: '/timeline', icon: <Clock className="h-5 w-5" /> },
  { label: 'Items', href: '/items', icon: <Package className="h-5 w-5" /> },
  { label: 'Rules', href: '/rules', icon: <Scale className="h-5 w-5" /> },
  { label: 'Stories', href: '/stories', icon: <BookOpen className="h-5 w-5" /> },
  { label: 'Export', href: '/export', icon: <Download className="h-5 w-5" /> },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="lg:hidden">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4">
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
            <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 shadow-xl">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    Vixio
                  </span>
                  <Dialog.Close asChild>
                    <button className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* World Switcher */}
                <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                  <WorldSwitcher />
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors',
                        (item.href === '/' ? location.pathname === '/' : location.pathname.startsWith(item.href))
                          ? 'bg-sky-500 text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      )}
                    >
                      {item.icon}
                      <span className="font-display">{item.label}</span>
                    </Link>
                  ))}
                </nav>

                {/* Footer */}
                <div className="p-3 border-t border-slate-200 dark:border-slate-700">
                  <UserMenu />
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <span className="font-display font-bold text-slate-900 dark:text-white">
          Vixio
        </span>

        <div className="w-10" /> {/* Spacer for balance */}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14" />
    </div>
  )
}
