'use client'

import { AppShell, Burger, Group, ScrollArea, NavLink, useMantineColorScheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
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
  Network,
  Upload,
  User,
  LogOut
} from 'lucide-react'
import { logout } from '@/lib/actions/auth'
import { ColorSchemeToggle } from './ColorSchemeToggle'
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
  { href: '/import', label: 'Import', icon: Upload },
  { href: '/chat', label: 'AI Chat', icon: MessageSquare },
  { href: '/export', label: 'Export', icon: Download },
]

interface DashboardShellProps {
  children: React.ReactNode
  userEmail?: string | null
  worldId?: string | null
}

export function DashboardShell({ children, userEmail }: DashboardShellProps) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
  const pathname = usePathname()
  const { colorScheme } = useMantineColorScheme()

  // Close mobile nav when navigating
  const handleNavClick = () => {
    if (mobileOpened) {
      toggleMobile()
    }
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'md',
        collapsed: { mobile: !mobileOpened },
      }}
      padding="md"
      styles={{
        main: {
          backgroundColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-8)' : 'var(--mantine-color-gray-0)',
          minHeight: '100vh',
        },
        header: {
          backgroundColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-7)' : 'white',
          borderColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-5)' : 'var(--mantine-color-gray-2)',
        },
        navbar: {
          backgroundColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-7)' : 'white',
          borderColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-5)' : 'var(--mantine-color-gray-2)',
        },
      }}
    >
      {/* Header */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          {/* Left: Burger (mobile) + Logo */}
          <Group gap="sm">
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="md"
              size="sm"
              aria-label="Toggle navigation"
            />
            <Link href="/dashboard" className="flex items-center">
              <Image
                src="/vixio-logo.svg"
                alt="Vixio"
                width={100}
                height={40}
                className="h-8 w-auto dark:brightness-110"
                priority
              />
            </Link>
          </Group>

          {/* Right: User actions */}
          <Group gap="md">
            <ColorSchemeToggle />
            
            {userEmail && (
              <Group gap="xs" className="hidden sm:flex text-sm text-slate-600 dark:text-slate-300">
                <User className="w-4 h-4" />
                <span className="hidden lg:inline">{userEmail}</span>
              </Group>
            )}
            
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Navbar / Sidebar */}
      <AppShell.Navbar>
        {/* World Switcher */}
        <AppShell.Section p="md" className="border-b border-slate-200 dark:border-slate-700">
          <WorldSwitcher />
        </AppShell.Section>

        {/* Main Navigation */}
        <AppShell.Section grow component={ScrollArea} p="md">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <NavLink
                key={item.href}
                component={Link}
                href={item.href}
                label={item.label}
                leftSection={<item.icon size={18} />}
                active={isActive}
                onClick={handleNavClick}
                styles={(theme) => ({
                  root: {
                    borderRadius: theme.radius.lg,
                    marginBottom: 4,
                    fontWeight: 500,
                    '&[dataActive]': {
                      background: `linear-gradient(135deg, ${theme.colors.cyan[0]} 0%, ${theme.colors.teal[0]} 100%)`,
                      color: theme.colors.cyan[7],
                    },
                    '&[dataActive][data-mantine-color-scheme="dark"]': {
                      background: `linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, rgba(45, 212, 191, 0.15) 100%)`,
                      color: theme.colors.cyan[4],
                    },
                  },
                })}
              />
            )
          })}
        </AppShell.Section>

        {/* Bottom Navigation */}
        <AppShell.Section p="md" className="border-t border-slate-200 dark:border-slate-700">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <NavLink
                key={item.href}
                component={Link}
                href={item.href}
                label={item.label}
                leftSection={<item.icon size={18} />}
                active={isActive}
                onClick={handleNavClick}
                styles={(theme) => ({
                  root: {
                    borderRadius: theme.radius.lg,
                    marginBottom: 4,
                    fontWeight: 500,
                  },
                })}
              />
            )
          })}
        </AppShell.Section>
      </AppShell.Navbar>

      {/* Main Content */}
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  )
}
