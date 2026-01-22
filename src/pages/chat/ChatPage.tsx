import { useState } from 'react'
import { useWorld } from '@/contexts/WorldContext'
import { MessageSquare, Send, Sparkles, Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function ChatPage() {
  const { currentWorld } = useWorld()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response (placeholder)
    setTimeout(() => {
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Thanks for your question about ${currentWorld?.name || 'your world'}! AI chat integration is coming soon. This feature will help you:\n\n• Query your world's data using natural language\n• Check for consistency issues\n• Generate story ideas based on your world elements\n• Get character and location suggestions\n\nStay tuned!`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const suggestedQueries = [
    "Who are the main protagonists?",
    "What locations haven't been used in any story?",
    "Are there any timeline inconsistencies?",
    "Suggest a conflict between two organizations",
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            World Chat
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            AI-powered assistant for {currentWorld?.name || 'your world'}
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                AI Chat Coming Soon
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
                Ask questions about your world, check for inconsistencies, or get creative suggestions. Try one of these:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg">
                {suggestedQueries.map((query, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(query)}
                    className="px-4 py-2 text-sm text-left rounded-lg border border-slate-200 dark:border-slate-600 hover:border-violet-500 dark:hover:border-violet-500 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'flex-row-reverse' : ''
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    message.role === 'user'
                      ? 'bg-sky-100 dark:bg-sky-900/30'
                      : 'bg-violet-100 dark:bg-violet-900/30'
                  )}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  ) : (
                    <Bot className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  )}
                </div>
                <div
                  className={cn(
                    'max-w-[80%] rounded-xl px-4 py-3',
                    message.role === 'user'
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-700 rounded-xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your world..."
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
