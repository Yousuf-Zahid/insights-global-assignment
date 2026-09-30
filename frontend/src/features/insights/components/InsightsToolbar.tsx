import { memo } from 'react'

import { SearchInput } from './SearchInput'
import { SortSelect } from './SortSelect'

interface InsightsToolbarProps {
  visibleCount: number
  loadedCount: number
  totalItems: number
  isFiltering: boolean
  hasMore: boolean
}

export const InsightsToolbar = memo(function InsightsToolbar({
  visibleCount,
  loadedCount,
  totalItems,
  isFiltering,
  hasMore,
}: InsightsToolbarProps) {
  return (
    <div className="space-y-2">
      <div className="grid gap-4 sm:grid-cols-[1fr_14rem]">
        <SearchInput />
        <SortSelect />
      </div>
      <p aria-live="polite" className="text-sm text-slate-600">
        Showing {visibleCount} of {totalItems}
        {isFiltering && hasMore && ` (search covers the ${loadedCount} loaded results)`}
      </p>
    </div>
  )
})
