import {
  BookOpen,
  Download,
  LayoutDashboard,
  MessageSquare,
  Network,
  Package,
  type LucideIcon,
} from 'lucide-react'

export interface NavigationItem {
  href: string
  label: string
  icon: LucideIcon
}

export const primaryNavItems: NavigationItem[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/boards', label: 'Boards', icon: Network },
  { href: '/canon', label: 'Canon', icon: BookOpen },
  { href: '/assets', label: 'Assets', icon: Package },
]

export const utilityNavItems: NavigationItem[] = [
  { href: '/chat', label: 'Agent Chat', icon: MessageSquare },
  { href: '/export', label: 'Exports', icon: Download },
]
