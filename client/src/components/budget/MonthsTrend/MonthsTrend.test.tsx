import MonthsTrend from './MonthsTrend'
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { setupServer } from 'msw/node'
import { RenderWithProviders, handlers, mockedBudgetItems } from '../../../utils/test-utils'
import store from '../../../store'
import { budgetItemActions } from '../../../store/budget/budget-item-slice'

describe('MonthsTrend', () => {
  const server = setupServer(...handlers)

  beforeAll(() => {
    server.listen()
    store.dispatch(budgetItemActions.setTrendBudgetItems(mockedBudgetItems))
    store.dispatch(budgetItemActions.setBudgetItems(mockedBudgetItems))
  })

  afterEach(() => {
    server.resetHandlers()
    cleanup()
  })

  afterAll(() => {
    server.close()
    cleanup()
  })

  test('Year from should work correctly.', async () => {
    render(
      <RenderWithProviders>
        <MonthsTrend token="token" />
      </RenderWithProviders>
    )

    const input = screen.getByLabelText(/year/i)
    const prevBtn = screen.getByRole('button', { name: /previous year/i })
    const nextBtn = screen.getByRole('button', { name: /next year/i })

    act(() => {
      userEvent.click(prevBtn)
    })

    expect(input.getAttribute('value')).toBe((new Date().getFullYear() - 1).toString())

    act(() => {
      userEvent.click(nextBtn)
    })

    expect(input.getAttribute('value')).toBe(new Date().getFullYear().toString())

    fireEvent.change(input, { target: { value: '2023' } })

    expect(input.getAttribute('value')).toBe('2023')
  })

  test('Year statistics should be correct.', async () => {
    jest.spyOn(Date.prototype, 'getFullYear').mockReturnValue(2023)
    jest.spyOn(Date.prototype, 'getMonth').mockReturnValue(9)

    render(
      <RenderWithProviders>
        <MonthsTrend token="token" />
      </RenderWithProviders>
    )

    const input = screen.getByLabelText(/year/i)
    fireEvent.change(input, { target: { value: '2023' } })

    await waitFor(() => {
      expect(screen.getByText(/average expenses/i).textContent).toBe('Average Expenses: 1000')
    })
    expect(screen.getByText(/average income/i).textContent).toBe('Average Income: 1000')
    expect(screen.getByText(/average saved/i).textContent).toBe('Average Saved: 0.00')
    expect(screen.getByText(/total saved/i).textContent).toBe('Total saved: 0.00')
  })

  test('Month statistics should be correct.', async () => {
    jest.spyOn(Date.prototype, 'getFullYear').mockRestore()
    jest.spyOn(Date.prototype, 'getMonth').mockRestore()

    render(
      <RenderWithProviders>
        <MonthsTrend token="token" />
      </RenderWithProviders>
    )

    const input = screen.getByLabelText(/year/i)
    fireEvent.change(input, { target: { value: '2023' } })

    await waitFor(() => {
      expect(screen.getByTestId('expense-0').textContent).toBe('1000.00')
    })
    expect(screen.getByTestId('income-0').textContent).toBe('1000.00')
    expect(screen.getByTestId('total-0').textContent).toBe('0.00')
  })
})
