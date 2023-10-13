import ProfilePage from './ProfilePage'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { RenderWithProviders } from '../../../utils/test-utils'
import store from '../../../store'
import { userActions } from '../../../store/user/user-slice'

describe('ProfilePage', () => {
  beforeAll(() => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('id', 'modal-root')
    document.body.appendChild(portalRoot)
    store.dispatch(userActions.setUserData({ token: 'test', id: 1, email: 'user@email.com', autoLogoutTimer: null }))
    store.dispatch(userActions.login())
  })

  afterEach(() => {
    cleanup()
  })

  afterAll(() => {
    cleanup()
  })

  test('Should render Profile Page.', async () => {
    render(
      <RenderWithProviders>
        <ProfilePage />
      </RenderWithProviders>
    )

    const title = screen.queryByText('Profile')

    expect(title).toBeInTheDocument()
    expect(screen.getByText('email: user@email.com')).toBeInTheDocument()
  })

  test('Change email button should open change credential form.', async () => {
    render(
      <RenderWithProviders>
        <ProfilePage />
      </RenderWithProviders>
    )

    const changeEmailBtn = screen.getByText('Change email')

    fireEvent.click(changeEmailBtn)

    const changeEmailForm = screen.queryByTestId('change-credential-form')

    expect(changeEmailForm).toBeInTheDocument()

    fireEvent.click(changeEmailBtn)

    expect(changeEmailForm).not.toBeInTheDocument()
  })

  test('Change password button should open change credential form.', async () => {
    render(
      <RenderWithProviders>
        <ProfilePage />
      </RenderWithProviders>
    )

    const changePasswordBtn = screen.getByText('Change password')

    fireEvent.click(changePasswordBtn)

    const changePasswordForm = screen.queryByTestId('change-credential-form')

    expect(changePasswordForm).toBeInTheDocument()

    fireEvent.click(changePasswordBtn)

    expect(changePasswordForm).not.toBeInTheDocument()
  })

  test('Delete user button should open delete user form.', async () => {
    render(
      <RenderWithProviders>
        <ProfilePage />
      </RenderWithProviders>
    )

    const deleteUserBtn = screen.getByText('Delete user')

    fireEvent.click(deleteUserBtn)

    const deleteUserForm = screen.queryByTestId('delete-user-form')

    expect(deleteUserForm).toBeInTheDocument()

    fireEvent.click(deleteUserBtn)

    expect(deleteUserForm).not.toBeInTheDocument()
  })

  test('Each button should open only one form.', async () => {
    render(
      <RenderWithProviders>
        <ProfilePage />
      </RenderWithProviders>
    )

    const changeEmailBtn = screen.getByText('Change email')
    const changePasswordBtn = screen.getByText('Change password')
    const deleteUserBtn = screen.getByText('Delete user')

    fireEvent.click(changeEmailBtn)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument()
    expect(screen.queryByTestId('delete-user-form')).not.toBeInTheDocument()

    fireEvent.click(changePasswordBtn)
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.queryByLabelText('Email')).not.toBeInTheDocument()
    expect(screen.queryByTestId('delete-user-form')).not.toBeInTheDocument()

    fireEvent.click(deleteUserBtn)
    expect(screen.getByTestId('delete-user-form')).toBeInTheDocument()
    expect(screen.queryByTestId('change-credential-form')).not.toBeInTheDocument()

    fireEvent.click(changeEmailBtn)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument()
    expect(screen.queryByTestId('delete-user-form')).not.toBeInTheDocument()
  })
})
