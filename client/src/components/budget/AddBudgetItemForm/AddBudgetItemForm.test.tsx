import AddBudgetItemForm from './AddBudgetItemForm'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { setupServer } from 'msw/node'
import { RenderWithProviders, handlers } from '../../../utils/test-utils'
import store from '../../../store'
import { budgetItemActions } from '../../../store/budget/budget-item-slice'
import { categoriesActions } from '../../../store/categories/categories-slice'
import { CategoryType } from '../../../types/enum'

describe('AddBudgetItemForm', () => {
  const server = setupServer(...handlers)

  beforeAll(() => {
    server.listen()
    store.dispatch(
      categoriesActions.setCategories([
        { id: 1, name: 'car', categoryType: CategoryType.EXPENSE },
        { id: 3, name: 'education', categoryType: CategoryType.EXPENSE }
      ])
    )
  })

  afterEach(() => {
    server.resetHandlers()
    cleanup()
  })

  afterAll(() => {
    server.close()
    cleanup()
  })

  test('Name input field should be valid.', async () => {
    render(
      <RenderWithProviders>
        <AddBudgetItemForm token={'token'} />
      </RenderWithProviders>
    )

    const inputName = screen.getByLabelText(/name/i)

    act(() => {
      userEvent.type(inputName, 'fuel')
    })

    expect(inputName).toBeInTheDocument()
    expect(inputName).toBeValid()
  })

  test('Name input should be invalid', async () => {
    render(
      <RenderWithProviders>
        <AddBudgetItemForm token={'token'} />
      </RenderWithProviders>
    )

    const inputName = screen.getByLabelText(/name/i)

    act(() => {
      userEvent.type(inputName, 'qqqq')
      userEvent.clear(inputName)
    })

    expect(inputName).toBeInvalid()
  })

  test('Value input field should be valid.', async () => {
    render(
      <RenderWithProviders>
        <AddBudgetItemForm token={'token'} />
      </RenderWithProviders>
    )

    const inputValue = screen.getByLabelText(/value/i)

    act(() => {
      userEvent.type(inputValue, '123')
    })

    expect(inputValue).toBeInTheDocument()
    expect(inputValue).toBeValid()
  })

  test('Value input should be invalid', async () => {
    render(
      <RenderWithProviders>
        <AddBudgetItemForm token={'token'} />
      </RenderWithProviders>
    )

    const inputValue = screen.getByLabelText(/value/i)

    act(() => {
      userEvent.type(inputValue, '111')
      userEvent.clear(inputValue)
    })

    expect(inputValue).toBeInvalid()
  })

  test('Date input field should be current date.', async () => {
    render(
      <RenderWithProviders>
        <AddBudgetItemForm token={'token'} />
      </RenderWithProviders>
    )

    const inputDate = screen.getByLabelText(/date/i)

    expect(inputDate).toBeInTheDocument()
    expect(inputDate).toHaveValue(new Date().toISOString().split('T')[0])
  })

  test('Category input field should be valid.', async () => {
    render(
      <RenderWithProviders>
        <AddBudgetItemForm token={'token'} />
      </RenderWithProviders>
    )

    const inputCategory = screen.getByLabelText(/category/i)

    act(() => {
      userEvent.selectOptions(inputCategory, 'car')
    })

    expect(inputCategory).toBeInTheDocument()
    expect(inputCategory).toBeValid()
  })

  test('Category input should be invalid', async () => {
    render(
      <RenderWithProviders>
        <AddBudgetItemForm token={'token'} />
      </RenderWithProviders>
    )

    const inputCategory = screen.getByLabelText(/category/i)

    act(() => {
      userEvent.selectOptions(inputCategory, 'car')
      userEvent.selectOptions(inputCategory, 'Choose category')
    })

    expect(inputCategory).toBeInvalid()
  })

  test('All fields should be invalid after submit.', async () => {
    render(
      <RenderWithProviders>
        <AddBudgetItemForm token={'token'} />
      </RenderWithProviders>
    )

    const submitBtn = screen.getByRole('button', { name: /Create budget item/i })
    const inputName = screen.getByLabelText(/name/i)
    const inputValue = screen.getByLabelText(/value/i)
    const inputDate = screen.getByLabelText(/date/i)
    const inputCategory = screen.getByLabelText(/category/i)

    await act(() => {
      userEvent.click(submitBtn)
    })

    expect(inputName).toBeInvalid()
    expect(inputValue).toBeInvalid()
    expect(inputDate).toBeValid()
    expect(inputCategory).toBeInvalid()
    expect(screen.getAllByTestId('invalid-msg')).toHaveLength(3)
  })

  test('Name and value fields should be empty after submit.', async () => {
    render(
      <RenderWithProviders>
        <AddBudgetItemForm token={'token'} />
      </RenderWithProviders>
    )

    const submitBtn = screen.getByRole('button', { name: /Create budget item/i })
    const inputName = screen.getByLabelText(/name/i)
    const inputValue = screen.getByLabelText(/value/i)
    const inputDate = screen.getByLabelText(/date/i)
    const inputCategory = screen.getByLabelText(/category/i)

    act(() => {
      userEvent.type(inputName, 'fuel')
      userEvent.type(inputValue, '123')
      userEvent.selectOptions(inputCategory, 'car')
      userEvent.type(inputDate, '2023-01-01')
    })

    await act(() => {
      userEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(inputName).toHaveValue('')
    })

    expect(inputValue).toHaveValue(null)
    expect(inputDate).toHaveValue('2023-01-01')
    expect(inputCategory).toHaveValue('1')
  })

  test('The Loader should be displayed after submit and disappear.', async () => {
    render(
      <RenderWithProviders>
        <AddBudgetItemForm token={'token'} />
      </RenderWithProviders>
    )

    const submitBtn = screen.getByRole('button', { name: /Create budget item/i })
    const inputName = screen.getByLabelText(/name/i)
    const inputValue = screen.getByLabelText(/value/i)
    const inputDate = screen.getByLabelText(/date/i)
    const inputCategory = screen.getByLabelText(/category/i)

    act(() => {
      userEvent.type(inputName, 'fuel')
      userEvent.type(inputValue, '123')
      userEvent.selectOptions(inputCategory, 'car')
      userEvent.type(inputDate, '2023-01-01')
    })

    expect(inputDate).toBeValid()

    await act(() => {
      userEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(screen.getByTestId('loader')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    })
  })

  test('Check that data correctly send to the server.', async () => {
    store.dispatch(budgetItemActions.setBudgetItems([]))
    render(
      <RenderWithProviders>
        <AddBudgetItemForm token={'token'} />
      </RenderWithProviders>
    )

    const submitBtn = screen.getByRole('button', { name: /Create budget item/i })
    const inputName = screen.getByLabelText(/name/i)
    const inputValue = screen.getByLabelText(/value/i)
    const inputDate = screen.getByLabelText(/date/i)
    const inputCategory = screen.getByLabelText(/category/i)

    act(() => {
      userEvent.type(inputName, 'book')
      userEvent.type(inputValue, '100')
      userEvent.selectOptions(inputCategory, 'education')
      userEvent.type(inputDate, '2023-03-01')
    })

    expect(inputDate).toBeValid()

    await act(() => {
      userEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(store.getState().budgetItem.budgetItems).toHaveLength(6)
    })

    expect(store.getState().budgetItem.budgetItems[0].name).toBe('book')
    expect(store.getState().budgetItem.budgetItems[0].value).toBe(100)
    expect(store.getState().budgetItem.budgetItems[0].category.id).toBe(3)
    expect(store.getState().budgetItem.budgetItems[0].userDate).toBe('2023-03-01')
  })
})
