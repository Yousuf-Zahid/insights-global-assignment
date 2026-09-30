import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { insightsUiReducer } from '../features/insights/insightsUiSlice'
import { promptReducer } from '../features/prompt/promptSlice'
import { baseApi } from '../services/api/baseApi'

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  prompt: promptReducer,
  insightsUi: insightsUiReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const setupStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
    preloadedState,
  })

export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']

export const store = setupStore()
