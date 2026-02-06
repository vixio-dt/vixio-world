import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/shell'
import { Header } from '@/components/shell'
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
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header userEmail={user?.email} />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
        <CommandPalette worldId={worldId} />
      </div>
    </ToastProvider>
  )
}
