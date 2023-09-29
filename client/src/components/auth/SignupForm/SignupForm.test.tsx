import { cleanup, render, screen, waitFor } from '@testing-library/react'
import SignupForm from './SignupForm'
import { Provider } from 'react-redux'
import store from '../../../store'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { wait } from '@testing-library/user-event/dist/utils'
import { a } from 'msw/lib/glossary-de6278a9'

function renderComponent() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    </Provider>
  )
}

const mockedNavigation = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigation
}))

describe('SignupForm', () => {
  const handlers = [
    rest.post('/api/user/signup', (req, res, ctx) => {
      return res(ctx.json({ email: '', password: '' }))
    })
  ]

  const server = setupServer(...handlers)

  beforeAll(() => {
    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
    cleanup()
  })

  test('Email input field should be vaild.', () => {
    render(renderComponent())
    const inputEmail = screen.getByTestId('email')

    act(() => {
      userEvent.type(inputEmail, 'email@user.com')
    })

    expect(inputEmail).toBeInTheDocument()
    expect(inputEmail).toBeValid()
  })

  test('Email input field should be invaild.', () => {
    render(renderComponent())
    const inputEmail = screen.getByTestId('email')

    act(() => {
      userEvent.type(inputEmail, 'emailuser.com')
    })

    expect(inputEmail).toBeInTheDocument()
    expect(inputEmail).toBeInvalid()
  })

  test('Password input field should be vaild.', () => {
    render(renderComponent())
    const inputPassword = screen.getByTestId('password')

    act(() => {
      userEvent.type(inputPassword, 'Qwerty78')
    })

    expect(inputPassword).toBeInTheDocument()
    expect(inputPassword).toBeValid()
  })

  test('Password input field should be invaild.', () => {
    render(renderComponent())
    const inputPassword = screen.getByTestId('password')

    act(() => {
      userEvent.type(inputPassword, 'secret')
    })

    expect(inputPassword).toBeInTheDocument()
    expect(inputPassword).toBeInvalid()
  })

  test('Confirm password input field should be vaild.', () => {
    render(renderComponent())
    const inputPassword = screen.getByTestId('password')
    const inputConfirmPassword = screen.getByTestId('confirmPassword')

    act(() => {
      userEvent.type(inputPassword, 'Qwerty78')
      userEvent.type(inputConfirmPassword, 'Qwerty78')
    })

    expect(inputConfirmPassword).toBeInTheDocument()
    expect(inputConfirmPassword).toBeValid()
  })

  test('Confirm password input field should be invaild.', () => {
    render(renderComponent())
    const inputPassword = screen.getByTestId('password')
    const inputConfirmPassword = screen.getByTestId('confirmPassword')

    act(() => {
      userEvent.type(inputPassword, 'Qwerty78')
      userEvent.type(inputConfirmPassword, 'Qwerty78x')
    })

    expect(inputConfirmPassword).toBeInTheDocument()
    expect(inputConfirmPassword).toBeInvalid()
  })

  test('All input fields after submit should be invalid.', () => {
    render(renderComponent())
    const inputEmail = screen.getByTestId('email')
    const inputPassword = screen.getByTestId('password')
    const inputConfirmPassword = screen.getByTestId('confirmPassword')
    const submitBtn = screen.getByTestId('submitBtn')

    act(() => {
      userEvent.type(inputEmail, 'useremail.com')
      userEvent.type(inputPassword, 'qwerty78')
      userEvent.type(inputConfirmPassword, 'Qwerty78x')
      submitBtn.click()
    })

    expect(submitBtn).toBeInTheDocument()
    expect(inputEmail).toBeInvalid()
    expect(inputPassword).toBeInvalid()
    expect(inputConfirmPassword).toBeInvalid()
  })

  test('Loader should be visible after submit.', async () => {
    render(renderComponent())

    const inputEmail = screen.getByTestId('email')
    const inputPassword = screen.getByTestId('password')
    const inputConfirmPassword = screen.getByTestId('confirmPassword')
    const submitBtn = screen.getByTestId('submitBtn')

    act(() => {
      userEvent.type(inputEmail, 'user@email.com')
      userEvent.type(inputPassword, 'Qwerty78')
      userEvent.type(inputConfirmPassword, 'Qwerty78')
    })

    await act(() => {
      userEvent.click(submitBtn)
    })

    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  test('Sign Up', async () => {
    render(renderComponent())
    const inputEmail = screen.getByTestId('email')
    const inputPassword = screen.getByTestId('password')
    const inputConfirmPassword = screen.getByTestId('confirmPassword')
    const submitBtn = screen.getByTestId('submitBtn')

    await act(() => {
      userEvent.type(inputEmail, 'user@email.com')
      userEvent.type(inputPassword, 'Qwerty78')
      userEvent.type(inputConfirmPassword, 'Qwerty78')
      submitBtn.click()
    })

    expect(mockedNavigation).toHaveBeenCalledWith('/', { replace: true })
  })
})
