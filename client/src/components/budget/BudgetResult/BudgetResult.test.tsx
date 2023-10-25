import BudgetResult from './BudgetResult'
import { cleanup, render, screen, within } from '@testing-library/react'
import { RenderWithProviders } from '../../../utils/test-utils'
import store from '../../../store'
import { userActions } from '../../../store/user/user-slice'
import { setupServer } from 'msw/node'
import { handlers } from '../../../utils/test-utils'

describe('BudgetResult', () => {
  const server = setupServer(...handlers)
  beforeAll(() => {
    store.dispatch(userActions.setUserData({ id: 1, email: 'user@email.com', token: '123', autoLogoutTimer: null }))
    server.listen()
  })

  beforeEach(() => {
    server.resetHandlers()
    cleanup()
  })

  afterAll(() => {
    server.close()
    cleanup()
  })

  test('Should render BudgetResult component.', async () => {
    render(
      <RenderWithProviders>
        <BudgetResult />
      </RenderWithProviders>
    )

    expect(await screen.findByTestId('summary')).toBeInTheDocument()
    expect(screen.getByText('Most Expenses')).toBeInTheDocument()
  })

  test('Total income should be 1000.', async () => {
    render(
      <RenderWithProviders>
        <BudgetResult />
      </RenderWithProviders>
    )

    expect(await screen.findByTestId('total-income')).toHaveTextContent('1000')
  })

  test('Total expense should be 1000.', async () => {
    render(
      <RenderWithProviders>
        <BudgetResult />
      </RenderWithProviders>
    )

    expect(await screen.findByTestId('total-expense')).toHaveTextContent('1000')
  })

  test('Total should be 0.', async () => {
    render(
      <RenderWithProviders>
        <BudgetResult />
      </RenderWithProviders>
    )

    expect(await screen.findByTestId('total')).toHaveTextContent('0.00')
  })

  test('Render most expenses category table.', async () => {
    render(
      <RenderWithProviders>
        <BudgetResult />
      </RenderWithProviders>
    )

    const rows = await screen.findAllByTestId('expense-list-item')
    const car = within(rows[0]).getAllByRole('cell')

    expect(car[0]).toHaveTextContent('car')
    expect(car[1]).toHaveTextContent('100')
  })
})
