import type { LanguageCode } from '../../lib/constants'

export interface Insight {
  id: number
  title: string
  content: string
  category: string
  tags: string[]
  language: string
  confidence: number
  createdAt: string
}

export interface Pagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasMore: boolean
}

export interface SubmitPromptRequest {
  prompt: string
  targetLanguage: LanguageCode
  contextId?: string
}

export interface InsightsSuccessResponse {
  status: 'SUCCESS'
  contextId: string
  data: Insight[]
  pagination: Pagination | null
}

export interface ClarificationResponse {
  status: 'NEEDS_CLARIFICATION'
  message: string
}

export type SubmitPromptResponse = InsightsSuccessResponse | ClarificationResponse

export interface InsightsPageArgs {
  contextId: string
  page: number
  pageSize?: number
}

export interface ApiErrorDetail {
  field: string
  message: string
}

export interface ApiErrorBody {
  error: string
  message: string
  details?: ApiErrorDetail[]
}
