'use client'

import Link from 'next/link'
import { Package } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import type { Item } from '@/lib/types/database'

interface ItemCardProps {
  item: Item
}

const typeLabels: Record<string, string> = {
  weapon: 'Weapon',
  vehicle: 'Vehicle',
  artifact: 'Artifact',
  tool: 'Tool',
  document: 'Document',
  clothing: 'Clothing',
  technology: 'Technology',
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Link href={`/items/${item.id}`}>
      <Card className="hover:border-cyan-300 dark:hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Package className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{item.name}</h3>
              {item.type && (
                <span className="text-sm text-slate-500 dark:text-slate-400">{typeLabels[item.type] || item.type}</span>
              )}
              {item.description && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{item.description}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
