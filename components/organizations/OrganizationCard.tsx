'use client'

import Link from 'next/link'
import { Building2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import type { Organization } from '@/lib/types/database'

interface OrganizationCardProps {
  organization: Organization
}

const typeLabels: Record<string, string> = {
  government: 'Government',
  religion: 'Religion',
  corporation: 'Corporation',
  guild: 'Guild',
  family: 'Family',
  military: 'Military',
  secret_society: 'Secret Society',
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <Link href={`/organizations/${organization.id}`}>
      <Card className="hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">{organization.name}</h3>
              {organization.type && (
                <span className="text-sm text-slate-500">{typeLabels[organization.type] || organization.type}</span>
              )}
              {organization.purpose && (
                <p className="mt-2 text-sm text-slate-600 line-clamp-2">{organization.purpose}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
