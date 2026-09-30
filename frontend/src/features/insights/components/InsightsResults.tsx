import { useInsightsView } from '../hooks/useInsightsView'
import { EmptyState } from './EmptyState'
import { InsightsList } from './InsightsList'
import { InsightsToolbar } from './InsightsToolbar'
import { LoadMoreButton } from './LoadMoreButton'

interface InsightsResultsProps {
  contextId: string
}

export function InsightsResults({ contextId }: InsightsResultsProps) {
  const view = useInsightsView(contextId)

  return (
    <section aria-label="Insights" className="space-y-4">
      <InsightsToolbar
        visibleCount={view.visibleInsights.length}
        loadedCount={view.loadedCount}
        totalItems={view.totalItems}
        isFiltering={view.isFiltering}
        hasMore={view.hasMore}
      />
      {view.visibleInsights.length > 0 ? (
        <InsightsList insights={view.visibleInsights} />
      ) : (
        <EmptyState isFiltering={view.isFiltering} onClear={view.clearSearch} />
      )}
      {view.hasMore && (
        <LoadMoreButton
          isLoading={view.isLoadingMore}
          hasFailed={view.hasLoadFailed}
          onClick={view.loadMore}
        />
      )}
    </section>
  )
}
