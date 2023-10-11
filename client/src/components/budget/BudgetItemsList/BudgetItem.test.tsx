import BudgetItem from './BudgetItem'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { setupServer } from 'msw/node'
import { RenderWithProviders, handlers } from '../../../utils/test-utils'
import { CategoryType } from '../../../types/enum'
import store from '../../../store'

describe('BudgetItem', () => {
  const server = setupServer(...handlers)

  const budgetItem = {
    id: 1,
    name: 'fuel',
    ignore: false,
    category: { id: 1, name: 'car', categoryType: CategoryType.EXPENSE },
    userDate: '2023-01-01',
    value: 10
  }

  beforeAll(() => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('id', 'modal-root')
    document.body.appendChild(portalRoot)
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

  test('Should render BudgetItem component.', async () => {
    render(
      <RenderWithProviders>
        <BudgetItem token="token" budgetItem={budgetItem} />
      </RenderWithProviders>
    )

    expect(screen.getByText(/fuel/i)).toBeInTheDocument()
    expect(screen.getByText(/10/i)).toBeInTheDocument()
    expect(screen.getByText(/car/i)).toBeInTheDocument()
    expect(screen.getByText(/2023-01-01/i)).toBeInTheDocument()
  })

  test('Should open modal window.', async () => {
    render(
      <RenderWithProviders>
        <BudgetItem token="token" budgetItem={budgetItem} />
      </RenderWithProviders>
    )

    const editBtn = screen.getByText(/edit/i)

    act(() => {
      userEvent.click(editBtn)
    })

    expect(screen.getByTestId('update-budget-item-form')).toBeInTheDocument()
  })

  test('Should close modal window.', async () => {
    render(
      <RenderWithProviders>
        <BudgetItem token="token" budgetItem={budgetItem} />
      </RenderWithProviders>
    )

    const editBtn = screen.getByText(/edit/i)

    act(() => {
      userEvent.click(editBtn)
    })

    expect(screen.getByTestId('update-budget-item-form')).toBeInTheDocument()

    const closeBtn = screen.getByTestId('close-btn')

    act(() => {
      userEvent.click(closeBtn)
    })

    expect(screen.queryByTestId('update-budget-item-form')).not.toBeInTheDocument()
  })

  test('Should close modal window after submit', async () => {
    render(
      <RenderWithProviders>
        <BudgetItem token="token" budgetItem={budgetItem} />
      </RenderWithProviders>
    )

    const editBtn = screen.getByText(/edit/i)

    act(() => {
      userEvent.click(editBtn)
    })

    expect(screen.getByTestId('update-budget-item-form')).toBeInTheDocument()

    const closeBtn = screen.getByRole('button', { name: /save budget item/i })

    await act(() => {
      userEvent.click(closeBtn)
    })

    await waitFor(() => {
      expect(screen.queryByTestId('update-budget-item-form')).not.toBeInTheDocument()
    })
  })

  test('Should delete item', async () => {
    const mockDispatch = jest.spyOn(store, 'dispatch')

    render(
      <RenderWithProviders>
        <BudgetItem token="token" budgetItem={budgetItem} />
      </RenderWithProviders>
    )

    const deleteBtn = screen.getByText(/delete/i)

    await act(() => {
      userEvent.click(deleteBtn)
    })

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function))
    })
  })

  test('Should has class text-bg-secondary for ignore item', async () => {
    render(
      <RenderWithProviders>
        <BudgetItem
          token="token"
          budgetItem={{
            id: 1,
            name: 'fuel',
            ignore: true,
            category: { id: 1, name: 'car', categoryType: CategoryType.EXPENSE },
            userDate: '2023-01-01',
            value: 10
          }}
        />
      </RenderWithProviders>
    )

    expect(screen.getByTestId('budget-item')).toHaveClass('text-bg-secondary')
  })

  test('Should has class text-bg-light for income item', async () => {
    render(
      <RenderWithProviders>
        <BudgetItem
          token="token"
          budgetItem={{
            id: 1,
            name: 'fuel',
            ignore: false,
            category: { id: 1, name: 'car', categoryType: CategoryType.INCOME },
            userDate: '2023-01-01',
            value: 10
          }}
        />
      </RenderWithProviders>
    )

    expect(screen.getByTestId('budget-item')).toHaveClass('text-bg-light')
  })
})
