import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'

import { setupStore } from '../../../app/store'
import { PromptForm } from './PromptForm'

const renderForm = () =>
  render(
    <Provider store={setupStore()}>
      <PromptForm />
    </Provider>,
  )

describe('PromptForm', () => {
  it('disables submit until the prompt is valid', async () => {
    const user = userEvent.setup()
    renderForm()
    const submit = screen.getByRole('button', { name: /get insights/i })
    const prompt = screen.getByLabelText('Prompt')

    expect(submit).toBeDisabled()

    await user.type(prompt, 'How do we cut costs?')
    await waitFor(() => expect(submit).toBeEnabled())

    await user.clear(prompt)
    await waitFor(() => expect(submit).toBeDisabled())
    expect(await screen.findByText('Prompt is required')).toBeInTheDocument()
  })

  it('keeps submit disabled for a whitespace-only prompt', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText('Prompt'), '   ')

    expect(screen.getByRole('button', { name: /get insights/i })).toBeDisabled()
  })
})
