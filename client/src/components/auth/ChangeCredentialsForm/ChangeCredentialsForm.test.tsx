import ChangeCredentialsForm from './ChangeCredentialsForm'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { setupServer } from 'msw/node'
import { RenderWithProviders, handlers } from '../../../utils/test-utils'

describe('ChangeCredentialsForm', () => {
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

  test('Email input field should be vaild.', () => {
    render(
      <RenderWithProviders>
        <ChangeCredentialsForm
          fieldName="email"
          token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEifQ.BQmWM1mXBfpTw_Tv-yR3qodI0OoRmrm3Tlz6ZR60Yi4"
          onEdit={() => {}}
        />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByLabelText(/email/i)

    act(() => {
      userEvent.type(inputEmail, 'user@email.com')
    })

    expect(inputEmail).toBeInTheDocument()
    expect(inputEmail).toBeValid()
  })

  test('Input should be valid after submit.', async () => {
    render(
      <RenderWithProviders>
        <ChangeCredentialsForm fieldName="password" token="token" onEdit={() => {}} />
      </RenderWithProviders>
    )
    const inputPassword = screen.getByLabelText(/password/i)
    const submitBtn = screen.getByRole('button', { name: /change password/i })

    act(() => {
      userEvent.type(inputPassword, 'qwerTy123')
    })

    await act(() => {
      userEvent.click(submitBtn)
    })

    expect(inputPassword).toBeValid()
  })

  test('Email input field should be invaild.', () => {
    render(
      <RenderWithProviders>
        <ChangeCredentialsForm
          fieldName="email"
          token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEifQ.BQmWM1mXBfpTw_Tv-yR3qodI0OoRmrm3Tlz6ZR60Yi4"
          onEdit={() => {}}
        />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByLabelText(/email/i)

    act(() => {
      userEvent.type(inputEmail, '123')
    })

    expect(inputEmail).toBeInTheDocument()
    expect(inputEmail).toBeInvalid()
    expect(screen.getByTestId('invalid-msg')).toBeInTheDocument()
  })

  test('Password input field should be vaild.', () => {
    render(
      <RenderWithProviders>
        <ChangeCredentialsForm
          fieldName="password"
          token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEifQ.BQmWM1mXBfpTw_Tv-yR3qodI0OoRmrm3Tlz6ZR60Yi4"
          onEdit={() => {}}
        />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByLabelText(/password/i)

    act(() => {
      userEvent.type(inputEmail, 'Qwerty123')
    })

    expect(inputEmail).toBeInTheDocument()
    expect(inputEmail).toBeValid()
  })

  test('Password input field should be invaild.', () => {
    render(
      <RenderWithProviders>
        <ChangeCredentialsForm
          fieldName="password"
          token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEifQ.BQmWM1mXBfpTw_Tv-yR3qodI0OoRmrm3Tlz6ZR60Yi4"
          onEdit={() => {}}
        />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByLabelText(/password/i)

    act(() => {
      userEvent.type(inputEmail, '123')
    })

    expect(inputEmail).toBeInTheDocument()
    expect(inputEmail).toBeInvalid()
    expect(screen.getByTestId('invalid-msg')).toBeInTheDocument()
  })

  test('Calls onEdit function when form is submitted.', async () => {
    const onEdit = jest.fn()
    render(
      <RenderWithProviders>
        <ChangeCredentialsForm fieldName="email" token="token" onEdit={onEdit} />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByLabelText(/email/i)
    const submitBtn = screen.getByRole('button', { name: /change email/i })

    act(() => {
      userEvent.type(inputEmail, 'user@email.com')
    })

    await act(() => {
      userEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(onEdit).toBeCalledWith('user@email.com')
    })
  })

  test('The loader should be displayed after submit and dissapear after data was sbumitted.', async () => {
    render(
      <RenderWithProviders>
        <ChangeCredentialsForm fieldName="email" token="token" onEdit={() => {}} />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByLabelText(/email/i)
    const submitBtn = screen.getByRole('button', { name: /change email/i })

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

  test('Input should be invalid after submit.', async () => {
    render(
      <RenderWithProviders>
        <ChangeCredentialsForm fieldName="password" token="token" onEdit={() => {}} />
      </RenderWithProviders>
    )
    const inputPassword = screen.getByLabelText(/password/i)
    const submitBtn = screen.getByRole('button', { name: /change password/i })

    await act(() => {
      userEvent.click(submitBtn)
    })

    expect(inputPassword).toBeInvalid()
  })
})
