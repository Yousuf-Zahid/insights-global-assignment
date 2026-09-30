import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Input } from '../../../components/ui/Input'
import { setSearchTerm } from '../insightsUiSlice'
import { selectSearchTerm } from '../selectors'

export function SearchInput() {
  const dispatch = useAppDispatch()
  const searchTerm = useAppSelector(selectSearchTerm)

  return (
    <Input
      type="search"
      label="Search insights"
      placeholder="Title, content, tag or category"
      autoComplete="off"
      value={searchTerm}
      onChange={(event) => dispatch(setSearchTerm(event.target.value))}
    />
  )
}
