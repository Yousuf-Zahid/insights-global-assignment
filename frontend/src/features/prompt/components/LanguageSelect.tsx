import { forwardRef, type ComponentPropsWithoutRef } from 'react'

import { Select } from '../../../components/ui/Select'
import { LANGUAGES } from '../../../lib/constants'

type LanguageSelectProps = Omit<ComponentPropsWithoutRef<typeof Select>, 'label' | 'options'>

export const LanguageSelect = forwardRef<HTMLSelectElement, LanguageSelectProps>(
  function LanguageSelect(props, ref) {
    return <Select ref={ref} label="Target language" options={LANGUAGES} {...props} />
  },
)
