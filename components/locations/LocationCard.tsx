'use client'

import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import type { Location } from '@/lib/types/database'

interface LocationCardProps {
  location: Location
}

const typeLabels: Record<string, string> = {
  planet: 'Planet',
  continent: 'Continent',
  country: 'Country',
  city: 'City',
  district: 'District',
  building: 'Building',
  room: 'Room',
}

export function LocationCard({ location }: LocationCardProps) {
  return (
    <Link href={`/locations/${location.id}`}>
      <Card className="hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{location.name}</h3>
              {location.type && (
                <span className="text-sm text-slate-500 dark:text-slate-400">{typeLabels[location.type] || location.type}</span>
              )}
              {location.description && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{location.description}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
