import { Alert } from '../../../components/ui/Alert'

interface ClarificationNoticeProps {
  message: string
}

export function ClarificationNotice({ message }: ClarificationNoticeProps) {
  return (
    <Alert variant="warning" title="We need a bit more information">
      <p>{message}</p>
    </Alert>
  )
}
