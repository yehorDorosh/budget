import LoginForm from './LoginForm'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { setupServer } from 'msw/node'
import { RenderWithProviders, handlers } from '../../../utils/test-utils'

const mockedNavigation = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigation
}))

describe('LoginForm', () => {
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

  test('Email input field should be valid.', () => {
    render(
      <RenderWithProviders>
        <LoginForm />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByTestId('email')

    act(() => {
      userEvent.type(inputEmail, 'email@user.com')
    })

    expect(inputEmail).toBeInTheDocument()
    expect(inputEmail).toBeValid()
    expect(screen.queryByTestId('invalid-msg')).not.toBeInTheDocument()
  })

  test('Email input field should be invalid.', () => {
    render(
      <RenderWithProviders>
        <LoginForm />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByTestId('email')

    act(() => {
      userEvent.type(inputEmail, '123')
      userEvent.clear(inputEmail)
    })

    expect(inputEmail).toBeInTheDocument()
    expect(inputEmail).toBeInvalid()
    expect(screen.getByTestId('invalid-msg')).toBeInTheDocument()
  })

  test('Password input field should be valid.', () => {
    render(
      <RenderWithProviders>
        <LoginForm />
      </RenderWithProviders>
    )
    const inputPassword = screen.getByTestId('password')

    act(() => {
      userEvent.type(inputPassword, '123')
    })

    expect(inputPassword).toBeInTheDocument()
    expect(inputPassword).toBeValid()
    expect(screen.queryByTestId('invalid-msg')).not.toBeInTheDocument()
  })

  test('Password input field should be invalid.', () => {
    render(
      <RenderWithProviders>
        <LoginForm />
      </RenderWithProviders>
    )
    const inputPassword = screen.getByTestId('password')

    act(() => {
      userEvent.type(inputPassword, '123')
      userEvent.clear(inputPassword)
    })

    expect(inputPassword).toBeInTheDocument()
    expect(inputPassword).toBeInvalid()
    expect(screen.getByTestId('invalid-msg')).toBeInTheDocument()
  })

  test('All inputs after submit should be invalid.', () => {
    render(
      <RenderWithProviders>
        <LoginForm />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByTestId('email')
    const inputPassword = screen.getByTestId('password')
    const submitBtn = screen.getByTestId('submitBtn')

    act(() => {
      fireEvent.click(submitBtn)
    })

    expect(inputEmail).toBeInvalid()
    expect(inputPassword).toBeInvalid()
  })

  test('All inputs after submit should be valid.', () => {
    render(
      <RenderWithProviders>
        <LoginForm />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByTestId('email')
    const inputPassword = screen.getByTestId('password')
    const submitBtn = screen.getByTestId('submitBtn')

    act(() => {
      userEvent.type(inputEmail, 'user@email.com')
      userEvent.type(inputPassword, '123')
      fireEvent.click(submitBtn)
    })

    expect(inputEmail).toBeValid()
    expect(inputPassword).toBeValid()
  })

  test('The loader should be displayed after submit and disappear after data was submitted.', async () => {
    render(
      <RenderWithProviders>
        <LoginForm />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByTestId('email')
    const inputPassword = screen.getByTestId('password')
    const submitBtn = screen.getByTestId('submitBtn')

    act(() => {
      userEvent.type(inputEmail, 'user@email.com')
      userEvent.type(inputPassword, '123')
    })

    await act(() => {
      fireEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(screen.getByTestId('loader')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    })
  })

  test('Redirect to home page after successful login.', async () => {
    render(
      <RenderWithProviders>
        <LoginForm />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByTestId('email')
    const inputPassword = screen.getByTestId('password')
    const submitBtn = screen.getByTestId('submitBtn')

    act(() => {
      userEvent.type(inputEmail, 'user@email.com')
      userEvent.type(inputPassword, '123')
    })

    await act(() => {
      fireEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(mockedNavigation).toHaveBeenCalledWith('/', { replace: true })
    })
  })

  test('Render "Wrong credentials" error.', async () => {
    render(
      <RenderWithProviders>
        <LoginForm />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByTestId('email')
    const inputPassword = screen.getByTestId('password')
    const submitBtn = screen.getByTestId('submitBtn')

    act(() => {
      userEvent.type(inputEmail, 'wrong@user.com')
      userEvent.type(inputPassword, 'wrongpassword')
    })

    await act(() => {
      fireEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(screen.getByText('Wrong credentials')).toBeInTheDocument()
    })
  })

  test('Forgot password link should lead to restore password page.', () => {
    render(
      <RenderWithProviders>
        <LoginForm />
      </RenderWithProviders>
    )
    const forgotPasswordLink = screen.getByRole('link', { name: /Forgot password?/i })

    act(() => {
      fireEvent.click(forgotPasswordLink)
    })

    expect(window.location.pathname).toBe('/restore-password')
  })
})
