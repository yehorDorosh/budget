import AddBudgetItemForm from './AddBudgetItemForm'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { setupServer } from 'msw/node'
import { RenderWithProviders, handlers } from '../../../utils/test-utils'
import store from '../../../store'
import { categoriesActions } from '../../../store/categories/categories-slice'
import { CategoryType } from '../../../types/enum'
import * as budgetItemActions from '../../../store/budget/budget-item-actions'

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
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('id', 'modal-root')
    document.body.appendChild(portalRoot)
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
    const addBudgetItem = jest.spyOn(budgetItemActions, 'addBudgetItem')
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
      expect(addBudgetItem).toBeCalledTimes(1)
    })

    expect(addBudgetItem).toBeCalledWith({
      categoryId: 3,
      name: 'book',
      token: 'token',
      userDate: 'Wed Mar 01 2023',
      value: 100
    })
  })

  test('Check data list.', async () => {
    render(
      <RenderWithProviders>
        <AddBudgetItemForm token={'token'} />
      </RenderWithProviders>
    )

    const inputName = screen.getByLabelText(/name/i)

    act(() => {
      userEvent.type(inputName, 'b')
    })

    await waitFor(() => {
      expect(screen.getAllByTestId('data-list-option')[0]).toHaveAttribute('value', 'fuel')
    })

    expect(screen.getAllByTestId('data-list-option')[1]).toHaveAttribute('value', 'beer')
    expect(screen.getAllByTestId('data-list-option')[2]).toHaveAttribute('value', 'book')
  })

  test('Should render Calc btn.', async () => {
    render(
      <RenderWithProviders>
        <AddBudgetItemForm token={'token'} />
      </RenderWithProviders>
    )

    expect(screen.getByText(/calc/i)).toBeInTheDocument()
  })

  test('Should open Calc modal.', async () => {
    render(
      <RenderWithProviders>
        <AddBudgetItemForm token={'token'} />
      </RenderWithProviders>
    )

    act(() => {
      userEvent.click(screen.getByText(/calc/i))
    })

    expect(screen.getByTestId('modal')).toBeInTheDocument()
    expect(screen.getByTestId('modal')).toHaveTextContent('Set value')
    expect(screen.getByTestId('expression')).toHaveTextContent('0')
    expect(screen.getByTestId('result')).toHaveTextContent('0')
  })

  test('Should close Calc modal.', async () => {
    render(
      <RenderWithProviders>
        <AddBudgetItemForm token={'token'} />
      </RenderWithProviders>
    )

    act(() => {
      userEvent.click(screen.getByText(/calc/i))
    })

    expect(screen.getByTestId('modal')).toHaveTextContent('Set value')

    act(() => {
      userEvent.click(screen.getByTestId('close-btn'))
    })

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  test('Should calculate expression.', async () => {
    render(
      <RenderWithProviders>
        <AddBudgetItemForm token={'token'} />
      </RenderWithProviders>
    )

    act(() => {
      userEvent.click(screen.getByText(/calc/i))
    })

    expect(screen.getByTestId('modal')).toBeInTheDocument()

    act(() => {
      userEvent.click(screen.getByRole('button', { name: '2' }))
      userEvent.click(screen.getByRole('button', { name: '+' }))
      userEvent.click(screen.getByRole('button', { name: '2' }))
    })

    expect(screen.getByTestId('expression')).toHaveTextContent('2+2')
    expect(screen.getByTestId('result')).toHaveTextContent('4')
  })

  test('Should dispatch calc result to value input and close modal.', async () => {
    render(
      <RenderWithProviders>
        <AddBudgetItemForm token={'token'} />
      </RenderWithProviders>
    )

    act(() => {
      userEvent.click(screen.getByText(/calc/i))
    })

    expect(screen.getByTestId('modal')).toBeInTheDocument()

    act(() => {
      userEvent.click(screen.getByRole('button', { name: '2' }))
      userEvent.click(screen.getByRole('button', { name: '+' }))
      userEvent.click(screen.getByRole('button', { name: '2' }))
    })

    expect(screen.getByTestId('expression')).toHaveTextContent('2+2')
    expect(screen.getByTestId('result')).toHaveTextContent('4')

    act(() => {
      userEvent.click(screen.getByRole('button', { name: '=' }))
    })

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
    expect(screen.getByLabelText(/value/i)).toHaveValue(4)
  })
})
