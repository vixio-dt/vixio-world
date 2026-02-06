'use client'

import Link from 'next/link'
import { Scale } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import type { Rule } from '@/lib/types/database'

interface RuleCardProps {
  rule: Rule
}

const categoryLabels: Record<string, string> = {
  physics: 'Physics',
  magic: 'Magic',
  technology: 'Technology',
  biology: 'Biology',
  social: 'Social',
  political: 'Political',
  economic: 'Economic',
  temporal: 'Temporal',
  cosmological: 'Cosmological',
}

export function RuleCard({ rule }: RuleCardProps) {
  return (
    <Link href={`/rules/${rule.id}`}>
      <Card className="hover:border-cyan-300 dark:hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Scale className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{rule.name}</h3>
              {rule.category && (
                <span className="text-sm text-slate-500 dark:text-slate-400">{categoryLabels[rule.category] || rule.category}</span>
              )}
              {rule.statement && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{rule.statement}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
