import { createSelector } from '@reduxjs/toolkit'

import type { RootState } from '../../app/store'
import type { SortBy } from '../../lib/constants'
import type { Insight } from '../../services/api/types'

export const selectSearchTerm = (state: RootState) => state.insightsUi.searchTerm
export const selectSortBy = (state: RootState) => state.insightsUi.sortBy

const collator = new Intl.Collator(undefined, { sensitivity: 'base', numeric: true })

const SORT_CONFIG: Record<SortBy, { field: 'title' | 'content'; order: 1 | -1 }> = {
  'title-asc': { field: 'title', order: 1 },
  'title-desc': { field: 'title', order: -1 },
  'content-asc': { field: 'content', order: 1 },
  'content-desc': { field: 'content', order: -1 },
}

const matchesTerm = (insight: Insight, term: string) =>
  [insight.title, insight.content, insight.category, ...insight.tags].some((value) =>
    value.toLowerCase().includes(term),
  )

/** Filters the loaded insights by search term, then sorts them. Memoized on its three inputs. */
export const selectVisibleInsights = createSelector(
  [
    (insights: Insight[]) => insights,
    (_insights: Insight[], searchTerm: string) => searchTerm,
    (_insights: Insight[], _searchTerm: string, sortBy: SortBy) => sortBy,
  ],
  (insights, searchTerm, sortBy) => {
    const term = searchTerm.trim().toLowerCase()
    const { field, order } = SORT_CONFIG[sortBy]
    const filtered = term ? insights.filter((insight) => matchesTerm(insight, term)) : insights
    return [...filtered].sort((a, b) => order * collator.compare(a[field], b[field]))
  },
)
