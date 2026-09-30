import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { useAppSelector } from '../../../app/hooks'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { DEFAULT_LANGUAGE, MAX_PROMPT_LENGTH } from '../../../lib/constants'
import { notifyError } from '../../../lib/notify'
import { useSubmitPromptMutation } from '../../../services/api/insightsApi'
import { normalizeError } from '../../../services/api/normalizeError'
import { selectLastResponse } from '../promptSlice'
import { promptSchema, type PromptFormValues } from '../schemas/promptSchema'
import { LanguageSelect } from './LanguageSelect'

export function PromptForm() {
  const [submitPrompt, { isLoading }] = useSubmitPromptMutation()
  const lastResponse = useAppSelector(selectLastResponse)
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isValid },
  } = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    mode: 'onChange',
    defaultValues: { prompt: '', targetLanguage: DEFAULT_LANGUAGE },
  })

  useEffect(() => {
    if (lastResponse?.kind === 'clarification') setFocus('prompt')
  }, [lastResponse, setFocus])

  const onSubmit = handleSubmit(async (values) => {
    try {
      await submitPrompt(values).unwrap()
    } catch (error) {
      const { error: code, message } = normalizeError(error)
      notifyError(message, { description: code })
    }
  })

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <Input
        label="Prompt"
        placeholder="e.g. How can we reduce shipping costs?"
        autoComplete="off"
        maxLength={MAX_PROMPT_LENGTH + 1}
        hint="Tip: add more detail for better results"
        error={errors.prompt?.message}
        {...register('prompt')}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="sm:w-56">
          <LanguageSelect error={errors.targetLanguage?.message} {...register('targetLanguage')} />
        </div>
        <Button type="submit" disabled={!isValid} isLoading={isLoading}>
          Get insights
        </Button>
      </div>
    </form>
  )
}
