import type {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from '@reduxjs/toolkit/query'

import { PAGE_SIZE } from '../../lib/constants'
import { baseApi } from './baseApi'
import type {
  InsightsPageArgs,
  InsightsSuccessResponse,
  SubmitPromptRequest,
  SubmitPromptResponse,
} from './types'

export const insightsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    submitPrompt: build.mutation<SubmitPromptResponse, SubmitPromptRequest>({
      // A custom queryFn (rather than onQueryStarted) so page 1 is in the cache *before* the
      // mutation resolves; the results view then never fires a duplicate GET for page 1.
      async queryFn(
        request,
        api,
        _extraOptions,
        baseQuery,
      ): Promise<
        QueryReturnValue<SubmitPromptResponse, FetchBaseQueryError, FetchBaseQueryMeta | undefined>
      > {
        const result = await baseQuery({ url: '/insights', method: 'POST', body: request })
        if (result.error) return { error: result.error }

        const response = result.data as SubmitPromptResponse
        if (response.status === 'SUCCESS') {
          await api.dispatch(
            insightsApi.util.upsertQueryData(
              'getInsightsPage',
              { contextId: response.contextId, page: 1 },
              response,
            ),
          )
        }
        return { data: response }
      },
    }),

    getInsightsPage: build.query<InsightsSuccessResponse, InsightsPageArgs>({
      query: ({ contextId, page, pageSize = PAGE_SIZE }) => ({
        url: `/insights/${contextId}`,
        params: { page, pageSize },
      }),
      // One cache entry per conversation; pages are merged into it instead of cached separately.
      serializeQueryArgs: ({ queryArgs }) => queryArgs.contextId,
      merge: (cache, incoming) => {
        const isFirstPage = !incoming.pagination || incoming.pagination.page === 1
        if (isFirstPage) return incoming

        const knownIds = new Set(cache.data.map((insight) => insight.id))
        cache.data.push(...incoming.data.filter((insight) => !knownIds.has(insight.id)))
        cache.pagination = incoming.pagination
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.page !== previousArg?.page,
    }),
  }),
})

export const { useSubmitPromptMutation, useGetInsightsPageQuery } = insightsApi
