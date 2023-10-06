import DeleteUserForm from './DeleteUserForm'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { setupServer } from 'msw/node'
import { RenderWithProviders, handlers } from '../../../utils/test-utils'

describe('DeleteUserForm', () => {
  const server = setupServer(...handlers)

  beforeAll(() => {
    server.listen()
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

  test('Password input field should be vaild.', () => {
    render(
      <RenderWithProviders>
        <DeleteUserForm token="token" />
      </RenderWithProviders>
    )
    const inputPassword = screen.getByLabelText(/password/i)

    act(() => {
      userEvent.type(inputPassword, '123')
    })

    expect(inputPassword).toBeInTheDocument()
    expect(inputPassword).toBeValid()
  })

  test('Password input field should be invaild.', () => {
    render(
      <RenderWithProviders>
        <DeleteUserForm token="token" />
      </RenderWithProviders>
    )
    const inputPassword = screen.getByLabelText(/password/i)

    act(() => {
      userEvent.type(inputPassword, '123')
      userEvent.clear(inputPassword)
    })

    expect(inputPassword).toBeInTheDocument()
    expect(inputPassword).toBeInvalid()
  })

  test('Input should be invalid after submit.', async () => {
    render(
      <RenderWithProviders>
        <DeleteUserForm token="token" />
      </RenderWithProviders>
    )
    const inputPassword = screen.getByLabelText(/password/i)
    const submitBtn = screen.getByRole('button', { name: /delete user/i })

    await act(() => {
      userEvent.click(submitBtn)
    })

    expect(inputPassword).toBeInvalid()
  })

  test('Input should be valid after submit.', async () => {
    render(
      <RenderWithProviders>
        <DeleteUserForm token="token" />
      </RenderWithProviders>
    )
    const inputPassword = screen.getByLabelText(/password/i)
    const submitBtn = screen.getByRole('button', { name: /delete user/i })

    await act(() => {
      userEvent.type(inputPassword, '123')
      userEvent.click(submitBtn)
    })

    expect(inputPassword).toBeValid()
  })

  test('The loader should be displayed after submit and dissapear after data was sbumitted.', async () => {
    render(
      <RenderWithProviders>
        <DeleteUserForm token="token" />
      </RenderWithProviders>
    )
    const inputPassword = screen.getByLabelText(/password/i)
    const submitBtn = screen.getByRole('button', { name: /delete user/i })

    await act(() => {
      userEvent.type(inputPassword, '123')
      userEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(screen.getByTestId('loader')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    })
  })

  test('Should display error message if password is incorrect.', async () => {
    render(
      <RenderWithProviders>
        <DeleteUserForm token="token" />
      </RenderWithProviders>
    )
    const inputPassword = screen.getByLabelText(/password/i)
    const submitBtn = screen.getByRole('button', { name: /delete user/i })

    await act(() => {
      userEvent.type(inputPassword, 'abc')
      userEvent.click(submitBtn)
    })

    await waitFor(() => {
      expect(screen.getByText(/Wrong password!/i)).toBeInTheDocument()
    })
  })
})
