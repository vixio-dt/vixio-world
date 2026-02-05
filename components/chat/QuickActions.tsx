'use client'

import { Zap, AlertCircle, Lightbulb, Network, BarChart3 } from 'lucide-react'

interface QuickActionsProps {
  onAction: (command: string) => void
  disabled?: boolean
}

const actions = [
  { command: '/status', label: 'Status', icon: BarChart3 },
  { command: '/gaps', label: 'Find Gaps', icon: AlertCircle },
  { command: '/suggest story', label: 'Story Ideas', icon: Lightbulb },
  { command: '/connections ', label: 'Connections', icon: Network },
]

export function QuickActions({ onAction, disabled }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 p-4 border-t border-slate-100 bg-slate-50">
      <span className="text-xs text-slate-500 flex items-center gap-1 mr-2">
        <Zap className="w-3 h-3" /> Quick:
      </span>
      {actions.map((action) => (
        <button
          key={action.command}
          onClick={() => onAction(action.command)}
          disabled={disabled}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-cyan-50 hover:border-cyan-200 hover:text-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <action.icon className="w-3.5 h-3.5" />
          {action.label}
        </button>
      ))}
    </div>
  )
}
