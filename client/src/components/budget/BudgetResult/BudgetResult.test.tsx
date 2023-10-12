import BudgetResult from './BudgetResult'
import { cleanup, render, screen, within } from '@testing-library/react'
import { RenderWithProviders, mockedBudgetItems } from '../../../utils/test-utils'
import store from '../../../store'
import { budgetItemActions } from '../../../store/budget/budget-item-slice'

describe('BudgetResult', () => {
  beforeAll(() => {
    store.dispatch(budgetItemActions.setBudgetItems(mockedBudgetItems))
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

    expect(education[0]).toHaveTextContent('education')
    expect(education[1]).toHaveTextContent('3.00')
  })
})
