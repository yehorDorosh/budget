import SignupPage from './SignupPage'
import { render, screen } from '@testing-library/react'
import { RenderWithProviders } from '../../../utils/test-utils'
import { cleanup } from '@testing-library/react'

describe('SignupPage', () => {
  afterEach(() => {
    cleanup()
  })

  test('Should render SignupPage.', async () => {
    render(
      <RenderWithProviders>
        <SignupPage />
      </RenderWithProviders>
    )

    expect(screen.getByTestId('signup-form')).toBeInTheDocument()
  })
})
