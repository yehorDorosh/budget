import AddCategoryForm from './AddCategoryForm'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { setupServer } from 'msw/node'
import { RenderWithProviders, handlers } from '../../../utils/test-utils'
import store from '../../../store'
import { categoriesActions } from '../../../store/categories/categories-slice'

describe('AddCategoryForm', () => {
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
        <AddCategoryForm token={'token'} />
      </RenderWithProviders>
    )

    const inputName = screen.getByLabelText(/Category name/i)

    act(() => {
      userEvent.type(inputName, 'car')
    })

    expect(inputName).toBeInTheDocument()
    expect(inputName).toBeValid()
  })

  test('Category name input should be invalid', async () => {
    render(
      <RenderWithProviders>
        <AddCategoryForm token={'token'} />
      </RenderWithProviders>
    )

    const inputName = screen.getByLabelText(/Category name/i)

    act(() => {
      userEvent.type(inputName, 'qqqq')
      userEvent.clear(inputName)
    })

    expect(inputName).toBeInvalid()
  })

  test('Category name field should be invalid after submit.', async () => {
    render(
      <RenderWithProviders>
        <AddCategoryForm token={'token'} />
      </RenderWithProviders>
    )

    const submitBtn = screen.getByRole('button', { name: /Create category/i })
    const inputName = screen.getByLabelText(/Category name/i)

    await act(() => {
      userEvent.click(submitBtn)
    })

    expect(inputName).toBeInvalid()
    expect(screen.getAllByTestId('invalid-msg')).toHaveLength(1)
  })

  test('Category name field should be empty after submit.', async () => {
    render(
      <RenderWithProviders>
        <AddCategoryForm token={'token'} />
      </RenderWithProviders>
    )

    const submitBtn = screen.getByRole('button', { name: /Create category/i })
    const inputName = screen.getByLabelText(/Category name/i)

    act(() => {
      userEvent.type(inputName, 'car')
    })

    await act(() => {
      userEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(inputName).toHaveValue('')
    })
  })

  test('The Loader should be displayed after submit and disappear.', async () => {
    render(
      <RenderWithProviders>
        <AddCategoryForm token={'token'} />
      </RenderWithProviders>
    )

    const submitBtn = screen.getByRole('button', { name: /Create category/i })
    const inputName = screen.getByLabelText(/Category name/i)

    act(() => {
      userEvent.type(inputName, 'car')
    })

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
    store.dispatch(categoriesActions.setCategories([]))
    render(
      <RenderWithProviders>
        <AddCategoryForm token={'token'} />
      </RenderWithProviders>
    )

    const submitBtn = screen.getByRole('button', { name: /Create category/i })
    const inputName = screen.getByLabelText(/Category name/i)
    const inputType = screen.getByRole('radio', { name: /Log type Income/i })

    act(() => {
      userEvent.type(inputName, 'salary')
      userEvent.click(inputType)
    })

    await act(() => {
      userEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(store.getState().categories.categories).toHaveLength(1)
    })
    expect(store.getState().categories.categories[0].name).toBe('salary')
    expect(store.getState().categories.categories[0].categoryType).toBe('income')
  })
})
