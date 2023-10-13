import RestorePassSendEmailPage from './RestorePassSendEmailPage'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import { RenderWithProviders } from '../../../utils/test-utils'
import { handlers } from '../../../utils/test-utils'
import { setupServer } from 'msw/node'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'

describe('RestorePassSendEmailPage', () => {
  const server = setupServer(...handlers)

  beforeAll(() => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('id', 'modal-root')
    document.body.appendChild(portalRoot)
    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
    cleanup()
  })

  afterAll(() => {
    server.close()
    cleanup()
  })

  test('Should render RestorePassSendEmailPage.', async () => {
    render(
      <RenderWithProviders>
        <RestorePassSendEmailPage />
      </RenderWithProviders>
    )

    const title = screen.queryByText('Restore password')

    expect(title).toBeInTheDocument()
    expect(screen.getByTestId('restore-pass-send-email-form')).toBeInTheDocument()
  })

  test('Should display message after submit.', async () => {
    render(
      <RenderWithProviders>
        <RestorePassSendEmailPage />
      </RenderWithProviders>
    )

    const input = screen.getByLabelText(/email/i)
    const submitBtn = screen.getByRole('button', { name: /send email/i })

    act(() => {
      userEvent.type(input, 'user@email.com')
    })

    await act(() => {
      userEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(screen.getByTestId('msg')).toBeInTheDocument()
    })
  })
})
