import RestorePassSendEmailForm from './RestorePassSendEmailForm'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { setupServer } from 'msw/node'
import { RenderWithProviders, handlers } from '../../../utils/test-utils'

describe('RestorePassSendEmailForm', () => {
  const server = setupServer(...handlers)

  beforeAll(() => {
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

  test('Email input field should be vaild.', async () => {
    render(
      <RenderWithProviders>
        <RestorePassSendEmailForm onSendEmail={() => {}} />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByLabelText(/email/i)

    act(() => {
      userEvent.type(inputEmail, 'user@email.com')
    })

    expect(inputEmail).toBeInTheDocument()
    expect(inputEmail).toBeValid()
  })

  test('Email input should be invalid', async () => {
    render(
      <RenderWithProviders>
        <RestorePassSendEmailForm onSendEmail={() => {}} />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByLabelText(/email/i)

    act(() => {
      userEvent.type(inputEmail, 'user')
    })

    expect(inputEmail).toBeInTheDocument()
    expect(inputEmail).toBeInvalid()
  })

  test('Email input should be invalid after submit', async () => {
    render(
      <RenderWithProviders>
        <RestorePassSendEmailForm onSendEmail={() => {}} />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByLabelText(/email/i)
    const submitBtn = screen.getByRole('button', { name: /send email/i })

    act(() => {
      userEvent.click(submitBtn)
    })

    expect(inputEmail).toBeInTheDocument()
    expect(inputEmail).toBeInvalid()
  })

  test('The Loading component should be displayed after submit and desapear after response.', async () => {
    render(
      <RenderWithProviders>
        <RestorePassSendEmailForm onSendEmail={() => {}} />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByLabelText(/email/i)
    const submitBtn = screen.getByRole('button', { name: /send email/i })

    act(() => {
      userEvent.type(inputEmail, 'user@email.com')
    })

    await act(() => {
      userEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(screen.getByTestId('loader')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    })
  })

  test('Should call onSendEmail function after submit.', async () => {
    const onSendEmail = jest.fn()
    render(
      <RenderWithProviders>
        <RestorePassSendEmailForm onSendEmail={onSendEmail} />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByLabelText(/email/i)
    const submitBtn = screen.getByRole('button', { name: /send email/i })

    act(() => {
      userEvent.type(inputEmail, 'user@email.com')
    })

    await act(() => {
      userEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(onSendEmail).toBeCalledWith('user@email.com')
    })
  })

  test('Should display error message if user not found.', async () => {
    render(
      <RenderWithProviders>
        <RestorePassSendEmailForm onSendEmail={() => {}} />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByLabelText(/email/i)
    const submitBtn = screen.getByRole('button', { name: /send email/i })

    act(() => {
      userEvent.type(inputEmail, 'wronguser@email.com')
    })

    await act(() => {
      userEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(screen.getByText(/user with this email does not exist/i)).toBeInTheDocument()
    })
  })
})
