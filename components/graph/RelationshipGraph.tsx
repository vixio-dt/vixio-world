'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { GraphControls } from './GraphControls'
import type { GraphData, GraphNode } from '@/lib/actions/graph'
import type { EntityType } from '@/lib/types/database'

// Dynamic import to avoid SSR issues with canvas
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false }) as any

interface RelationshipGraphProps {
  data: GraphData
}

const entityColors: Record<EntityType, string> = {
  character: '#22d3ee', // cyan-400
  location: '#10b981', // emerald-500
  organization: '#a855f7', // purple-500
  event: '#f43f5e', // rose-500
  item: '#f59e0b', // amber-500
  rule: '#6366f1', // indigo-500
  story: '#14b8a6', // teal-500
}

const entityPaths: Record<EntityType, string> = {
  character: '/characters',
  location: '/locations',
  organization: '/organizations',
  event: '/timeline',
  item: '/items',
  rule: '/rules',
  story: '/stories',
}

export function RelationshipGraph({ data }: RelationshipGraphProps) {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  const [typeFilters, setTypeFilters] = useState<Record<EntityType, boolean>>({
    character: true,
    location: true,
    organization: true,
    event: true,
    item: true,
    rule: true,
    story: true,
  })

  const [searchQuery, setSearchQuery] = useState('')

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Filter nodes and edges based on type filters
  const filteredData = {
    nodes: data.nodes.filter((node) => typeFilters[node.type]),
    links: data.edges
      .filter((edge) => {
        const sourceNode = data.nodes.find((n) => n.id === edge.source)
        const targetNode = data.nodes.find((n) => n.id === edge.target)
        return sourceNode && targetNode && typeFilters[sourceNode.type] && typeFilters[targetNode.type]
      })
      .map((edge) => ({ ...edge })), // Clone for react-force-graph
  }

  // Derive highlighted node from search query (no effect needed)
  const highlightedNodeId = searchQuery
    ? data.nodes.find((n) => n.name.toLowerCase().includes(searchQuery.toLowerCase()))?.id || null
    : null

  const handleToggleType = useCallback((type: EntityType) => {
    setTypeFilters((prev) => ({ ...prev, [type]: !prev[type] }))
  }, [])

  const handleCenter = useCallback(() => {
    graphRef.current?.centerAt(0, 0, 500)
    graphRef.current?.zoom(1, 500)
  }, [])

  const handleFullscreen = useCallback(() => {
    containerRef.current?.requestFullscreen?.()
  }, [])

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      const path = entityPaths[node.type]
      router.push(`${path}/${node.id}`)
    },
    [router]
  )

  const nodeCanvasObject = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const label = node.name
      const fontSize = 12 / globalScale
      ctx.font = `${fontSize}px Sans-Serif`
      
      const nodeSize = Math.max(5, Math.min(15, 5 + node.connectionCount * 2))
      const isHighlighted = node.id === highlightedNodeId

      // Node circle
      ctx.beginPath()
      ctx.arc(node.x || 0, node.y || 0, nodeSize, 0, 2 * Math.PI)
      ctx.fillStyle = entityColors[node.type as EntityType] || '#64748b'
      ctx.fill()

      // Highlight ring
      if (isHighlighted) {
        ctx.strokeStyle = '#fbbf24'
        ctx.lineWidth = 3 / globalScale
        ctx.stroke()
      }

      // Label
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#f1f5f9'
      ctx.fillText(label, node.x || 0, (node.y || 0) + nodeSize + fontSize)
    },
    [highlightedNodeId]
  )

  return (
    <div ref={containerRef} className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden">
      <GraphControls
        typeFilters={typeFilters}
        onToggleType={handleToggleType}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCenter={handleCenter}
        onFullscreen={handleFullscreen}
      />

      {filteredData.nodes.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-slate-400 text-lg">
            No entities to display. Create some entities and add @mentions to see relationships.
          </p>
        </div>
      ) : (
        <ForceGraph2D
          ref={graphRef}
          graphData={filteredData}
          width={dimensions.width}
          height={dimensions.height}
          nodeId="id"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          nodeLabel={(node: any) => `${node.name} (${node.type})`}
          nodeCanvasObject={nodeCanvasObject}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
            const nodeSize = Math.max(5, Math.min(15, 5 + node.connectionCount * 2))
            ctx.fillStyle = color
            ctx.beginPath()
            ctx.arc(node.x || 0, node.y || 0, nodeSize, 0, 2 * Math.PI)
            ctx.fill()
          }}
          linkColor={() => 'rgba(148, 163, 184, 0.5)'}
          linkWidth={1}
          onNodeClick={handleNodeClick}
          backgroundColor="#0f172a"
          cooldownTicks={100}
          enableNodeDrag={true}
          enableZoomInteraction={true}
          enablePanInteraction={true}
        />
      )}
    </div>
  )
}
