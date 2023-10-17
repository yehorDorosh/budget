import FilterBudgetListForm from './FilterBudgetListForm'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { setupServer } from 'msw/node'
import { RenderWithProviders, handlers } from '../../../utils/test-utils'
import store from '../../../store'
import { budgetItemActions } from '../../../store/budget/budget-item-slice'
import { CategoryType, QueryFilter } from '../../../types/enum'
import { categoriesActions } from '../../../store/categories/categories-slice'

describe('FilterBudgetListForm', () => {
  const server = setupServer(...handlers)

  beforeAll(() => {
    server.listen()
  })

  beforeEach(() => {
    store.dispatch(categoriesActions.setCategories([{ id: 1, name: 'car', categoryType: CategoryType.EXPENSE }]))
  })

  afterEach(() => {
    server.resetHandlers()
    cleanup()
  })

  afterAll(() => {
    server.close()
    cleanup()
  })

  test('Should call action when category type filter changed to Expense.', async () => {
    // const mockDispatch = jest.spyOn(store, 'dispatch')

    render(
      <RenderWithProviders>
        <FilterBudgetListForm />
      </RenderWithProviders>
    )
    const radioBtn = screen.getByLabelText(/category type expense/i)

    act(() => {
      userEvent.click(radioBtn)
    })

    expect(radioBtn).toBeInTheDocument()
    expect(radioBtn).toBeChecked()

    // await waitFor(() => {
    //   expect(mockDispatch).toHaveBeenCalledWith(budgetItemActions.setFilterCategoryType(CategoryType.EXPENSE))
    // })

    expect(store.getState().budgetItem.filters.categoryType).toBe(CategoryType.EXPENSE)
  })

  test('Should call action when category filter changed to Income.', async () => {
    render(
      <RenderWithProviders>
        <FilterBudgetListForm />
      </RenderWithProviders>
    )
    const radioBtn = screen.getByLabelText(/category type income/i)

    act(() => {
      userEvent.click(radioBtn)
    })

    expect(radioBtn).toBeInTheDocument()
    expect(radioBtn).toBeChecked()

    expect(store.getState().budgetItem.filters.categoryType).toBe(CategoryType.INCOME)
  })

  test('Should call action when category filter changed to All.', async () => {
    render(
      <RenderWithProviders>
        <FilterBudgetListForm />
      </RenderWithProviders>
    )
    const radioBtn = screen.getByLabelText(/category type income/i)
    const radioBtnAll = screen.getByLabelText(/All Category Types/i)

    act(() => {
      userEvent.click(radioBtn)
    })

    act(() => {
      userEvent.click(radioBtnAll)
    })

    expect(radioBtnAll).toBeInTheDocument()
    expect(radioBtnAll).toBeChecked()

    expect(store.getState().budgetItem.filters.categoryType).toBe(undefined)
  })

  test('On change category filter should call action.', async () => {
    render(
      <RenderWithProviders>
        <FilterBudgetListForm />
      </RenderWithProviders>
    )
    const select = screen.getByLabelText(/filter by category/i)

    act(() => {
      userEvent.selectOptions(select, '1')
    })

    expect(store.getState().budgetItem.filters.category).toBe(1)
  })

  test('On change name filter should call action.', async () => {
    render(
      <RenderWithProviders>
        <FilterBudgetListForm />
      </RenderWithProviders>
    )
    const input = screen.getByLabelText(/filter by name/i)

    act(() => {
      userEvent.type(input, 't')
    })

    expect(store.getState().budgetItem.filters.name).toBe('t')
  })

  test('On change ignore filter should call action.', async () => {
    render(
      <RenderWithProviders>
        <FilterBudgetListForm />
      </RenderWithProviders>
    )
    const input = screen.getByLabelText(/ignore/i)

    act(() => {
      userEvent.click(input)
    })

    expect(store.getState().budgetItem.filters.ignore).toBe(true)
  })

  test('If filter type All should not render month and year filter', async () => {
    render(
      <RenderWithProviders>
        <FilterBudgetListForm />
      </RenderWithProviders>
    )
    const btn = screen.getByRole('button', { name: /show all/i })

    fireEvent.click(btn)

    expect(btn).toHaveClass('active')
    expect(store.getState().budgetItem.filters.active).toBe(QueryFilter.ALL)
    expect(screen.queryByLabelText(/year/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/month/i)).not.toBeInTheDocument()
  })

  test('If filter type Month should render month filter from.', async () => {
    render(
      <RenderWithProviders>
        <FilterBudgetListForm />
      </RenderWithProviders>
    )
    const btn = screen.getByRole('button', { name: /show by month/i })
    fireEvent.click(btn)

    expect(btn).toHaveClass('active')
    expect(store.getState().budgetItem.filters.active).toBe(QueryFilter.MONTH)
    expect(screen.getByLabelText(/month/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/year/i)).not.toBeInTheDocument()
  })

  test('If filter type Year should render year filter from.', async () => {
    render(
      <RenderWithProviders>
        <FilterBudgetListForm />
      </RenderWithProviders>
    )
    const btn = screen.getByRole('button', { name: /show by year/i })
    fireEvent.click(btn)

    expect(btn).toHaveClass('active')
    expect(store.getState().budgetItem.filters.active).toBe(QueryFilter.YEAR)
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/month/i)).not.toBeInTheDocument()
  })

  test('If Month form input was changed then should changed the filter month state.', async () => {
    render(
      <RenderWithProviders>
        <FilterBudgetListForm />
      </RenderWithProviders>
    )
    act(() => {
      store.dispatch(budgetItemActions.setActiveFilter(QueryFilter.MONTH))
    })
    const input = screen.getByLabelText(/month/i)
    const prevBtn = screen.getByRole('button', { name: /previous month/i })
    const nextBtn = screen.getByRole('button', { name: /next month/i })

    act(() => {
      userEvent.click(prevBtn)
    })

    const expectedMonth = (monthCorrection: number = 0) =>
      `${new Date().getFullYear()}-${(new Date().getMonth() + 1 + monthCorrection).toString().padStart(2, '0')}`

    expect(store.getState().budgetItem.filters.month).toBe(expectedMonth(-1))

    act(() => {
      userEvent.click(nextBtn)
    })

    expect(store.getState().budgetItem.filters.month).toBe(expectedMonth(0))

    fireEvent.change(input, { target: { value: '2023-01' } })

    expect(store.getState().budgetItem.filters.month).toBe('2023-01')
  })

  test('If Year form input was changed then should changed the filter year state.', async () => {
    render(
      <RenderWithProviders>
        <FilterBudgetListForm />
      </RenderWithProviders>
    )
    act(() => {
      store.dispatch(budgetItemActions.setActiveFilter(QueryFilter.YEAR))
    })
    const input = screen.getByLabelText(/year/i)
    const prevBtn = screen.getByRole('button', { name: /previous year/i })
    const nextBtn = screen.getByRole('button', { name: /next year/i })

    act(() => {
      userEvent.click(prevBtn)
    })

    expect(store.getState().budgetItem.filters.year).toBe((new Date().getFullYear() - 1).toString())

    act(() => {
      userEvent.click(nextBtn)
    })

    expect(store.getState().budgetItem.filters.year).toBe(new Date().getFullYear().toString())

    fireEvent.change(input, { target: { value: '2023' } })

    expect(store.getState().budgetItem.filters.year).toBe('2023')
  })
})
