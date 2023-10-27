import HomePage from './HomePage'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import { RenderWithProviders } from '../../../utils/test-utils'
import store from '../../../store'
import { userActions } from '../../../store/user/user-slice'
import { setupServer } from 'msw/node'
import { handlers } from '../../../utils/test-utils'
import { categoriesActions } from '../../../store/categories/categories-slice'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'

describe('HomePage', () => {
  const server = setupServer(...handlers)

  beforeAll(() => {
    server.listen()
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('id', 'modal-root')
    document.body.appendChild(portalRoot)
  })

  afterEach(() => {
    server.resetHandlers()
    cleanup()
  })

  afterAll(() => {
    server.close()
    cleanup()
  })

  test('Should render Home Page title.', () => {
    render(
      <RenderWithProviders>
        <HomePage />
      </RenderWithProviders>
    )

    const title = screen.queryByText('Home Page')
    const form = screen.queryByTestId('add-budget-item-form')

    expect(title).toBeInTheDocument()
    expect(form).not.toBeInTheDocument()
  })

  test('Should render Add Budget Item Form if user is logged in.', () => {
    store.dispatch(userActions.setUserData({ token: 'test', id: 1, email: 'user@email.com', autoLogoutTimer: null }))
    store.dispatch(userActions.login())

    render(
      <RenderWithProviders>
        <HomePage />
      </RenderWithProviders>
    )

    const form = screen.queryByTestId('add-budget-item-form')

    expect(form).toBeInTheDocument()
  })

  test('Should load categories if user is logged in.', async () => {
    store.dispatch(userActions.setUserData({ token: 'test', id: 1, email: 'user@email.com', autoLogoutTimer: null }))
    store.dispatch(userActions.login())
    store.dispatch(categoriesActions.setCategories([]))

    render(
      <RenderWithProviders>
        <HomePage />
      </RenderWithProviders>
    )

    const categorySelect = screen.getByLabelText('Category')

    await waitFor(() => {
      expect(store.getState().categories.categories.length).toBe(3)
    })

    act(() => {
      userEvent.selectOptions(categorySelect, '1')
    })

    expect(categorySelect).toHaveValue('1')
  })
})
