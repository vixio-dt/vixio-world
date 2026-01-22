import { useState } from 'react'
import { useWorld } from '@/contexts/WorldContext'
import { cn } from '@/lib/utils'
import { Globe, ChevronDown, Plus, Check } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

interface WorldSwitcherProps {
  collapsed?: boolean
}

export function WorldSwitcher({ collapsed = false }: WorldSwitcherProps) {
  const { worlds, currentWorld, setCurrentWorld, createWorld } = useWorld()
  const [isCreating, setIsCreating] = useState(false)
  const [newWorldName, setNewWorldName] = useState('')

  const handleCreateWorld = async () => {
    if (!newWorldName.trim()) return
    
    const world = await createWorld(newWorldName.trim())
    if (world) {
      setCurrentWorld(world)
      setNewWorldName('')
      setIsCreating(false)
    }
  }

  if (collapsed) {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className="w-full flex items-center justify-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title={currentWorld?.name || 'Select world'}
          >
            <Globe className="h-5 w-5 text-sky-500" />
          </button>
        </DropdownMenu.Trigger>
        <WorldDropdownContent
          worlds={worlds}
          currentWorld={currentWorld}
          setCurrentWorld={setCurrentWorld}
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          newWorldName={newWorldName}
          setNewWorldName={setNewWorldName}
          handleCreateWorld={handleCreateWorld}
        />
      </DropdownMenu.Root>
    )
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="w-full flex items-center gap-3 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-left">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
            <Globe className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-slate-900 dark:text-white truncate">
              {currentWorld?.name || 'Select world'}
            </p>
            {currentWorld?.genre && (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {currentWorld.genre}
              </p>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
      </DropdownMenu.Trigger>
      <WorldDropdownContent
        worlds={worlds}
        currentWorld={currentWorld}
        setCurrentWorld={setCurrentWorld}
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        newWorldName={newWorldName}
        setNewWorldName={setNewWorldName}
        handleCreateWorld={handleCreateWorld}
      />
    </DropdownMenu.Root>
  )
}

interface WorldDropdownContentProps {
  worlds: any[]
  currentWorld: any
  setCurrentWorld: (world: any) => void
  isCreating: boolean
  setIsCreating: (value: boolean) => void
  newWorldName: string
  setNewWorldName: (value: string) => void
  handleCreateWorld: () => void
}

function WorldDropdownContent({
  worlds,
  currentWorld,
  setCurrentWorld,
  isCreating,
  setIsCreating,
  newWorldName,
  setNewWorldName,
  handleCreateWorld,
}: WorldDropdownContentProps) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        className="min-w-[220px] bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-1 z-50"
        sideOffset={5}
        align="start"
      >
        {worlds.map((world) => (
          <DropdownMenu.Item
            key={world.id}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer outline-none',
              'text-slate-700 dark:text-slate-200',
              'hover:bg-slate-100 dark:hover:bg-slate-700',
              'focus:bg-slate-100 dark:focus:bg-slate-700'
            )}
            onSelect={() => setCurrentWorld(world)}
          >
            <Globe className="h-4 w-4 text-sky-500" />
            <span className="flex-1 truncate">{world.name}</span>
            {currentWorld?.id === world.id && (
              <Check className="h-4 w-4 text-sky-500" />
            )}
          </DropdownMenu.Item>
        ))}

        {worlds.length > 0 && <DropdownMenu.Separator className="h-px bg-slate-200 dark:bg-slate-700 my-1" />}

        {isCreating ? (
          <div className="p-2">
            <input
              type="text"
              value={newWorldName}
              onChange={(e) => setNewWorldName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateWorld()
                if (e.key === 'Escape') {
                  setIsCreating(false)
                  setNewWorldName('')
                }
              }}
              placeholder="World name..."
              className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleCreateWorld}
                className="flex-1 px-3 py-1.5 text-sm font-medium rounded-md bg-sky-500 text-white hover:bg-sky-600 transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreating(false)
                  setNewWorldName('')
                }}
                className="px-3 py-1.5 text-sm font-medium rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <DropdownMenu.Item
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer outline-none',
              'text-sky-600 dark:text-sky-400',
              'hover:bg-slate-100 dark:hover:bg-slate-700',
              'focus:bg-slate-100 dark:focus:bg-slate-700'
            )}
            onSelect={(e) => {
              e.preventDefault()
              setIsCreating(true)
            }}
          >
            <Plus className="h-4 w-4" />
            <span>Create new world</span>
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  )
}
