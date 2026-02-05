'use client'

import { User, LogOut } from 'lucide-react'
import { logout } from '@/lib/actions/auth'
import { ColorSchemeToggle } from './ColorSchemeToggle'

interface HeaderProps {
  userEmail?: string | null
}

export function Header({ userEmail }: HeaderProps) {
  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 transition-colors">
      <div>
        {/* Breadcrumb or page title could go here */}
      </div>

      <div className="flex items-center gap-4">
        <ColorSchemeToggle />
        
        {userEmail && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <User className="w-4 h-4" />
            <span>{userEmail}</span>
          </div>
        )}
        
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </header>
  )
}
