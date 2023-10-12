import ListItem from './CategoryItem'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { setupServer } from 'msw/node'
import { RenderWithProviders, handlers } from '../../../utils/test-utils'
import { CategoryType } from '../../../types/enum'
import store from '../../../store'
import { categoriesActions } from '../../../store/categories/categories-slice'

describe('CategoryListItem', () => {
  const server = setupServer(...handlers)

  beforeAll(() => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('id', 'modal-root')
    document.body.appendChild(portalRoot)
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

  test('Should render Category item component.', async () => {
    render(
      <RenderWithProviders>
        <ListItem id={1} value="car" categoryType={CategoryType.EXPENSE} token="token" />
      </RenderWithProviders>
    )

    expect(screen.getByText(/car/i)).toBeInTheDocument()
    expect(screen.getByText(/expense/i)).toBeInTheDocument()
  })

  test('Should open modal window.', async () => {
    render(
      <RenderWithProviders>
        <ListItem id={1} value="car" categoryType={CategoryType.EXPENSE} token="token" />
      </RenderWithProviders>
    )

    const editBtn = screen.getByText(/edit/i)

    act(() => {
      userEvent.click(editBtn)
    })

    expect(screen.getByTestId('update-category-from')).toBeInTheDocument()
  })

  test('Should close modal window.', async () => {
    render(
      <RenderWithProviders>
        <ListItem id={1} value="car" categoryType={CategoryType.EXPENSE} token="token" />
      </RenderWithProviders>
    )

    const editBtn = screen.getByText(/edit/i)

    act(() => {
      userEvent.click(editBtn)
    })

    expect(screen.getByTestId('update-category-from')).toBeInTheDocument()

    const closeBtn = screen.getByTestId('close-btn')

    act(() => {
      userEvent.click(closeBtn)
    })

    expect(screen.queryByTestId('update-category-from')).not.toBeInTheDocument()
  })

  test('Should close modal window after submit', async () => {
    render(
      <RenderWithProviders>
        <ListItem id={1} value="car" categoryType={CategoryType.EXPENSE} token="token" />
      </RenderWithProviders>
    )

    const editBtn = screen.getByText(/edit/i)

    act(() => {
      userEvent.click(editBtn)
    })

    expect(screen.getByTestId('update-category-from')).toBeInTheDocument()

    const closeBtn = screen.getByRole('button', { name: /save/i })

    await act(() => {
      userEvent.click(closeBtn)
    })

    await waitFor(() => {
      expect(screen.queryByTestId('update-category-from')).not.toBeInTheDocument()
    })
  })

  test('Should delete item', async () => {
    store.dispatch(categoriesActions.setCategories([]))
    const mockDispatch = jest.spyOn(store, 'dispatch')

    render(
      <RenderWithProviders>
        <ListItem id={2} value="car" categoryType={CategoryType.EXPENSE} token="token" />
      </RenderWithProviders>
    )

    const deleteBtn = screen.getByText(/delete/i)

    await act(() => {
      userEvent.click(deleteBtn)
    })

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function))
    })

    await waitFor(() => {
      expect(store.getState().categories.categories).toHaveLength(1)
    })

    expect(store.getState().categories.categories[0].id).toBe('2')
  })

  test('Should has class text-bg-dark for expense item', async () => {
    render(
      <RenderWithProviders>
        <ListItem id={1} value="car" categoryType={CategoryType.EXPENSE} token="token" />
      </RenderWithProviders>
    )

    expect(screen.getByTestId('category-item')).toHaveClass('text-bg-dark')
  })

  test('Should has class text-bg-success for income item', async () => {
    render(
      <RenderWithProviders>
        <ListItem id={1} value="car" categoryType={CategoryType.INCOME} token="token" />
      </RenderWithProviders>
    )

    expect(screen.getByTestId('category-item')).toHaveClass('text-bg-success')
  })
})
