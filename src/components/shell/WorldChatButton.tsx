import { useState } from 'react'
import { cn } from '@/lib/utils'
import { MessageCircle, X, Send } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'

export function WorldChatButton() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className={cn(
            'fixed bottom-6 right-6 z-40',
            'w-14 h-14 rounded-full',
            'bg-sky-500 hover:bg-sky-600 text-white',
            'shadow-lg hover:shadow-xl',
            'flex items-center justify-center',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2'
          )}
          title="World Chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/20" />
        <Dialog.Content
          className={cn(
            'fixed z-50',
            'bottom-24 right-6',
            'w-96 max-w-[calc(100vw-3rem)]',
            'h-[60vh] max-h-[500px]',
            'bg-white dark:bg-slate-900',
            'rounded-2xl shadow-2xl',
            'border border-slate-200 dark:border-slate-700',
            'flex flex-col',
            'focus:outline-none'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <div>
              <Dialog.Title className="font-display font-semibold text-slate-900 dark:text-white">
                World Chat
              </Dialog.Title>
              <Dialog.Description className="text-sm text-slate-500 dark:text-slate-400">
                Ask questions about your world
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-center text-slate-500 dark:text-slate-400 text-sm">
              <p>AI chat coming soon!</p>
              <p className="mt-2 text-xs">
                Ask about characters, check consistency, get story suggestions.
              </p>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about your world..."
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                disabled
              />
              <button
                className="px-4 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors disabled:opacity-50"
                disabled
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
