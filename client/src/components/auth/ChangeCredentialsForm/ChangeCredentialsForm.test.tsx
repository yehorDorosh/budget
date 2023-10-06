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
})
