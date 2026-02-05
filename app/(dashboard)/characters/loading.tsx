import { ListSkeleton } from '@/components/ui/Skeleton'

export default function CharactersLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>
        <div className="h-10 w-36 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </div>
      <ListSkeleton count={6} />
    </div>
  )
}
