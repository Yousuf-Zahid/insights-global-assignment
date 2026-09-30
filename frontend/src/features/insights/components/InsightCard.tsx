import { memo } from 'react'

import type { Insight } from '../../../services/api/types'

interface InsightCardProps {
  insight: Insight
}

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

export const InsightCard = memo(function InsightCard({ insight }: InsightCardProps) {
  return (
    <article className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-lg font-semibold">{insight.title}</h3>
        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
          {insight.category}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-slate-700">{insight.content}</p>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
          {insight.tags.map((tag) => (
            <li key={tag} className="rounded bg-slate-100 px-2 py-0.5">
              #{tag}
            </li>
          ))}
        </ul>
        <p>
          Confidence {Math.round(insight.confidence * 100)}% ·{' '}
          <time dateTime={insight.createdAt}>
            {dateFormatter.format(new Date(insight.createdAt))}
          </time>
        </p>
      </div>
    </article>
  )
})
