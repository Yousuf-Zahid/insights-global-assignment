import { useCallback, useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { useDebouncedValue } from '../../../hooks/useDebouncedValue'
import { SEARCH_DEBOUNCE_MS } from '../../../lib/constants'
import { notifyError } from '../../../lib/notify'
import { useGetInsightsPageQuery } from '../../../services/api/insightsApi'
import { normalizeError } from '../../../services/api/normalizeError'
import type { Insight } from '../../../services/api/types'
import { setSearchTerm } from '../insightsUiSlice'
import { selectSearchTerm, selectSortBy, selectVisibleInsights } from '../selectors'

const NO_INSIGHTS: Insight[] = []

/** Everything the results section needs: loaded pages, client-side filter/sort, load-more. */
export function useInsightsView(contextId: string) {
  const dispatch = useAppDispatch()
  const searchTerm = useAppSelector(selectSearchTerm)
  const sortBy = useAppSelector(selectSortBy)
  const debouncedTerm = useDebouncedValue(searchTerm, SEARCH_DEBOUNCE_MS)
  const [page, setPage] = useState(1)

  const { data, isFetching, isError, error, refetch } = useGetInsightsPageQuery({
    contextId,
    page,
  })

  const loadedInsights = data?.data ?? NO_INSIGHTS
  const visibleInsights = selectVisibleInsights(loadedInsights, debouncedTerm, sortBy)

  useEffect(() => {
    if (!isError) return
    notifyError('Could not load more insights', {
      description: normalizeError(error).message,
      action: { label: 'Retry', onClick: () => void refetch() },
    })
  }, [isError, error, refetch])

  const loadMore = useCallback(() => {
    if (isError) void refetch()
    else setPage((current) => current + 1)
  }, [isError, refetch])

  const clearSearch = useCallback(() => {
    dispatch(setSearchTerm(''))
  }, [dispatch])

  return {
    visibleInsights,
    loadedCount: loadedInsights.length,
    totalItems: data?.pagination?.totalItems ?? loadedInsights.length,
    hasMore: data?.pagination?.hasMore ?? false,
    isFiltering: debouncedTerm.trim() !== '',
    isLoadingMore: isFetching,
    hasLoadFailed: isError,
    loadMore,
    clearSearch,
  }
}
