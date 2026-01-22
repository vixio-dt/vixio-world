import { Download, FileJson, FileText, File } from 'lucide-react'

export function ExportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Export
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Export your world data for production pipelines
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ExportCard
          icon={FileJson}
          title="JSON Export"
          description="Full world data in JSON format"
          format="json"
        />
        <ExportCard
          icon={FileText}
          title="Markdown Export"
          description="Human-readable documentation"
          format="md"
        />
        <ExportCard
          icon={File}
          title="Production Brief"
          description="MetaHuman specs, environment briefs"
          format="brief"
        />
      </div>
    </div>
  )
}

function ExportCard({ icon: Icon, title, description, format }: { icon: any; title: string; description: string; format: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:border-sky-500 dark:hover:border-sky-500 transition-colors cursor-pointer">
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-slate-500" />
      </div>
      <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{description}</p>
      <button className="flex items-center gap-2 text-sm font-medium text-sky-500 hover:text-sky-600">
        <Download className="w-4 h-4" />
        <span>Export</span>
      </button>
    </div>
  )
}
