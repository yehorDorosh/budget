import UpdateCategoryForm from './UpdateCategoryForm'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { setupServer } from 'msw/node'
import { RenderWithProviders, handlers } from '../../../utils/test-utils'
import store from '../../../store'
import { CategoryType } from '../../../types/enum'

describe('UpdateCategoryForm', () => {
  const server = setupServer(...handlers)

  beforeAll(() => {
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

  test('Category name input field should be valid.', async () => {
    render(
      <RenderWithProviders>
        <UpdateCategoryForm id={1} defaultName="car" defaultCategoryType={CategoryType.EXPENSE} token={'token'} onSave={() => {}} />
      </RenderWithProviders>
    )

    const inputName = screen.getByLabelText(/Category name/i)

    act(() => {
      userEvent.clear(inputName)
      userEvent.type(inputName, 'Car')
    })

    expect(inputName).toBeInTheDocument()
    expect(inputName).toBeValid()
  })

  test('Category name input should be invalid', async () => {
    render(
      <RenderWithProviders>
        <UpdateCategoryForm id={1} defaultName="car" defaultCategoryType={CategoryType.EXPENSE} token={'token'} onSave={() => {}} />
      </RenderWithProviders>
    )

    const inputName = screen.getByLabelText(/Category name/i)

    act(() => {
      userEvent.type(inputName, 'qqqq')
      userEvent.clear(inputName)
    })

    expect(inputName).toBeInvalid()
  })

  test('All fields should be invalid after submit.', async () => {
    render(
      <RenderWithProviders>
        <UpdateCategoryForm id={1} defaultName="car" defaultCategoryType={CategoryType.EXPENSE} token={'token'} onSave={() => {}} />
      </RenderWithProviders>
    )

    const submitBtn = screen.getByRole('button', { name: /save/i })
    const inputName = screen.getByLabelText(/Category name/i)

    act(() => {
      userEvent.clear(inputName)
    })

    await act(() => {
      userEvent.click(submitBtn)
    })

    expect(inputName).toBeInvalid()
    expect(screen.getAllByTestId('invalid-msg')).toHaveLength(1)
  })

  test('The Loader should be displayed after submit and disappear.', async () => {
    render(
      <RenderWithProviders>
        <UpdateCategoryForm id={1} defaultName="car" defaultCategoryType={CategoryType.EXPENSE} token={'token'} onSave={() => {}} />
      </RenderWithProviders>
    )

    const submitBtn = screen.getByRole('button', { name: /save/i })

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
        <UpdateCategoryForm id={1} defaultName="car" defaultCategoryType={CategoryType.EXPENSE} token={'token'} onSave={() => {}} />
      </RenderWithProviders>
    )

    expect(screen.getByLabelText(/Category name/i)).toHaveValue('car')
    expect(screen.getByLabelText(/log type expense/i)).toBeChecked()
  })

  test('On save should be called.', async () => {
    const eventHandler = jest.fn()
    render(
      <RenderWithProviders>
        <UpdateCategoryForm id={1} defaultName="car" defaultCategoryType={CategoryType.EXPENSE} token={'token'} onSave={eventHandler} />
      </RenderWithProviders>
    )

    await act(() => {
      userEvent.click(screen.getByRole('button', { name: /save/i }))
    })

    await waitFor(() => {
      expect(eventHandler).toBeCalledTimes(1)
    })
  })

  test('Check that data correctly send to the server.', async () => {
    render(
      <RenderWithProviders>
        <UpdateCategoryForm id={11} defaultName="car" defaultCategoryType={CategoryType.EXPENSE} token={'token'} onSave={() => {}} />
      </RenderWithProviders>
    )

    const submitBtn = screen.getByRole('button', { name: /save/i })
    const inputName = screen.getByLabelText(/category name/i)
    const inputCategoryType = screen.getByLabelText(/log type income/i)

    act(() => {
      userEvent.clear(inputName)
      userEvent.type(inputName, 'alcohol')
      userEvent.click(inputCategoryType)
    })

    await act(() => {
      userEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(store.getState().categories.categories[0].name).toBe('alcohol')
    })
    expect(store.getState().categories.categories[0].categoryType).toBe('income')
    expect(store.getState().categories.categories[0].id).toBe(11)
  })
})
