import { Alert } from '../../../components/ui/Alert'
import type { ApiErrorBody } from '../../../services/api/types'

interface ErrorBannerProps {
  error: ApiErrorBody
}

export function ErrorBanner({ error }: ErrorBannerProps) {
  return (
    <Alert variant="error" title={error.message}>
      <p>
        Error code: <code className="font-mono">{error.error}</code>
      </p>
      {error.details && error.details.length > 0 && (
        <ul className="list-disc pl-5">
          {error.details.map((detail) => (
            <li key={`${detail.field}-${detail.message}`}>
              <span className="font-medium">{detail.field}</span>: {detail.message}
            </li>
          ))}
        </ul>
      )}
    </Alert>
  )
}
