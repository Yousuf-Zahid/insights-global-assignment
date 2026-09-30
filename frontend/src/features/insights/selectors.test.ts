import type { Insight } from '../../services/api/types'
import { selectVisibleInsights } from './selectors'

const makeInsight = (overrides: Partial<Insight> & Pick<Insight, 'id'>): Insight => ({
  title: 'Title',
  content: 'Content',
  category: 'General',
  tags: [],
  language: 'en',
  confidence: 0.9,
  createdAt: '2026-01-01T00:00:00Z',
  ...overrides,
})

const insights: Insight[] = [
  makeInsight({
    id: 1,
    title: 'Cloud costs',
    content: 'Zeta',
    category: 'Cloud',
    tags: ['finops'],
  }),
  makeInsight({ id: 2, title: 'apple security', content: 'Alpha', category: 'Security' }),
  makeInsight({ id: 3, title: 'Banana logistics', content: 'Mid', tags: ['shipping'] }),
]

const titles = (result: Insight[]) => result.map((insight) => insight.title)

describe('selectVisibleInsights', () => {
  it('sorts by title A-Z ignoring case', () => {
    expect(titles(selectVisibleInsights(insights, '', 'title-asc'))).toEqual([
      'apple security',
      'Banana logistics',
      'Cloud costs',
    ])
  })

  it('sorts by title Z-A', () => {
    expect(selectVisibleInsights(insights, '', 'title-desc').map((i) => i.id)).toEqual([1, 3, 2])
  })

  it('sorts by content A-Z and Z-A', () => {
    expect(selectVisibleInsights(insights, '', 'content-asc').map((i) => i.id)).toEqual([2, 3, 1])
    expect(selectVisibleInsights(insights, '', 'content-desc').map((i) => i.id)).toEqual([1, 3, 2])
  })

  it.each([
    ['title', 'BANANA', [3]],
    ['content', 'alpha', [2]],
    ['tag', 'finops', [1]],
    ['category', 'security', [2]],
  ])('filters by %s, case-insensitively', (_field, term, expectedIds) => {
    expect(selectVisibleInsights(insights, term, 'title-asc').map((i) => i.id)).toEqual(expectedIds)
  })

  it('returns everything for a blank search and never mutates the input', () => {
    const original = [...insights]

    expect(selectVisibleInsights(insights, '   ', 'title-asc')).toHaveLength(3)
    expect(insights).toEqual(original)
  })

  it('returns the same array reference for identical inputs', () => {
    const first = selectVisibleInsights(insights, 'cloud', 'title-asc')

    expect(selectVisibleInsights(insights, 'cloud', 'title-asc')).toBe(first)
  })
})
