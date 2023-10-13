import CategoriesPage from './CategoriesPage'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import { RenderWithProviders } from '../../../utils/test-utils'
import store from '../../../store'
import { userActions } from '../../../store/user/user-slice'
import { setupServer } from 'msw/node'
import { handlers } from '../../../utils/test-utils'
import { categoriesActions } from '../../../store/categories/categories-slice'

describe('HomePage', () => {
  const server = setupServer(...handlers)

  beforeAll(() => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('id', 'modal-root')
    document.body.appendChild(portalRoot)
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

  test('Should render Categories Page.', async () => {
    render(
      <RenderWithProviders>
        <CategoriesPage />
      </RenderWithProviders>
    )

    const title = screen.queryByText('Categories')

    expect(title).toBeInTheDocument()
    expect(screen.getByTestId('add-category-form')).toBeInTheDocument()
    expect(screen.getByTestId('categories-list')).toBeInTheDocument()
  })

  test('Should load categories if user is logged in.', async () => {
    render(
      <RenderWithProviders>
        <CategoriesPage />
      </RenderWithProviders>
    )

    await waitFor(() => {
      expect(store.getState().categories.categories.length).toBe(3)
    })

    expect(screen.queryAllByTestId('category-item')).toHaveLength(3)
  })
})
