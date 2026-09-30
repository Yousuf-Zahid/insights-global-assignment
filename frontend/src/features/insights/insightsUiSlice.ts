import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { DEFAULT_SORT, type SortBy } from '../../lib/constants'

interface InsightsUiState {
  searchTerm: string
  sortBy: SortBy
}

const initialState: InsightsUiState = {
  searchTerm: '',
  sortBy: DEFAULT_SORT,
}

const insightsUiSlice = createSlice({
  name: 'insightsUi',
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload
    },
    setSortBy(state, action: PayloadAction<SortBy>) {
      state.sortBy = action.payload
    },
  },
})

export const { setSearchTerm, setSortBy } = insightsUiSlice.actions
export const insightsUiReducer = insightsUiSlice.reducer
