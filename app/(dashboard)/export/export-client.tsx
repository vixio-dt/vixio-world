'use client'

import { useState } from 'react'
import { Button, Card, CardContent } from '@/components/ui'
import { Download, FileJson, FileText, Loader2 } from 'lucide-react'
import { generateJsonExport, generateMarkdownExport } from '@/lib/actions/export'
import type { EntityType } from '@/lib/types/database'

interface ExportClientProps {
  worldId: string
  worldName: string
}

const entityTypes: { type: EntityType; label: string }[] = [
  { type: 'character', label: 'Characters' },
  { type: 'location', label: 'Locations' },
  { type: 'organization', label: 'Organizations' },
  { type: 'event', label: 'Events' },
  { type: 'item', label: 'Items' },
  { type: 'rule', label: 'Rules' },
  { type: 'story', label: 'Stories' },
]

export function ExportClient({ worldId, worldName }: ExportClientProps) {
  const [selectedTypes, setSelectedTypes] = useState<Set<EntityType>>(
    new Set(entityTypes.map((e) => e.type))
  )
  const [loading, setLoading] = useState<'json' | 'markdown' | null>(null)

  const toggleType = (type: EntityType) => {
    const newSet = new Set(selectedTypes)
    if (newSet.has(type)) {
      newSet.delete(type)
    } else {
      newSet.add(type)
    }
    setSelectedTypes(newSet)
  }

  const selectAll = () => {
    setSelectedTypes(new Set(entityTypes.map((e) => e.type)))
  }

  const selectNone = () => {
    setSelectedTypes(new Set())
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleJsonExport = async () => {
    setLoading('json')
    try {
      const types = Array.from(selectedTypes)
      const content = await generateJsonExport(worldId, types.length === 7 ? undefined : types)
      const filename = `${worldName.toLowerCase().replace(/\s+/g, '-')}-export.json`
      downloadFile(content, filename, 'application/json')
    } catch (error) {
      console.error('Export error:', error)
    }
    setLoading(null)
  }

  const handleMarkdownExport = async () => {
    setLoading('markdown')
    try {
      const types = Array.from(selectedTypes)
      const content = await generateMarkdownExport(worldId, types.length === 7 ? undefined : types)
      const filename = `${worldName.toLowerCase().replace(/\s+/g, '-')}-world-bible.md`
      downloadFile(content, filename, 'text/markdown')
    } catch (error) {
      console.error('Export error:', error)
    }
    setLoading(null)
  }

  return (
    <div className="space-y-6">
      {/* Entity type selection */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-900">Select Entity Types</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={selectNone}>
                Clear
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {entityTypes.map(({ type, label }) => (
              <label
                key={type}
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedTypes.has(type)
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.has(type)}
                  onChange={() => toggleType(type)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span className="text-sm font-medium text-slate-700">{label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export formats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* JSON Export */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-50 rounded-lg">
                <FileJson className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-slate-900">JSON Export</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Raw data format. Great for backups, migrations, or API integrations.
                </p>
                <Button
                  className="mt-4"
                  onClick={handleJsonExport}
                  disabled={selectedTypes.size === 0 || loading !== null}
                >
                  {loading === 'json' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Download JSON
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Markdown Export */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-slate-900">World Bible (Markdown)</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Formatted document with all entities. Import to Notion, Obsidian, or share with collaborators.
                </p>
                <Button
                  className="mt-4"
                  onClick={handleMarkdownExport}
                  disabled={selectedTypes.size === 0 || loading !== null}
                >
                  {loading === 'markdown' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Download Markdown
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedTypes.size === 0 && (
        <p className="text-center text-slate-500">
          Select at least one entity type to export.
        </p>
      )}
    </div>
  )
}
