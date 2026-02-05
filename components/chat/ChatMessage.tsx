'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { User, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChatMessage as ChatMessageType } from '@/lib/types/database'

interface ChatMessageProps {
  message: ChatMessageType
}

const entityRoutes: Record<string, string> = {
  character: '/characters',
  location: '/locations',
  organization: '/organizations',
  item: '/items',
  rule: '/rules',
  story: '/stories',
  event: '/timeline',
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const sources = message.metadata?.sources

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-xl',
        isUser ? 'bg-cyan-50' : 'bg-white border border-slate-200'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
          isUser ? 'bg-cyan-600' : 'bg-gradient-to-br from-violet-500 to-purple-600'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isUser ? (
          <div className="text-sm text-slate-700 whitespace-pre-wrap">
            {message.content}
          </div>
        ) : (
          <div className="text-sm text-slate-700 prose prose-sm prose-slate max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-strong:text-slate-800">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}

        {/* Sources */}
        {sources && sources.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-slate-500">Sources:</span>
            {sources.map((source, i) => (
              <Link
                key={`${source.type}-${source.id}-${i}`}
                href={`${entityRoutes[source.type]}/${source.id}`}
                className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-600 hover:bg-cyan-100 hover:text-cyan-700 transition-colors"
              >
                {source.name}
              </Link>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div className="mt-2 text-xs text-slate-400">
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  )
}
