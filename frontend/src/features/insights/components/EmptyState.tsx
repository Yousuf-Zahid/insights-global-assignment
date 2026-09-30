import { SearchX } from 'lucide-react'

import { Button } from '../../../components/ui/Button'

interface EmptyStateProps {
  isFiltering: boolean
  onClear: () => void
}

export function EmptyState({ isFiltering, onClear }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <SearchX aria-hidden="true" className="h-8 w-8 text-slate-400" />
      <p className="text-sm text-slate-600">
        {isFiltering ? 'No insights match your search.' : 'No insights were found.'}
      </p>
      {isFiltering && (
        <Button variant="secondary" onClick={onClear}>
          Clear search
        </Button>
      )}
    </div>
  )
}
