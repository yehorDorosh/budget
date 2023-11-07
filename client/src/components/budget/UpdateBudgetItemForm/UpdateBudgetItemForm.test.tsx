import UpdateBudgetItemForm from './UpdateBudgetItemForm'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { setupServer } from 'msw/node'
import { RenderWithProviders, handlers, mockedBudgetItems } from '../../../utils/test-utils'
import store from '../../../store'
import { categoriesActions } from '../../../store/categories/categories-slice'
import { CategoryType } from '../../../types/enum'
import * as budgetItemActions from '../../../store/budget/budget-item-actions'

describe('UpdateBudgetItemForm', () => {
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
        <UpdateBudgetItemForm token={'token'} currentBudgetItem={mockedBudgetItems[0]} onSave={() => {}} />
      </RenderWithProviders>
    )

    const inputName = screen.getByLabelText(/name/i)

    act(() => {
      userEvent.clear(inputName)
      userEvent.type(inputName, 'fuel')
    })

    expect(inputName).toBeInTheDocument()
    expect(inputName).toBeValid()
  })

  test('Name input should be invalid', async () => {
    render(
      <RenderWithProviders>
        <UpdateBudgetItemForm token={'token'} currentBudgetItem={mockedBudgetItems[0]} onSave={() => {}} />
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
        <UpdateBudgetItemForm token={'token'} currentBudgetItem={mockedBudgetItems[0]} onSave={() => {}} />
      </RenderWithProviders>
    )

    const inputValue = screen.getByLabelText(/value/i)

    act(() => {
      userEvent.clear(inputValue)
      userEvent.type(inputValue, '123')
    })

    expect(inputValue).toBeInTheDocument()
    expect(inputValue).toBeValid()
  })

  test('Value input should be invalid', async () => {
    render(
      <RenderWithProviders>
        <UpdateBudgetItemForm token={'token'} currentBudgetItem={mockedBudgetItems[0]} onSave={() => {}} />
      </RenderWithProviders>
    )

    const inputValue = screen.getByLabelText(/value/i)

    act(() => {
      userEvent.type(inputValue, '111')
      userEvent.clear(inputValue)
    })

    expect(inputValue).toBeInvalid()
  })

  test('Date input field should be 2023-01-01.', async () => {
    render(
      <RenderWithProviders>
        <UpdateBudgetItemForm token={'token'} currentBudgetItem={mockedBudgetItems[0]} onSave={() => {}} />
      </RenderWithProviders>
    )

    const inputDate = screen.getByLabelText(/date/i)

    expect(inputDate).toBeInTheDocument()
    expect(inputDate).toHaveValue('2023-01-01')
  })

  test('Category input field should be valid.', async () => {
    render(
      <RenderWithProviders>
        <UpdateBudgetItemForm token={'token'} currentBudgetItem={mockedBudgetItems[0]} onSave={() => {}} />
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
        <UpdateBudgetItemForm token={'token'} currentBudgetItem={mockedBudgetItems[0]} onSave={() => {}} />
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
        <UpdateBudgetItemForm token={'token'} currentBudgetItem={mockedBudgetItems[0]} onSave={() => {}} />
      </RenderWithProviders>
    )

    const submitBtn = screen.getByRole('button', { name: /Save budget item/i })
    const inputName = screen.getByLabelText(/name/i)
    const inputValue = screen.getByLabelText(/value/i)
    const inputDate = screen.getByLabelText(/date/i)
    const inputCategory = screen.getByLabelText(/category/i)

    act(() => {
      userEvent.clear(inputName)
      userEvent.clear(inputValue)
      userEvent.clear(inputDate)
      userEvent.selectOptions(inputCategory, 'Choose category')
    })

    await act(() => {
      userEvent.click(submitBtn)
    })

    expect(inputName).toBeInvalid()
    expect(inputValue).toBeInvalid()
    expect(inputDate).toBeInvalid()
    expect(inputCategory).toBeInvalid()
    expect(screen.getAllByTestId('invalid-msg')).toHaveLength(4)
  })

  test('The Loader should be displayed after submit and disappear.', async () => {
    render(
      <RenderWithProviders>
        <UpdateBudgetItemForm token={'token'} currentBudgetItem={mockedBudgetItems[0]} onSave={() => {}} />
      </RenderWithProviders>
    )

    const submitBtn = screen.getByRole('button', { name: /Save budget item/i })

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

  test('All fields should contain current state', async () => {
    render(
      <RenderWithProviders>
        <UpdateBudgetItemForm token={'token'} currentBudgetItem={mockedBudgetItems[0]} onSave={() => {}} />
      </RenderWithProviders>
    )

    expect(screen.getByLabelText(/name/i)).toHaveValue('fuel')
    expect(screen.getByLabelText(/value/i)).toHaveValue(10)
    expect(screen.getByLabelText(/date/i)).toHaveValue('2023-01-01')
    expect(screen.getByLabelText(/category/i)).toHaveValue('1')
    expect(screen.getByLabelText(/ignore/i)).not.toBeChecked()
    expect(screen.getByLabelText(/log type expense/i)).toBeChecked()
  })

  test('On save should be called.', async () => {
    const eventHandler = jest.fn()
    render(
      <RenderWithProviders>
        <UpdateBudgetItemForm token={'token'} currentBudgetItem={mockedBudgetItems[0]} onSave={eventHandler} />
      </RenderWithProviders>
    )

    await act(() => {
      userEvent.click(screen.getByRole('button', { name: /Save budget item/i }))
    })

    await waitFor(() => {
      expect(eventHandler).toBeCalledTimes(1)
    })

    expect(eventHandler).toBeCalledWith(mockedBudgetItems[0])
  })

  test('Check that data correctly send to the server.', async () => {
    const updateBudgetItem = jest.spyOn(budgetItemActions, 'updateBudgetItem')

    render(
      <RenderWithProviders>
        <UpdateBudgetItemForm token={'token'} currentBudgetItem={mockedBudgetItems[0]} onSave={() => {}} />
      </RenderWithProviders>
    )

    const submitBtn = screen.getByRole('button', { name: /Save budget item/i })
    const inputName = screen.getByLabelText(/name/i)
    const inputValue = screen.getByLabelText(/value/i)
    const inputDate = screen.getByLabelText(/date/i)
    const inputCategory = screen.getByLabelText(/category/i)

    act(() => {
      userEvent.clear(inputName)
      userEvent.type(inputName, 'book')
      userEvent.clear(inputValue)
      userEvent.type(inputValue, '100')
      userEvent.selectOptions(inputCategory, 'education')
      userEvent.clear(inputDate)
      userEvent.type(inputDate, '2023-03-01')
    })

    await act(() => {
      userEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(updateBudgetItem).toBeCalledTimes(1)
    })

    expect(updateBudgetItem).toBeCalledWith({
      categoryId: 3,
      id: 1,
      ignore: false,
      name: 'book',
      token: 'token',
      userDate: new Date('2023-03-01').toISOString(),
      value: 100
    })
  })
})
