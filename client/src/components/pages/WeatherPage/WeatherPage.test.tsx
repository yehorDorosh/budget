import WeatherPage from './WeatherPage'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import { RenderWithProviders } from '../../../utils/test-utils'
import store from '../../../store'
import { userActions } from '../../../store/user/user-slice'
import { setupServer } from 'msw/node'
import { handlers } from '../../../utils/test-utils'
import { categoriesActions } from '../../../store/categories/categories-slice'

describe('WeatherPage', () => {
  const server = setupServer(...handlers)

  beforeAll(() => {
    store.dispatch(userActions.setUserData({ token: 'test', id: 1, email: 'user@email.com', autoLogoutTimer: null }))
    store.dispatch(userActions.login())
    server.listen()
  })

  beforeEach(() => {
    store.dispatch(categoriesActions.setCategories([]))
  })

  afterEach(() => {
    server.resetHandlers()
    cleanup()
  })

  afterAll(() => {
    server.close()
    cleanup()
  })

  test('Should render Weather Page.', async () => {
    render(
      <RenderWithProviders>
        <WeatherPage />
      </RenderWithProviders>
    )

    const title = screen.queryByText('Weather Page')

    expect(title).toBeInTheDocument()
  })

  test('Should load weather.', async () => {
    render(
      <RenderWithProviders>
        <WeatherPage />
      </RenderWithProviders>
    )

    await waitFor(() => {
      expect(store.getState().weather.weather).toHaveLength(3)
    })

    expect(screen.queryAllByTestId('last-weather-item')).toHaveLength(3)
  })
})
