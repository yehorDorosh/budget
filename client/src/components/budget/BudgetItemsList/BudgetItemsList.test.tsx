import BudgetItemsList from './BudgetItemsList'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { act } from 'react-dom/test-utils'
import { RenderWithProviders, handlers } from '../../../utils/test-utils'
import store from '../../../store'
import { budgetItemActions } from '../../../store/budget/budget-item-slice'

describe('BudgetItemsList', () => {
  const server = setupServer(...handlers)

  beforeAll(() => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('id', 'modal-root')
    document.body.appendChild(portalRoot)
    server.listen()
  })

  beforeEach(() => {
    Object.defineProperty(global, 'IntersectionObserver', {
      value: jest.fn().mockImplementation((observeHandler) => {
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          inViewPort: () => {
            observeHandler([{ isIntersecting: true }])
          }
        }
      }),
      writable: true
    })
  })

  afterEach(() => {
    server.resetHandlers()
    cleanup()
    store.dispatch(budgetItemActions.setFilterName(''))
    jest.resetAllMocks()
  })

  afterAll(() => {
    server.close()
    cleanup()
  })

  test('Should render BudgetItemsList component.', async () => {
    render(
      <RenderWithProviders>
        <BudgetItemsList token="token" />
      </RenderWithProviders>
    )

    await waitFor(() => {
      expect(screen.getAllByTestId('budget-item')).toHaveLength(5)
    })
  })

  test('Should render only four BudgetItem component after filter name changed.', async () => {
    render(
      <RenderWithProviders>
        <BudgetItemsList token="token" />
      </RenderWithProviders>
    )

    await waitFor(() => {
      expect(screen.getAllByTestId('budget-item')).toHaveLength(5)
    })

    await act(() => {
      store.dispatch(budgetItemActions.setFilterName('fuel'))
    })

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100))
    })

    await waitFor(() => {
      expect(screen.getAllByTestId('budget-item')).toHaveLength(2)
    })
  })

  test('Should render 1 items if filter month changed to 2023-01.', async () => {
    render(
      <RenderWithProviders>
        <BudgetItemsList token="token" />
      </RenderWithProviders>
    )

    await act(() => {
      store.dispatch(budgetItemActions.setFilterMonth('2023-01'))
    })

    // await act(async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 1000))
    // })

    await waitFor(() => {
      expect(screen.getAllByTestId('budget-item')).toHaveLength(1)
    })
  })
})
