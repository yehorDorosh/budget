import LoginPage from './LoginPage'
import { render, screen, cleanup } from '@testing-library/react'
import { RenderWithProviders } from '../../../utils/test-utils'

describe('LoginPage', () => {
  afterEach(() => {
    cleanup()
  })

  test('Should render Login Page.', async () => {
    render(
      <RenderWithProviders>
        <LoginPage />
      </RenderWithProviders>
    )

    expect(screen.getByTestId('login-form')).toBeInTheDocument()
  })
})
