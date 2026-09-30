import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Select } from '../../../components/ui/Select'
import { SORT_OPTIONS } from '../../../lib/constants'
import { setSortBy } from '../insightsUiSlice'
import { selectSortBy } from '../selectors'

export function SortSelect() {
  const dispatch = useAppDispatch()
  const sortBy = useAppSelector(selectSortBy)

  const handleChange = (value: string) => {
    const option = SORT_OPTIONS.find((candidate) => candidate.value === value)
    if (option) dispatch(setSortBy(option.value))
  }

  return (
    <Select
      label="Sort by"
      options={SORT_OPTIONS}
      value={sortBy}
      onChange={(event) => handleChange(event.target.value)}
    />
  )
}
