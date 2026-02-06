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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value || null

  return (
    <ToastProvider>
      <DashboardShell userEmail={user?.email}>
        {children}
      </DashboardShell>
      <CommandPalette worldId={worldId} />
    </ToastProvider>
  )
}
