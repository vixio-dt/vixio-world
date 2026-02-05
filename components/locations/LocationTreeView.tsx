'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Tree, Group, Text, Paper, Badge, ThemeIcon, RenderTreeNodePayload } from '@mantine/core'
import { 
  Globe, 
  Mountain, 
  MapPin, 
  Building2, 
  Landmark, 
  Home, 
  DoorOpen, 
  ChevronDown,
  Sparkles
} from 'lucide-react'
import type { Location } from '@/lib/types/database'
import { staggerContainer, staggerItem } from '@/lib/animations'

interface LocationTreeViewProps {
  locations: Location[]
}

// Type configuration for different location types
const typeConfig: Record<string, { icon: typeof Globe; color: string; label: string }> = {
  planet: { icon: Globe, color: 'violet', label: 'Planet' },
  continent: { icon: Mountain, color: 'emerald', label: 'Continent' },
  country: { icon: MapPin, color: 'blue', label: 'Country' },
  city: { icon: Building2, color: 'cyan', label: 'City' },
  district: { icon: Landmark, color: 'amber', label: 'District' },
  building: { icon: Home, color: 'rose', label: 'Building' },
  room: { icon: DoorOpen, color: 'slate', label: 'Room' },
}

interface TreeNode {
  value: string
  label: string
  location: Location
  children?: TreeNode[]
}

// Transform flat locations array into tree structure
function buildTree(locations: Location[]): TreeNode[] {
  const nodeMap = new Map<string, TreeNode>()
  const rootNodes: TreeNode[] = []

  // First pass: create all nodes
  locations.forEach(location => {
    nodeMap.set(location.id, {
      value: location.id,
      label: location.name,
      location,
      children: [],
    })
  })

  // Second pass: build hierarchy
  locations.forEach(location => {
    const node = nodeMap.get(location.id)!
    if (location.parent_location_id && nodeMap.has(location.parent_location_id)) {
      const parent = nodeMap.get(location.parent_location_id)!
      parent.children!.push(node)
    } else {
      rootNodes.push(node)
    }
  })

  // Sort children by type hierarchy, then name
  const typeOrder = ['planet', 'continent', 'country', 'city', 'district', 'building', 'room']
  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      const aTypeIdx = typeOrder.indexOf(a.location.type || '')
      const bTypeIdx = typeOrder.indexOf(b.location.type || '')
      if (aTypeIdx !== bTypeIdx) return aTypeIdx - bTypeIdx
      return a.label.localeCompare(b.label)
    })
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        sortNodes(node.children)
      }
    })
  }
  sortNodes(rootNodes)

  // Remove empty children arrays
  const cleanNodes = (nodes: TreeNode[]) => {
    nodes.forEach(node => {
      if (node.children && node.children.length === 0) {
        delete node.children
      } else if (node.children) {
        cleanNodes(node.children)
      }
    })
  }
  cleanNodes(rootNodes)

  return rootNodes
}

function LocationTreeNode({ node, expanded, hasChildren, elementProps }: RenderTreeNodePayload & { node: TreeNode & { location: Location } }) {
  const location = node.location
  const config = typeConfig[location.type || 'city'] || typeConfig.city
  const Icon = config.icon

  return (
    <div {...elementProps} className="py-1">
      <Link href={`/locations/${location.id}`}>
        <Paper 
          p="sm" 
          radius="md" 
          withBorder 
          className="hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition-all duration-200 cursor-pointer dark:bg-slate-800 dark:border-slate-700"
        >
          <Group gap="sm" wrap="nowrap">
            {/* Expand/Collapse indicator */}
            {hasChildren && (
              <ChevronDown 
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              />
            )}
            {!hasChildren && <div className="w-4" />}
            
            {/* Type icon */}
            <ThemeIcon size={32} radius="md" color={config.color} variant="light">
              <Icon className="w-4 h-4" />
            </ThemeIcon>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <Group gap="xs" wrap="nowrap">
                <Text fw={600} size="sm" className="text-slate-900 dark:text-slate-100 truncate">
                  {location.name}
                </Text>
                <Badge size="xs" variant="light" color={config.color}>
                  {config.label}
                </Badge>
              </Group>
              
              {location.description && (
                <Text size="xs" c="dimmed" lineClamp={1} className="mt-0.5">
                  {location.description}
                </Text>
              )}
              
              {location.story_context && (
                <Group gap={4} mt={4} wrap="nowrap">
                  <Sparkles className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                  <Text size="xs" c="emerald.6" className="dark:text-emerald-400" lineClamp={1}>
                    {location.story_context}
                  </Text>
                </Group>
              )}
            </div>
          </Group>
        </Paper>
      </Link>
    </div>
  )
}

export function LocationTreeView({ locations }: LocationTreeViewProps) {
  const treeData = useMemo(() => buildTree(locations), [locations])

  // If no hierarchical structure, show flat list
  const hasHierarchy = locations.some(l => l.parent_location_id)

  if (!hasHierarchy) {
    // Render as animated list instead of tree
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-2"
      >
        {locations.map((location, index) => {
          const config = typeConfig[location.type || 'city'] || typeConfig.city
          const Icon = config.icon
          
          return (
            <motion.div key={location.id} variants={staggerItem} custom={index}>
              <Link href={`/locations/${location.id}`}>
                <Paper 
                  p="md" 
                  radius="md" 
                  withBorder 
                  className="hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition-all duration-200 cursor-pointer dark:bg-slate-800 dark:border-slate-700"
                >
                  <Group gap="md" wrap="nowrap">
                    <ThemeIcon size={40} radius="md" color={config.color} variant="light">
                      <Icon className="w-5 h-5" />
                    </ThemeIcon>
                    
                    <div className="flex-1 min-w-0">
                      <Group gap="xs" wrap="nowrap">
                        <Text fw={600} className="text-slate-900 dark:text-slate-100 truncate">
                          {location.name}
                        </Text>
                        <Badge size="sm" variant="light" color={config.color}>
                          {config.label}
                        </Badge>
                      </Group>
                      
                      {location.description && (
                        <Text size="sm" c="dimmed" lineClamp={2} className="mt-1">
                          {location.description}
                        </Text>
                      )}
                      
                      {location.story_context && (
                        <Paper p="xs" radius="sm" className="mt-2 bg-emerald-50 dark:bg-emerald-900/20 border-l-2 border-emerald-400">
                          <Group gap="xs" wrap="nowrap">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            <Text size="xs" c="emerald.7" className="dark:text-emerald-300" lineClamp={1}>
                              {location.story_context}
                            </Text>
                          </Group>
                        </Paper>
                      )}
                    </div>
                  </Group>
                </Paper>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Tree
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data={treeData as any}
        levelOffset={32}
        expandOnClick
        renderNode={(payload) => (
          <LocationTreeNode {...payload} node={payload.node as TreeNode & { location: Location }} />
        )}
      />
    </motion.div>
  )
}
