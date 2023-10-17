import RestorePassForm from './RestorePassForm'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { setupServer } from 'msw/node'
import { RenderWithProviders, handlers } from '../../../utils/test-utils'

const mockedNavigation = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigation
}))

describe('RestorePassForm', () => {
  const server = setupServer(...handlers)
  let token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImV4cCI6OTk5OTk5OTk5OX0.ff54M0aPirA6PkGxBcIxIQQIxKhEiOKED9SsFa4VXE8'

  beforeAll(() => {
    server.listen()
  })

  afterEach(() => {
    token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImV4cCI6OTk5OTk5OTk5OX0.ff54M0aPirA6PkGxBcIxIQQIxKhEiOKED9SsFa4VXE8'
    server.resetHandlers()
    cleanup()
  })

  afterAll(() => {
    server.close()
    cleanup()
  })

  test('Password input field should be valid.', async () => {
    render(
      <RenderWithProviders>
        <RestorePassForm token={token} />
      </RenderWithProviders>
    )
    const inputPassword = screen.getByLabelText(/password/i)

    act(() => {
      userEvent.type(inputPassword, 'qwerTy123')
    })

    expect(inputPassword).toBeInTheDocument()
    expect(inputPassword).toBeValid()
  })

  test('Password input should be invalid', async () => {
    render(
      <RenderWithProviders>
        <RestorePassForm token={token} />
      </RenderWithProviders>
    )
    const inputPassword = screen.getByLabelText(/password/i)

    act(() => {
      userEvent.type(inputPassword, '123')
    })

    expect(inputPassword).toBeInvalid()
  })

  test('Password input should be invalid after submit', async () => {
    render(
      <RenderWithProviders>
        <RestorePassForm token={token} />
      </RenderWithProviders>
    )
    const inputPassword = screen.getByLabelText(/password/i)
    const submitBtn = screen.getByRole('button', { name: /restore password/i })

    act(() => {
      userEvent.type(inputPassword, '123')
    })

    await act(() => {
      userEvent.click(submitBtn)
    })

    expect(inputPassword).toBeInvalid()
  })

  test('The Loader should be displayed after submit and disappear.', async () => {
    render(
      <RenderWithProviders>
        <RestorePassForm token={token} />
      </RenderWithProviders>
    )
    const inputPassword = screen.getByLabelText(/password/i)
    const submitBtn = screen.getByRole('button', { name: /restore password/i })

    act(() => {
      userEvent.type(inputPassword, 'qwerTy123')
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

  test('Redirect to login page after submit.', async () => {
    render(
      <RenderWithProviders>
        <RestorePassForm token={token} />
      </RenderWithProviders>
    )
    const inputPassword = screen.getByLabelText(/password/i)
    const submitBtn = screen.getByRole('button', { name: /restore password/i })

    act(() => {
      userEvent.type(inputPassword, 'qwerTy123')
    })

    await act(() => {
      userEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(mockedNavigation).toHaveBeenCalledWith('/login', { replace: true })
    })
  })

  test('Render "The time to restore your password is over. Please request an email with password restore instructions again." error.', async () => {
    token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImV4cCI6OTk5OTk5OTk5fQ.k6BPC1eOSJ-tFIIfRsEMkffrVxln6EjIRfURY2a5lZ0'
    render(
      <RenderWithProviders>
        <RestorePassForm token={token} />
      </RenderWithProviders>
    )
    const inputPassword = screen.getByLabelText(/password/i)
    const submitBtn = screen.getByRole('button', { name: /restore password/i })

    act(() => {
      userEvent.type(inputPassword, 'qwerTy123')
    })

    await act(() => {
      userEvent.click(submitBtn)
    })

    expect(
      screen.getByText(/The time to restore your password is over. Please request an email with password restore instructions again./i)
    ).toBeInTheDocument()
  })

  test('Invalid token error', async () => {
    token = 'invalid token'

    render(
      <RenderWithProviders>
        <RestorePassForm token={token} />
      </RenderWithProviders>
    )

    await waitFor(() => {
      expect(mockedNavigation).toHaveBeenCalledWith('/400', { replace: true, state: { data: { error: new Error('Invalid token') } } })
    })
  })

  test('Token verification error', async () => {
    token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImV4cCI6OTk5OTk5OTk5OX0.ff54M0aPirA6PkGxBcIxIQQIxKhEiOKED9SsFa4VXE7'

    render(
      <RenderWithProviders>
        <RestorePassForm token={token} />
      </RenderWithProviders>
    )
    const inputPassword = screen.getByLabelText(/password/i)
    const submitBtn = screen.getByRole('button', { name: /restore password/i })

    act(() => {
      userEvent.type(inputPassword, 'qwerTy123')
    })

    await act(() => {
      userEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(mockedNavigation).toHaveBeenCalledWith('/400', {
        replace: true,
        state: {
          data: {
            data: { code: 0, message: 'Failed to restore password.' },
            errorMsg: 'Request failed with status code 401',
            status: 401
          }
        }
      })
    })
  })
})
