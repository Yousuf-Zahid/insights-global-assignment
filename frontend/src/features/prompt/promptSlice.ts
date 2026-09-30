import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from '../../app/store'
import { insightsApi } from '../../services/api/insightsApi'
import { normalizeError } from '../../services/api/normalizeError'
import type {
  ApiErrorBody,
  InsightsSuccessResponse,
  SubmitPromptRequest,
} from '../../services/api/types'

type LastResponse =
  | { kind: 'success'; response: InsightsSuccessResponse }
  | { kind: 'clarification'; message: string }
  | { kind: 'error'; error: ApiErrorBody }

interface PromptState {
  lastRequest: SubmitPromptRequest | null
  lastResponse: LastResponse | null
  contextId: string | null
}

const initialState: PromptState = {
  lastRequest: null,
  lastResponse: null,
  contextId: null,
}

const { submitPrompt } = insightsApi.endpoints

const promptSlice = createSlice({
  name: 'prompt',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(submitPrompt.matchPending, (state, action) => {
        state.lastRequest = action.meta.arg.originalArgs
        state.lastResponse = null
      })
      .addMatcher(submitPrompt.matchFulfilled, (state, { payload }) => {
        if (payload.status === 'SUCCESS') {
          state.contextId = payload.contextId
          state.lastResponse = { kind: 'success', response: payload }
        } else {
          state.lastResponse = { kind: 'clarification', message: payload.message }
        }
      })
      .addMatcher(submitPrompt.matchRejected, (state, action) => {
        state.lastResponse = {
          kind: 'error',
          error: normalizeError(action.payload ?? action.error),
        }
      })
  },
})

export const selectLastResponse = (state: RootState) => state.prompt.lastResponse

/** A request has been sent (lastRequest is set) but no response has been recorded yet. */
export const selectIsSubmitting = (state: RootState) =>
  state.prompt.lastRequest !== null && state.prompt.lastResponse === null

export const promptReducer = promptSlice.reducer
