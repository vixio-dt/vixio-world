import { MessageCircle } from 'lucide-react'

export function ChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          World Chat
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Ask questions about your world, check consistency, get suggestions
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="w-16 h-16 rounded-2xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center mb-4">
          <MessageCircle className="w-8 h-8 text-sky-500" />
        </div>
        <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-1">
          AI Chat Coming Soon
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-md">
          Query your world, check for inconsistencies, and get story suggestions powered by AI.
        </p>
      </div>
    </div>
  )
}
