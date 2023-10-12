import CategoriesList from './CategoriesList'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { RenderWithProviders, handlers, mockedCategories } from '../../../utils/test-utils'
import store from '../../../store'
import { categoriesActions } from '../../../store/categories/categories-slice'

describe('BudgetItemsList', () => {
  const server = setupServer(...handlers)

  beforeAll(() => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('id', 'modal-root')
    document.body.appendChild(portalRoot)
    store.dispatch(categoriesActions.setCategories(mockedCategories))
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

  test('Should render CategoryList component.', async () => {
    render(
      <RenderWithProviders>
        <CategoriesList token="token" />
      </RenderWithProviders>
    )

    await waitFor(() => {
      expect(screen.queryAllByTestId('category-item')).toHaveLength(3)
    })
  })
})
