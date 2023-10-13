import { cleanup, render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { routesConfig } from '../../../routers'
import store from '../../../store'
import { Provider } from 'react-redux'

describe('RestorePassPage', () => {
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImV4cCI6OTk5OTk5OTk5fQ.k6BPC1eOSJ-tFIIfRsEMkffrVxln6EjIRfURY2a5lZ0'

  beforeEach(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({
        token: 'token'
      }),
      useRouteMatch: () => ({
        url: `/restore-password/eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImV4cCI6OTk5OTk5OTk5fQ.k6BPC1eOSJ-tFIIfRsEMkffrVxln6EjIRfURY2a5lZ0`
      })
    }))
  })

  afterEach(() => {
    jest.unmock('react-router-dom')
    cleanup()
  })

  test('Should render RestorePassPage.', async () => {
    const router = createMemoryRouter(routesConfig, { initialEntries: [`/restore-password/${token}`] })
    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    )

    expect(screen.getByText('Enter new password')).toBeInTheDocument()
    expect(screen.getByTestId('restore-pass-form')).toBeInTheDocument()
  })

  test('Should redirect to ErrorPage if token is invalid.', async () => {
    const router = createMemoryRouter(routesConfig, { initialEntries: [`/restore-password/invalidToken`] })
    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    )

    expect(screen.getByText('Error.')).toBeInTheDocument()
    expect(screen.getByText('Invalid token')).toBeInTheDocument()
  })
})
