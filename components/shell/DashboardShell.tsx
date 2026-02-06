'use client'

import { AppShell, Burger, Group, ScrollArea, NavLink, Text, ActionIcon, Tooltip } from '@mantine/core'
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
}

export function DashboardShell({ children, userEmail }: DashboardShellProps) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
  const pathname = usePathname()

  const handleNavClick = () => {
    if (mobileOpened) toggleMobile()
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
    >
      {/* Header */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="md"
              size="sm"
              aria-label="Toggle navigation"
            />
            <Link href="/dashboard" aria-label="Vixio - Go to dashboard">
              <Image
                src="/vixio-logo.svg"
                alt="Vixio"
                width={100}
                height={40}
                style={{ width: 'auto', height: '32px' }}
                priority
              />
            </Link>
          </Group>

          <Group gap="sm">
            {userEmail && (
              <Group gap={6} visibleFrom="sm">
                <User size={16} />
                <Text size="sm" c="dimmed" visibleFrom="lg">{userEmail}</Text>
              </Group>
            )}
            
            <form action={logout}>
              <Tooltip label="Logout">
                <ActionIcon
                  type="submit"
                  variant="subtle"
                  color="gray"
                  size="lg"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </ActionIcon>
              </Tooltip>
            </form>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Navbar / Sidebar */}
      <AppShell.Navbar>
        <AppShell.Section p="md">
          <WorldSwitcher />
        </AppShell.Section>

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
                styles={{
                  root: {
                    borderRadius: 'var(--mantine-radius-md)',
                    marginBottom: 4,
                  },
                }}
              />
            )
          })}
        </AppShell.Section>

        <AppShell.Section p="md">
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
                styles={{
                  root: {
                    borderRadius: 'var(--mantine-radius-md)',
                    marginBottom: 4,
                  },
                }}
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
