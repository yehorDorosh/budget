import BudgetResult from './BudgetResult'
import { cleanup, render, screen, within } from '@testing-library/react'
import { RenderWithProviders } from '../../../utils/test-utils'
import store from '../../../store'
import { budgetItemActions } from '../../../store/budget/budget-item-slice'
import { CategoryType } from '../../../types/enum'

describe('BudgetResult', () => {
  beforeAll(() => {
    const budgetItems = [
      {
        id: 1,
        name: 'fuel',
        ignore: false,
        category: { id: 1, name: 'car', categoryType: CategoryType.EXPENSE },
        userDate: '2023-01-01',
        value: 10
      },
      {
        id: 2,
        name: 'beer',
        ignore: false,
        category: { id: 2, name: 'alcohol', categoryType: CategoryType.EXPENSE },
        userDate: '2023-02-01',
        value: 5
      },
      {
        id: 3,
        name: 'book',
        ignore: false,
        category: { id: 3, name: 'educaton', categoryType: CategoryType.EXPENSE },
        userDate: '2023-02-01',
        value: 3
      },
      {
        id: 4,
        name: 'fuel',
        ignore: false,
        category: { id: 1, name: 'car', categoryType: CategoryType.EXPENSE },
        userDate: '2023-02-01',
        value: 15
      },
      {
        id: 5,
        name: 'bank',
        ignore: false,
        category: { id: 2, name: 'salary', categoryType: CategoryType.INCOME },
        userDate: '2023-02-01',
        value: 500
      }
    ]
    store.dispatch(budgetItemActions.setBudgetItems(budgetItems))
    store.dispatch(budgetItemActions.setActiveFilter(0))
  })

  beforeEach(() => {
    cleanup()
  })

  afterAll(() => {
    cleanup()
  })

  test('Should render BudgetResult component.', async () => {
    render(
      <RenderWithProviders>
        <BudgetResult />
      </RenderWithProviders>
    )

    expect(screen.getByText('Summary')).toBeInTheDocument()
    expect(screen.getByText('Most Expenses')).toBeInTheDocument()
  })

  test('Total income should be 500.', async () => {
    render(
      <RenderWithProviders>
        <BudgetResult />
      </RenderWithProviders>
    )

    expect(screen.getByTestId('total-income')).toHaveTextContent('500.00')
  })

  test('Total expense should be 33.', async () => {
    render(
      <RenderWithProviders>
        <BudgetResult />
      </RenderWithProviders>
    )

    expect(screen.getByTestId('total-expense')).toHaveTextContent('33.00')
  })

  test('Total should be 467.', async () => {
    render(
      <RenderWithProviders>
        <BudgetResult />
      </RenderWithProviders>
    )

    expect(screen.getByTestId('total')).toHaveTextContent('467.00')
  })

  test('Render most expenses category table.', async () => {
    render(
      <RenderWithProviders>
        <BudgetResult />
      </RenderWithProviders>
    )

    const rows = screen.getAllByTestId('expense-list-item')
    const salary = within(rows[0]).getAllByRole('cell')
    const car = within(rows[1]).getAllByRole('cell')
    const alcohol = within(rows[2]).getAllByRole('cell')
    const education = within(rows[3]).getAllByRole('cell')

    expect(salary[0]).toHaveTextContent('salary')
    expect(salary[1]).toHaveTextContent('500.00')

    expect(car[0]).toHaveTextContent('car')
    expect(car[1]).toHaveTextContent('25.00')

    expect(alcohol[0]).toHaveTextContent('alcohol')
    expect(alcohol[1]).toHaveTextContent('5.00')

    expect(education[0]).toHaveTextContent('educaton')
    expect(education[1]).toHaveTextContent('3.00')
  })
})
