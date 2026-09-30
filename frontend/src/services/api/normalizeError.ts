import type { ApiErrorBody } from './types'

const CLIENT_ERROR_CODES = {
  network: 'NETWORK_ERROR',
  timeout: 'TIMEOUT_ERROR',
  invalidResponse: 'INVALID_RESPONSE',
  unknown: 'UNKNOWN_ERROR',
} as const

const CLIENT_ERRORS: Record<string, ApiErrorBody> = {
  FETCH_ERROR: {
    error: CLIENT_ERROR_CODES.network,
    message: 'Unable to reach the server. Check your connection and try again.',
  },
  TIMEOUT_ERROR: {
    error: CLIENT_ERROR_CODES.timeout,
    message: 'The request took too long. Please try again.',
  },
  PARSING_ERROR: {
    error: CLIENT_ERROR_CODES.invalidResponse,
    message: 'The server returned an unexpected response.',
  },
}

const UNKNOWN_ERROR: ApiErrorBody = {
  error: CLIENT_ERROR_CODES.unknown,
  message: 'Something went wrong. Please try again.',
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isApiErrorBody = (value: unknown): value is ApiErrorBody =>
  isRecord(value) && typeof value.error === 'string' && typeof value.message === 'string'

/** Converts any RTK Query / fetch failure into the `{ error, message, details? }` API shape. */
export function normalizeError(error: unknown): ApiErrorBody {
  if (isApiErrorBody(error)) return error
  if (!isRecord(error)) return UNKNOWN_ERROR

  if (isApiErrorBody(error.data)) return error.data

  if (typeof error.status === 'string') return CLIENT_ERRORS[error.status] ?? UNKNOWN_ERROR
  if (typeof error.status === 'number') {
    return { error: `HTTP_${error.status}`, message: `The server responded with ${error.status}.` }
  }

  if (typeof error.message === 'string') {
    return { error: CLIENT_ERROR_CODES.unknown, message: error.message }
  }
  return UNKNOWN_ERROR
}
