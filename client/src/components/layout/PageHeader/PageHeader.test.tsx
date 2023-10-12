import PageHeader from './PageHeader'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { RenderWithProviders } from '../../../utils/test-utils'
import { act } from 'react-dom/test-utils'

describe('PageHeader', () => {
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

  test('Should render site logo, site navigation and burger.', () => {
    render(
      <RenderWithProviders>
        <PageHeader />
      </RenderWithProviders>
    )

    const logoLink = screen.getByTestId('logo')
    const navBurger = screen.getByTestId('burger')
    const nav = screen.getByTestId('header-nav')

    expect(logoLink).toBeInTheDocument()
    expect(navBurger).toBeInTheDocument()
    expect(nav).toBeInTheDocument()
  })

  test('Logo image should lead to main page.', async () => {
    render(
      <RenderWithProviders>
        <PageHeader />
      </RenderWithProviders>
    )

    const logoImage = screen.getByAltText('site logo')

    expect(logoImage).toBeInTheDocument()
    expect(logoImage).toHaveAttribute('src', '/logo192.png')

    const logoLink = screen.getByTestId('logo')

    fireEvent.click(logoLink)

    expect(window.location.pathname).toBe('/')
  })

  test('Nav should open and close on burger click.', async () => {
    global.innerWidth = 375
    global.innerHeight = 667
    act(() => {
      render(
        <RenderWithProviders>
          <PageHeader />
        </RenderWithProviders>
      )
    })

    const navBurger = screen.getByTestId('burger')
    const nav = screen.getByTestId('header-nav')

    expect(nav).toHaveClass('mb-closed')

    fireEvent.click(navBurger)

    expect(nav).not.toHaveClass('mb-closed')

    fireEvent.click(navBurger)

    expect(nav).toHaveClass('mb-closed')

    fireEvent.click(navBurger)

    expect(nav).not.toHaveClass('mb-closed')

    fireEvent.click(nav)

    expect(nav).toHaveClass('mb-closed')
  })
})
