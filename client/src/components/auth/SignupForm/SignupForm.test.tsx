import { cleanup, render, screen, waitFor } from '@testing-library/react'
import SignupForm from './SignupForm'
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

describe('SignupForm', () => {
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
        <SignupForm />
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
        <SignupForm />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByTestId('email')

    act(() => {
      userEvent.type(inputEmail, 'email-user.com')
    })

    expect(inputEmail).toBeInTheDocument()
    expect(inputEmail).toBeInvalid()
    expect(screen.getByTestId('invalid-msg')).toBeInTheDocument()
  })

  test('Password input field should be valid.', () => {
    render(
      <RenderWithProviders>
        <SignupForm />
      </RenderWithProviders>
    )
    const inputPassword = screen.getByTestId('password')

    act(() => {
      userEvent.type(inputPassword, 'Qwerty78')
    })

    expect(inputPassword).toBeInTheDocument()
    expect(inputPassword).toBeValid()
    expect(screen.queryByTestId('invalid-msg')).not.toBeInTheDocument()
  })

  test('Password input field should be invalid.', () => {
    render(
      <RenderWithProviders>
        <SignupForm />
      </RenderWithProviders>
    )
    const inputPassword = screen.getByTestId('password')

    act(() => {
      userEvent.type(inputPassword, 'secret')
    })

    expect(inputPassword).toBeInTheDocument()
    expect(inputPassword).toBeInvalid()
    expect(screen.getByTestId('invalid-msg')).toBeInTheDocument()
  })

  test('Confirm password input field should be valid.', () => {
    render(
      <RenderWithProviders>
        <SignupForm />
      </RenderWithProviders>
    )
    const inputPassword = screen.getByTestId('password')
    const inputConfirmPassword = screen.getByTestId('confirmPassword')

    act(() => {
      userEvent.type(inputPassword, 'Qwerty78')
      userEvent.type(inputConfirmPassword, 'Qwerty78')
    })

    expect(inputConfirmPassword).toBeInTheDocument()
    expect(inputConfirmPassword).toBeValid()
    expect(screen.queryByTestId('invalid-msg')).not.toBeInTheDocument()
  })

  test('Confirm password input field should be invalid.', () => {
    render(
      <RenderWithProviders>
        <SignupForm />
      </RenderWithProviders>
    )
    const inputPassword = screen.getByTestId('password')
    const inputConfirmPassword = screen.getByTestId('confirmPassword')

    act(() => {
      userEvent.type(inputPassword, 'Qwerty78')
      userEvent.type(inputConfirmPassword, 'Qwerty78x')
    })

    expect(inputConfirmPassword).toBeInTheDocument()
    expect(inputConfirmPassword).toBeInvalid()
    expect(screen.getByTestId('invalid-msg')).toBeInTheDocument()
  })

  test('All input fields after submit should be invalid.', () => {
    render(
      <RenderWithProviders>
        <SignupForm />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByTestId('email')
    const inputPassword = screen.getByTestId('password')
    const inputConfirmPassword = screen.getByTestId('confirmPassword')
    const submitBtn = screen.getByTestId('submitBtn')

    act(() => {
      userEvent.type(inputEmail, 'user-email.com')
      userEvent.type(inputPassword, 'qwerty78')
      userEvent.type(inputConfirmPassword, 'Qwerty78x')
      submitBtn.click()
    })

    expect(submitBtn).toBeInTheDocument()
    expect(inputEmail).toBeInvalid()
    expect(inputPassword).toBeInvalid()
    expect(inputConfirmPassword).toBeInvalid()
    expect(screen.getAllByTestId('invalid-msg')).toHaveLength(3)
  })

  test('All inputs should be valid and the loader should be visible after form was submitted and disappear after response was got.', async () => {
    render(
      <RenderWithProviders>
        <SignupForm />
      </RenderWithProviders>
    )

    const inputEmail = screen.getByTestId('email')
    const inputPassword = screen.getByTestId('password')
    const inputConfirmPassword = screen.getByTestId('confirmPassword')
    const submitBtn = screen.getByTestId('submitBtn')

    fireEvent.change(inputEmail, { target: { value: 'user@email.com' } })
    fireEvent.change(inputPassword, { target: { value: 'Qwerty78' } })
    fireEvent.change(inputConfirmPassword, { target: { value: 'Qwerty78' } })

    await act(() => {
      userEvent.click(submitBtn)
    })

    expect(inputEmail).toBeValid()
    expect(inputPassword).toBeValid()
    expect(inputConfirmPassword).toBeValid()
    expect(screen.queryAllByTestId('invalid-msg')).toHaveLength(0)

    expect(await screen.findByTestId('loader')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    })
  })

  test('Redirect to main page after successful sign up.', async () => {
    render(
      <RenderWithProviders>
        <SignupForm />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByTestId('email')
    const inputPassword = screen.getByTestId('password')
    const inputConfirmPassword = screen.getByTestId('confirmPassword')
    const submitBtn = screen.getByTestId('submitBtn')

    fireEvent.change(inputEmail, { target: { value: 'user@email.com' } })
    fireEvent.change(inputPassword, { target: { value: 'Qwerty78' } })
    fireEvent.change(inputConfirmPassword, { target: { value: 'Qwerty78' } })

    await act(() => {
      userEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(mockedNavigation).toHaveBeenCalledWith('/', { replace: true })
    })
  })

  test('Render "E-mail address already exists!" error.', async () => {
    render(
      <RenderWithProviders>
        <SignupForm />
      </RenderWithProviders>
    )
    const inputEmail = screen.getByTestId('email')
    const inputPassword = screen.getByTestId('password')
    const inputConfirmPassword = screen.getByTestId('confirmPassword')
    const submitBtn = screen.getByTestId('submitBtn')

    fireEvent.change(inputEmail, { target: { value: 'already@exist.com' } })
    fireEvent.change(inputPassword, { target: { value: 'Qwerty78' } })
    fireEvent.change(inputConfirmPassword, { target: { value: 'Qwerty78' } })

    await act(() => {
      userEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(screen.getByTestId('error-list')).toBeInTheDocument()
    })

    expect(screen.getByText('E-mail address already exists!')).toBeInTheDocument()
  })
})
