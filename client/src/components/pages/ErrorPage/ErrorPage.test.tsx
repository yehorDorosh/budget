import { render, screen, cleanup, waitFor } from '@testing-library/react'
import { RenderWithProviders } from '../../../utils/test-utils'
import store from '../../../store'
import { setupServer } from 'msw/node'
import { handlers } from '../../../utils/test-utils'
import { createMemoryRouter, useNavigate, RouterProvider } from 'react-router-dom'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { routesConfig } from '../../../routers'
import RouterErrorBoundary from '../../errors/RouterErrorBoundary'
import ErrorPage from './ErrorPage'
import axios from 'axios'
import { errorHandler } from '../../../utils/errors'

const UnexpectedErrorCmp = () => {
  throw new Error('Mocked component error')
}

const AxiosErrorCmp = () => {
  const navigate = useNavigate()
  async function getAxiosError() {
    try {
      await axios.get('/api/error')
    } catch (error) {
      navigate('/500', { state: { data: errorHandler(error) } })
    }
  }
  getAxiosError()
  return null
}

const RedirectTo400 = () => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/400', { state: { data: { error: { message: 'Mocked regular error message.' } } } })
  }, [navigate])
  return null
}

describe('ErrorPage', () => {
  const server = setupServer(...handlers)

  beforeAll(() => {
    server.listen()
  })

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    server.resetHandlers()
    jest.restoreAllMocks()
    cleanup()
  })

  afterAll(() => {
    server.close()
    cleanup()
  })

  test('Should render Error Page called by unexpected error.', async () => {
    render(
      <RenderWithProviders>
        <UnexpectedErrorCmp />
      </RenderWithProviders>
    )

    expect(screen.getByText('Error.')).toBeInTheDocument()
    expect(screen.getByText('Sorry, an unexpected error has occurred.')).toBeInTheDocument()
    expect(screen.getByText('Mocked component error')).toBeInTheDocument()
  })

  test('Should render Error Page called by not exist link.', async () => {
    const router = createMemoryRouter(routesConfig, { initialEntries: ['/not-exist-link'] })
    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    )

    expect(screen.getByText('Error.')).toBeInTheDocument()
    expect(screen.getByText('Sorry, the page you were looking for could not be found.')).toBeInTheDocument()
    expect(screen.getByText('404 Not Found')).toBeInTheDocument()
  })

  test('Should render Error Page called by 400 error.', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <RedirectTo400 />,
          errorElement: <RouterErrorBoundary />
        },
        {
          path: '/400',
          element: <ErrorPage />
        }
      ],
      { initialEntries: ['/'] }
    )

    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    )

    expect(screen.getByText('Error.')).toBeInTheDocument()
    expect(screen.getByText('Mocked regular error message.')).toBeInTheDocument()
  })

  test('Should render Error Page called by axios error.', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <AxiosErrorCmp />,
          errorElement: <RouterErrorBoundary />
        },
        {
          path: '/500',
          element: <ErrorPage />
        }
      ],
      { initialEntries: ['/'] }
    )

    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByText('Error.')).toBeInTheDocument()
    })
    expect(screen.getByText('Request failed with status code 422')).toBeInTheDocument()
    expect(screen.getByTestId('error-list')).toBeInTheDocument()
  })
})
