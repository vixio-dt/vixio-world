import { useState } from 'react'
import { useWorld } from '@/contexts/WorldContext'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui'
import {
  Download,
  FileJson,
  FileText,
  Users,
  MapPin,
  BookOpen,
  Globe,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExportOption {
  id: string
  label: string
  description: string
  icon: any
  included: string[]
}

const exportOptions: ExportOption[] = [
  {
    id: 'full',
    label: 'Complete World',
    description: 'Export everything including all entities and relationships',
    icon: Globe,
    included: ['World settings', 'Characters', 'Locations', 'Organizations', 'Events', 'Items', 'Rules', 'Stories', 'Scenes', 'Shots'],
  },
  {
    id: 'characters',
    label: 'Character Sheets',
    description: 'All characters with their relationships and organizations',
    icon: Users,
    included: ['Characters', 'Relationships', 'Organization memberships', 'Location links'],
  },
  {
    id: 'locations',
    label: 'Location Guide',
    description: 'Locations with hierarchy and connected elements',
    icon: MapPin,
    included: ['Locations', 'Hierarchy', 'Connected characters'],
  },
  {
    id: 'production',
    label: 'Production Export',
    description: 'Stories, scenes, and shots formatted for production',
    icon: BookOpen,
    included: ['Stories', 'Scenes', 'Shots', 'Character appearances', 'Location references'],
  },
]

export function ExportPage() {
  const { currentWorld } = useWorld()
  const toast = useToast()
  const [selectedOption, setSelectedOption] = useState<string>('full')
  const [exporting, setExporting] = useState(false)
  const [format, setFormat] = useState<'json' | 'markdown'>('json')

  const handleExport = async () => {
    if (!currentWorld) {
      toast.error('No world selected')
      return
    }

    setExporting(true)

    try {
      const worldId = currentWorld.id
      let exportData: any = {
        exportedAt: new Date().toISOString(),
        world: currentWorld,
      }

      if (selectedOption === 'full' || selectedOption === 'characters') {
        const { data: characters } = await supabase
          .from('characters')
          .select('*')
          .eq('world_id', worldId)
        exportData.characters = characters || []

        // Get relationships
        if (characters && characters.length > 0) {
          const charIds = (characters as { id: string }[]).map(c => c.id)
          const { data: relationships } = await supabase
            .from('character_relationships')
            .select('*')
            .or(`character_a_id.in.(${charIds.join(',')}),character_b_id.in.(${charIds.join(',')})`)
          exportData.characterRelationships = relationships || []

          const { data: orgMemberships } = await supabase
            .from('character_organizations')
            .select('*')
            .in('character_id', charIds)
          exportData.characterOrganizations = orgMemberships || []

          const { data: locationLinks } = await supabase
            .from('character_locations')
            .select('*')
            .in('character_id', charIds)
          exportData.characterLocations = locationLinks || []
        }
      }

      if (selectedOption === 'full' || selectedOption === 'locations') {
        const { data: locations } = await supabase
          .from('locations')
          .select('*')
          .eq('world_id', worldId)
        exportData.locations = locations || []
      }

      if (selectedOption === 'full') {
        const { data: organizations } = await supabase
          .from('organizations')
          .select('*')
          .eq('world_id', worldId)
        exportData.organizations = organizations || []

        const { data: events } = await supabase
          .from('events')
          .select('*')
          .eq('world_id', worldId)
        exportData.events = events || []

        const { data: items } = await supabase
          .from('items')
          .select('*')
          .eq('world_id', worldId)
        exportData.items = items || []

        const { data: rules } = await supabase
          .from('rules')
          .select('*')
          .eq('world_id', worldId)
        exportData.rules = rules || []
      }

      if (selectedOption === 'full' || selectedOption === 'production') {
        const { data: stories } = await supabase
          .from('stories')
          .select('*')
          .eq('world_id', worldId)
        exportData.stories = stories || []

        if (stories && stories.length > 0) {
          const storyIds = (stories as { id: string }[]).map(s => s.id)
          const { data: scenes } = await supabase
            .from('scenes')
            .select('*')
            .in('story_id', storyIds)
            .order('scene_number')
          exportData.scenes = scenes || []

          if (scenes && scenes.length > 0) {
            const sceneIds = (scenes as { id: string }[]).map(s => s.id)
            const { data: shots } = await supabase
              .from('shots')
              .select('*')
              .in('scene_id', sceneIds)
              .order('shot_number')
            exportData.shots = shots || []
          }
        }
      }

      // Generate file
      let content: string
      let filename: string
      let mimeType: string

      if (format === 'json') {
        content = JSON.stringify(exportData, null, 2)
        filename = `${currentWorld.name.toLowerCase().replace(/\s+/g, '-')}-export.json`
        mimeType = 'application/json'
      } else {
        content = generateMarkdown(exportData, selectedOption)
        filename = `${currentWorld.name.toLowerCase().replace(/\s+/g, '-')}-export.md`
        mimeType = 'text/markdown'
      }

      // Download
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Export complete!')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Export World
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Download your world data in various formats
        </p>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exportOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedOption(option.id)}
            className={cn(
              'p-4 rounded-xl border text-left transition-all',
              selectedOption === option.id
                ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  selectedOption === option.id
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                )}
              >
                <option.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {option.label}
                  </h3>
                  {selectedOption === option.id && (
                    <CheckCircle className="w-4 h-4 text-sky-500" />
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {option.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {option.included.map((item, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Format Selection */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Output Format</h3>
        <div className="flex gap-4">
          <button
            onClick={() => setFormat('json')}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors',
              format === 'json'
                ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            )}
          >
            <FileJson className={cn('w-5 h-5', format === 'json' ? 'text-sky-500' : 'text-slate-400')} />
            <div className="text-left">
              <p className="font-medium text-slate-900 dark:text-white">JSON</p>
              <p className="text-xs text-slate-500">Machine-readable data</p>
            </div>
          </button>
          <button
            onClick={() => setFormat('markdown')}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors',
              format === 'markdown'
                ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            )}
          >
            <FileText className={cn('w-5 h-5', format === 'markdown' ? 'text-sky-500' : 'text-slate-400')} />
            <div className="text-left">
              <p className="font-medium text-slate-900 dark:text-white">Markdown</p>
              <p className="text-xs text-slate-500">Human-readable document</p>
            </div>
          </button>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={handleExport}
          disabled={exporting || !currentWorld}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Export {exportOptions.find(o => o.id === selectedOption)?.label}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function generateMarkdown(data: any, _type: string): string {
  let md = `# ${data.world.name}\n\n`
  md += `> Exported on ${new Date(data.exportedAt).toLocaleString()}\n\n`

  if (data.world.logline) {
    md += `**Logline:** ${data.world.logline}\n\n`
  }
  if (data.world.genre || data.world.tone) {
    md += `**Genre:** ${data.world.genre || 'N/A'} | **Tone:** ${data.world.tone || 'N/A'}\n\n`
  }

  md += `---\n\n`

  if (data.characters?.length > 0) {
    md += `## Characters (${data.characters.length})\n\n`
    data.characters.forEach((char: any) => {
      md += `### ${char.name}\n\n`
      if (char.role) md += `- **Role:** ${char.role}\n`
      if (char.species) md += `- **Species:** ${char.species}\n`
      if (char.personality) md += `- **Personality:** ${char.personality}\n`
      if (char.background) md += `\n**Background:**\n${char.background}\n`
      md += '\n'
    })
  }

  if (data.locations?.length > 0) {
    md += `## Locations (${data.locations.length})\n\n`
    data.locations.forEach((loc: any) => {
      md += `### ${loc.name}\n\n`
      if (loc.type) md += `- **Type:** ${loc.type}\n`
      if (loc.atmosphere) md += `- **Atmosphere:** ${loc.atmosphere}\n`
      if (loc.description) md += `\n${loc.description}\n`
      md += '\n'
    })
  }

  if (data.organizations?.length > 0) {
    md += `## Organizations (${data.organizations.length})\n\n`
    data.organizations.forEach((org: any) => {
      md += `### ${org.name}\n\n`
      if (org.type) md += `- **Type:** ${org.type}\n`
      if (org.purpose) md += `- **Purpose:** ${org.purpose}\n`
      md += '\n'
    })
  }

  if (data.rules?.length > 0) {
    md += `## Rules (${data.rules.length})\n\n`
    data.rules.forEach((rule: any) => {
      md += `### ${rule.code ? `[${rule.code}] ` : ''}${rule.name}\n\n`
      if (rule.category) md += `- **Category:** ${rule.category}\n`
      if (rule.statement) md += `\n${rule.statement}\n`
      md += '\n'
    })
  }

  if (data.stories?.length > 0) {
    md += `## Stories (${data.stories.length})\n\n`
    data.stories.forEach((story: any) => {
      md += `### ${story.title}\n\n`
      if (story.status) md += `- **Status:** ${story.status}\n`
      if (story.logline) md += `- **Logline:** ${story.logline}\n`
      md += '\n'
    })
  }

  return md
}
