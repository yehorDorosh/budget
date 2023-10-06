import RequireAuth from './RequireAuth'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { RenderWithProviders } from '../../../utils/test-utils'

const mockedNavigation = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigation
}))

describe('RequireAuth', () => {
  afterEach(() => {
    localStorage.clear()
    cleanup()
  })

  afterAll(() => {
    cleanup()
  })

  test('Should redirect to login page if user is not logged in.', async () => {
    render(
      <RenderWithProviders>
        <RequireAuth>
          <div>Test</div>
        </RequireAuth>
      </RenderWithProviders>
    )

    await waitFor(() => {
      expect(mockedNavigation).toHaveBeenCalledWith('/login', { replace: true })
    })
  })

  test('Should render children localstorage token is present.', async () => {
    localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEifQ.BQmWM1mXBfpTw_Tv-yR3qodI0OoRmrm3Tlz6ZR60Yi4')

    render(
      <RenderWithProviders>
        <RequireAuth>
          <div>Test</div>
        </RequireAuth>
      </RenderWithProviders>
    )

    await waitFor(() => {
      expect(screen.getByText(/test/i)).toBeInTheDocument()
    })
  })

  test('Should render children if token is present in store.', async () => {
    render(
      <RenderWithProviders setUserData={true}>
        <RequireAuth>
          <div>Test</div>
        </RequireAuth>
      </RenderWithProviders>
    )

    await waitFor(() => {
      expect(screen.getByText(/test/i)).toBeInTheDocument()
    })
  })
})
