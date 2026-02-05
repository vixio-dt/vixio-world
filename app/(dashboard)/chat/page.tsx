'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Bot, Trash2, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ChatMessage, ChatInput, QuickActions } from '@/components/chat'
import { 
  getOrCreateChatSession, 
  getChatMessages, 
  sendChatMessage, 
  clearChatHistory 
} from '@/lib/actions/chat'
import { getCurrentWorldId } from '@/lib/utils/world-context'
import type { ChatSession, ChatMessage as ChatMessageType } from '@/lib/types/database'

export default function ChatPage() {
  const [session, setSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [worldId, setWorldId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize chat session
  const initChat = useCallback(async (currentWorldId: string) => {
    setLoading(true)
    setError(null)
    setWorldId(currentWorldId)

    const chatSession = await getOrCreateChatSession(currentWorldId)
    if (!chatSession) {
      setError('Failed to create chat session')
      setLoading(false)
      return
    }
    setSession(chatSession)

    const chatMessages = await getChatMessages(chatSession.id)
    setMessages(chatMessages)
    setLoading(false)
  }, [])

  // Load session and messages on mount and when world changes
  useEffect(() => {
    const currentWorldId = getCurrentWorldId()
    if (!currentWorldId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('Please select a world first')
      setLoading(false)
      return
    }
    
    initChat(currentWorldId)

    // Listen for storage changes (world selection from other tabs/components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentWorldId' && e.newValue) {
        initChat(e.newValue)
      }
    }

    // Also poll for changes (handles same-tab world switcher)
    const pollInterval = setInterval(() => {
      const newWorldId = getCurrentWorldId()
      if (newWorldId && newWorldId !== worldId) {
        initChat(newWorldId)
      }
    }, 500)

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(pollInterval)
    }
  }, [initChat, worldId])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (content: string) => {
    if (!session || !worldId) return

    // Optimistic update - add user message immediately
    const tempUserMessage: ChatMessageType = {
      id: `temp-${Date.now()}`,
      session_id: session.id,
      role: 'user',
      content,
      command: null,
      metadata: {},
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, tempUserMessage])

    const result = await sendChatMessage(session.id, worldId, content)
    
    if ('error' in result) {
      setError(result.error)
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id))
      return
    }

    // Replace temp message with real ones
    setMessages(prev => [
      ...prev.filter(m => m.id !== tempUserMessage.id),
      result.userMessage,
      result.aiMessage,
    ])
  }

  const handleClear = async () => {
    if (!session) return
    
    const confirmed = window.confirm('Clear all chat history?')
    if (!confirmed) return

    const success = await clearChatHistory(session.id)
    if (success) {
      setMessages([])
    }
  }

  const handleQuickAction = (command: string) => {
    handleSend(command)
  }

  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
      </div>
    )
  }

  if (error === 'Please select a world first') {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">No World Selected</h2>
        <p className="text-slate-600">Please select a world from the sidebar to start chatting.</p>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">AI Chat</h1>
            <p className="text-xs text-slate-500">Ask questions about your world</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl mb-4">
              <Bot className="w-12 h-12 text-violet-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Ask me anything about your world
            </h2>
            <p className="text-slate-600 max-w-md mb-6">
              I can answer questions, check consistency, suggest stories, and find gaps in your worldbuilding.
            </p>
            <div className="text-left text-sm text-slate-500 space-y-1">
              <p><code className="bg-slate-100 px-1.5 py-0.5 rounded">/check [statement]</code> - Check consistency</p>
              <p><code className="bg-slate-100 px-1.5 py-0.5 rounded">/gaps</code> - Find underdeveloped areas</p>
              <p><code className="bg-slate-100 px-1.5 py-0.5 rounded">/suggest story</code> - Get story ideas</p>
              <p><code className="bg-slate-100 px-1.5 py-0.5 rounded">/connections [name]</code> - Explore relationships</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <QuickActions onAction={handleQuickAction} disabled={!session} />

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={!session} />
    </div>
  )
}
