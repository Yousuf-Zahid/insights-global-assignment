import type { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'

import { store } from './store'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      {children}
      <Toaster richColors closeButton position="top-right" />
    </Provider>
  )
}
