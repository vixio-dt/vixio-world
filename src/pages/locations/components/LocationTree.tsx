import { useState, useMemo } from 'react'
import { ChevronRight, ChevronDown, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Location } from '@/types/database'

interface LocationTreeProps {
  locations: Location[]
  selectedId?: string
  onSelect: (location: Location) => void
}

interface TreeNode {
  location: Location
  children: TreeNode[]
}

export function LocationTree({ locations, selectedId, onSelect }: LocationTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  // Build tree structure
  const tree = useMemo(() => {
    const nodeMap = new Map<string, TreeNode>()
    const roots: TreeNode[] = []

    // Create nodes
    locations.forEach(location => {
      nodeMap.set(location.id, { location, children: [] })
    })

    // Build tree
    locations.forEach(location => {
      const node = nodeMap.get(location.id)!
      if (location.parent_location_id) {
        const parent = nodeMap.get(location.parent_location_id)
        if (parent) {
          parent.children.push(node)
        } else {
          roots.push(node)
        }
      } else {
        roots.push(node)
      }
    })

    // Sort children alphabetically
    const sortChildren = (nodes: TreeNode[]) => {
      nodes.sort((a, b) => a.location.name.localeCompare(b.location.name))
      nodes.forEach(node => sortChildren(node.children))
    }
    sortChildren(roots)

    return roots
  }, [locations])

  const toggleExpanded = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const hasChildren = node.children.length > 0
    const isExpanded = expanded.has(node.location.id)
    const isSelected = node.location.id === selectedId

    return (
      <div key={node.location.id}>
        <div
          onClick={() => onSelect(node.location)}
          className={cn(
            'flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors',
            isSelected
              ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-900 dark:text-sky-100'
              : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
          )}
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
        >
          {hasChildren ? (
            <button
              onClick={(e) => toggleExpanded(node.location.id, e)}
              className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ) : (
            <span className="w-5" />
          )}
          <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span className="truncate font-medium">{node.location.name}</span>
          {node.location.type && (
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
              {node.location.type}
            </span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  if (tree.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        No locations yet
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {tree.map(node => renderNode(node))}
    </div>
  )
}
