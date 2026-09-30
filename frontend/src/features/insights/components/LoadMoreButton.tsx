import { Button } from '../../../components/ui/Button'

interface LoadMoreButtonProps {
  isLoading: boolean
  hasFailed: boolean
  onClick: () => void
}

export function LoadMoreButton({ isLoading, hasFailed, onClick }: LoadMoreButtonProps) {
  return (
    <div className="flex justify-center">
      <Button variant="secondary" isLoading={isLoading} onClick={onClick}>
        {hasFailed ? 'Retry loading more' : 'Load more'}
      </Button>
    </div>
  )
}
