import { useAppSelector } from '../app/hooks'
import { InsightsResults } from '../features/insights/components/InsightsResults'
import { InsightsSkeleton } from '../features/insights/components/InsightsSkeleton'
import { ClarificationNotice } from '../features/prompt/components/ClarificationNotice'
import { ErrorBanner } from '../features/prompt/components/ErrorBanner'
import { PromptForm } from '../features/prompt/components/PromptForm'
import { selectIsSubmitting, selectLastResponse } from '../features/prompt/promptSlice'

export function HomePage() {
  const lastResponse = useAppSelector(selectLastResponse)
  const isSubmitting = useAppSelector(selectIsSubmitting)

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
        <p className="mt-1 text-slate-600">Ask a question and review the insights returned.</p>
      </header>
      <main className="space-y-6">
        <PromptForm />
        {isSubmitting && <InsightsSkeleton />}
        {lastResponse?.kind === 'clarification' && (
          <ClarificationNotice message={lastResponse.message} />
        )}
        {lastResponse?.kind === 'error' && <ErrorBanner error={lastResponse.error} />}
        {lastResponse?.kind === 'success' && (
          <InsightsResults
            key={lastResponse.response.contextId}
            contextId={lastResponse.response.contextId}
          />
        )}
      </main>
    </div>
  )
}
