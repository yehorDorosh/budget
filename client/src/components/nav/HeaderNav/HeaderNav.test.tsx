import HeaderNav from './HeaderNav'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { RenderWithProviders } from '../../../utils/test-utils'
import store from '../../../store'
import { userActions } from '../../../store/user/user-slice'

describe('HeaderNav', () => {
  const originalInnerWidth = global.innerWidth
  const originalInnerHeight = global.innerHeight

  afterEach(() => {
    cleanup()
    global.innerWidth = originalInnerWidth
    global.innerHeight = originalInnerHeight
  })

  afterAll(() => {
    cleanup()
  })

  test('Should call onClick event.', () => {
    const switchMenu = jest.fn()
    render(
      <RenderWithProviders>
        <HeaderNav isOpen={true} onClick={switchMenu} />
      </RenderWithProviders>
    )

    const nav = screen.getByTestId('header-nav')

    fireEvent.click(nav)

    expect(switchMenu).toHaveBeenCalledTimes(1)
  })

  test('Should change class if isOpen changed.', () => {
    let state = false
    const { rerender } = render(
      <RenderWithProviders>
        <HeaderNav isOpen={state} onClick={() => (state = !state)} />
      </RenderWithProviders>
    )

    const nav = screen.getByTestId('header-nav')

    expect(nav).toHaveClass('mb-closed')

    fireEvent.click(nav)

    rerender(
      <RenderWithProviders>
        <HeaderNav isOpen={state} onClick={() => (state = !state)} />
      </RenderWithProviders>
    )

    expect(nav).toHaveClass('open')
  })

  test('If user is not logged in, should render Sign Up and Log In links.', () => {
    store.dispatch(userActions.logout())

    render(
      <RenderWithProviders>
        <HeaderNav isOpen={true} onClick={() => {}} />
      </RenderWithProviders>
    )

    const signUpLink = screen.queryByText('Sign Up')
    const loginLink = screen.queryByText('Log In')
    const logoutButton = screen.queryByText('Log Out')
    const budgetLink = screen.queryByText('Budget')
    const categoriesLink = screen.queryByText('Categories')
    const weatherLink = screen.queryByText('Weather')
    const profileLink = screen.queryByText('Profile')

    expect(signUpLink).toBeInTheDocument()
    expect(loginLink).toBeInTheDocument()
    expect(logoutButton).not.toBeInTheDocument()
    expect(budgetLink).not.toBeInTheDocument()
    expect(categoriesLink).not.toBeInTheDocument()
    expect(weatherLink).not.toBeInTheDocument()
    expect(profileLink).not.toBeInTheDocument()
  })

  test('If user is logged in, should render Budget, Categories, Weather, Profile and Log Out links.', () => {
    store.dispatch(userActions.login())
    render(
      <RenderWithProviders>
        <HeaderNav isOpen={true} onClick={() => {}} />
      </RenderWithProviders>
    )

    const signUpLink = screen.queryByText('Sign Up')
    const loginLink = screen.queryByText('Log In')
    const logoutButton = screen.queryByText('Log Out')
    const budgetLink = screen.queryByText('Budget')
    const categoriesLink = screen.queryByText('Categories')
    const weatherLink = screen.queryByText('Weather')
    const profileLink = screen.queryByText('Profile')

    expect(signUpLink).not.toBeInTheDocument()
    expect(loginLink).not.toBeInTheDocument()
    expect(logoutButton).toBeInTheDocument()
    expect(budgetLink).toBeInTheDocument()
    expect(categoriesLink).toBeInTheDocument()
    expect(weatherLink).toBeInTheDocument()
    expect(profileLink).toBeInTheDocument()
  })

  test('Should redirect to main page after logout.', () => {
    const dispatch = jest.spyOn(store, 'dispatch')
    store.dispatch(userActions.login())
    render(
      <RenderWithProviders>
        <HeaderNav isOpen={true} onClick={() => {}} />
      </RenderWithProviders>
    )

    const logoutButton = screen.getByText('Log Out')

    fireEvent.click(logoutButton)

    expect(dispatch).toHaveBeenCalledWith(userActions.logout())
    dispatch.mockRestore()
    expect(window.location.pathname).toBe('/')
    expect(store.getState().user.isLogin).toBe(false)
  })

  test('Sign Up and Log In links should redirect to proper pages.', () => {
    store.dispatch(userActions.logout())
    render(
      <RenderWithProviders>
        <HeaderNav isOpen={true} onClick={() => {}} />
      </RenderWithProviders>
    )

    const signUpLink = screen.getByText('Sign Up')
    const loginLink = screen.getByText('Log In')

    fireEvent.click(signUpLink)
    expect(window.location.pathname).toBe('/signup')

    fireEvent.click(loginLink)
    expect(window.location.pathname).toBe('/login')
  })

  test('Budget, Categories, Weather and Profile links should redirect to proper pages.', () => {
    store.dispatch(userActions.login())
    render(
      <RenderWithProviders>
        <HeaderNav isOpen={true} onClick={() => {}} />
      </RenderWithProviders>
    )

    const budgetLink = screen.getByText('Budget')
    const categoriesLink = screen.getByText('Categories')
    const weatherLink = screen.getByText('Weather')
    const profileLink = screen.getByText('Profile')

    fireEvent.click(budgetLink)
    expect(window.location.pathname).toBe('/budget')

    fireEvent.click(categoriesLink)
    expect(window.location.pathname).toBe('/budget/categories')

    fireEvent.click(weatherLink)
    expect(window.location.pathname).toBe('/weather')

    fireEvent.click(profileLink)
    expect(window.location.pathname).toBe('/profile')
  })
})
