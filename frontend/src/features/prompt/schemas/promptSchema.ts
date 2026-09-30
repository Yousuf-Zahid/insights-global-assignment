import { z } from 'zod'

import { LANGUAGES, MAX_PROMPT_LENGTH } from '../../../lib/constants'

const LANGUAGE_CODES = LANGUAGES.map((language) => language.value)

// Deliberately loose: the "too short / lacks context" rule belongs to the backend, otherwise the
// NEEDS_CLARIFICATION flow could never be reached from the UI.
export const promptSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(MAX_PROMPT_LENGTH, `Prompt must be at most ${MAX_PROMPT_LENGTH} characters`),
  targetLanguage: z.literal(LANGUAGE_CODES, { error: 'Select a supported language' }),
})

export type PromptFormValues = z.infer<typeof promptSchema>
