import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { User, LogOut, Settings } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

interface UserMenuProps {
  collapsed?: boolean
}

export function UserMenu({ collapsed = false }: UserMenuProps) {
  const { user, signOut } = useAuth()

  if (!user) return null

  const initials = user.email?.substring(0, 2).toUpperCase() || 'U'

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            'w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left',
            collapsed && 'justify-center'
          )}
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {initials}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {user.email}
              </p>
            </div>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[180px] bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-1 z-50"
          sideOffset={5}
          align={collapsed ? 'center' : 'start'}
        >
          <DropdownMenu.Item
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer outline-none',
              'text-slate-700 dark:text-slate-200',
              'hover:bg-slate-100 dark:hover:bg-slate-700',
              'focus:bg-slate-100 dark:focus:bg-slate-700'
            )}
            onSelect={() => {
              // TODO: Navigate to settings
            }}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-slate-200 dark:bg-slate-700 my-1" />

          <DropdownMenu.Item
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer outline-none',
              'text-red-600 dark:text-red-400',
              'hover:bg-red-50 dark:hover:bg-red-900/20',
              'focus:bg-red-50 dark:focus:bg-red-900/20'
            )}
            onSelect={() => signOut()}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
