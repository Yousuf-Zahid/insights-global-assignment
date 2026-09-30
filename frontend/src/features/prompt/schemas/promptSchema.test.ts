import { promptSchema } from './promptSchema'

const validInput = { prompt: 'How can we reduce shipping costs?', targetLanguage: 'en' }

describe('promptSchema', () => {
  it('accepts a valid prompt and language', () => {
    expect(promptSchema.safeParse(validInput).success).toBe(true)
  })

  it('trims the prompt', () => {
    const result = promptSchema.parse({ ...validInput, prompt: '  hello world  ' })

    expect(result.prompt).toBe('hello world')
  })

  it('accepts very short prompts so the backend can ask for clarification', () => {
    expect(promptSchema.safeParse({ ...validInput, prompt: 'hi' }).success).toBe(true)
  })

  it.each(['', '   '])('rejects an empty prompt (%j)', (prompt) => {
    const result = promptSchema.safeParse({ ...validInput, prompt })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('Prompt is required')
  })

  it('rejects a prompt longer than 500 characters', () => {
    const result = promptSchema.safeParse({ ...validInput, prompt: 'a'.repeat(501) })

    expect(result.success).toBe(false)
  })

  it('rejects an unsupported language', () => {
    const result = promptSchema.safeParse({ ...validInput, targetLanguage: 'xx' })

    expect(result.success).toBe(false)
  })
})
