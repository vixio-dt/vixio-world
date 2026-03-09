import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { DashboardShell } from '@/components/shell'
import { CommandPalette } from '@/components/search'
import { ToastProvider } from './toast-provider'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let userEmail: string | undefined
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    userEmail = user?.email
  } catch {
    // Supabase unreachable – render shell without user email
  }
  
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value || null

  return (
    <ToastProvider>
      <DashboardShell userEmail={userEmail}>
        {children}
      </DashboardShell>
      <CommandPalette worldId={worldId} />
    </ToastProvider>
  )
}
