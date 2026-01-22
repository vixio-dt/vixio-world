import { createContext, useContext, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TabsContextType {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

interface TabsProps {
  defaultTab: string
  children: ReactNode
  className?: string
}

export function Tabs({ defaultTab, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabListProps {
  children: ReactNode
  className?: string
}

export function TabList({ children, className }: TabListProps) {
  return (
    <div
      className={cn(
        'flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg',
        className
      )}
    >
      {children}
    </div>
  )
}

interface TabProps {
  value: string
  children: ReactNode
  className?: string
}

export function Tab({ value, children, className }: TabProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('Tab must be used within Tabs')

  const { activeTab, setActiveTab } = context
  const isActive = activeTab === value

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        'px-4 py-2 rounded-md text-sm font-medium transition-colors',
        isActive
          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
        className
      )}
    >
      {children}
    </button>
  )
}

interface TabPanelProps {
  value: string
  children: ReactNode
  className?: string
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabPanel must be used within Tabs')

  const { activeTab } = context

  if (activeTab !== value) return null

  return <div className={className}>{children}</div>
}
