import BudgetPage from './BudgetPage'
import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react'
import { RenderWithProviders } from '../../../utils/test-utils'
import store from '../../../store'
import { userActions } from '../../../store/user/user-slice'
import { setupServer } from 'msw/node'
import { handlers } from '../../../utils/test-utils'
import { categoriesActions } from '../../../store/categories/categories-slice'
import { act } from 'react-dom/test-utils'

describe('BudgetPage', () => {
  const server = setupServer(...handlers)

  beforeAll(() => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('id', 'modal-root')
    document.body.appendChild(portalRoot)
    store.dispatch(userActions.setUserData({ token: 'test', id: 1, email: 'user@email.com', autoLogoutTimer: null }))
    store.dispatch(userActions.login())
    store.dispatch(categoriesActions.setCategories([]))
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

  test('Should render Budget Page.', async () => {
    render(
      <RenderWithProviders>
        <BudgetPage />
      </RenderWithProviders>
    )

    const title = screen.queryByText('Budget')

    expect(title).toBeInTheDocument()
    expect(screen.getByTestId('months-trend')).toBeInTheDocument()
    expect(screen.getByTestId('budget-result')).toBeInTheDocument()
    expect(screen.getByTestId('filter-budget-list-form')).toBeInTheDocument()
    expect(screen.getByTestId('budget-item-list')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryAllByTestId('budget-item')).toHaveLength(5)
    })
  })

  test('Should load categories if user is logged in.', async () => {
    render(
      <RenderWithProviders>
        <BudgetPage />
      </RenderWithProviders>
    )

    await waitFor(() => {
      expect(store.getState().categories.categories.length).toBe(3)
    })
  })

  test('Should render 2 budget items if filter is set to "Fuel".', async () => {
    render(
      <RenderWithProviders>
        <BudgetPage />
      </RenderWithProviders>
    )

    const nameFilter = screen.getByLabelText('Filter by name')

    fireEvent.change(nameFilter, { target: { value: 'fuel' } })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 1000))
    })

    await waitFor(() => {
      expect(screen.queryAllByTestId('budget-item')).toHaveLength(2)
    })
  })
})
