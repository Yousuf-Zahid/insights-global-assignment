import { memo } from 'react'

import type { Insight } from '../../../services/api/types'
import { InsightCard } from './InsightCard'

interface InsightsListProps {
  insights: Insight[]
}

export const InsightsList = memo(function InsightsList({ insights }: InsightsListProps) {
  return (
    <ul className="space-y-4">
      {insights.map((insight) => (
        <li key={insight.id}>
          <InsightCard insight={insight} />
        </li>
      ))}
    </ul>
  )
})
