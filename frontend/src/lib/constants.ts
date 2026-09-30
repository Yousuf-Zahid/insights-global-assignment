export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
] as const

export type LanguageCode = (typeof LANGUAGES)[number]['value']

export const DEFAULT_LANGUAGE: LanguageCode = 'en'

export const SORT_OPTIONS = [
  { value: 'title-asc', label: 'Title (A–Z)' },
  { value: 'title-desc', label: 'Title (Z–A)' },
  { value: 'content-asc', label: 'Content (A–Z)' },
  { value: 'content-desc', label: 'Content (Z–A)' },
] as const

export type SortBy = (typeof SORT_OPTIONS)[number]['value']

export const DEFAULT_SORT: SortBy = 'title-asc'

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'

export const PAGE_SIZE = 10
export const MAX_PROMPT_LENGTH = 500
export const SEARCH_DEBOUNCE_MS = 300
