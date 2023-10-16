import { render, screen } from '@testing-library/react'
import DefaultTemplate from './DefaultTemplate'
import ErrorTemplate from './ErrorTemplate'
import { RenderWithProviders } from '../../utils/test-utils'

describe('Templates', () => {
  describe('DefaultTemplate', () => {
    test('Should render DefaultTemplate.', () => {
      render(
        <RenderWithProviders>
          <DefaultTemplate />
        </RenderWithProviders>
      )

      expect(screen.getByTestId('header')).toBeInTheDocument()
      expect(screen.getByTestId('main')).toBeInTheDocument()
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })
  })

  describe('ErrorTemplate', () => {
    test('Should render ErrorTemplate.', () => {
      render(
        <RenderWithProviders>
          <ErrorTemplate />
        </RenderWithProviders>
      )

      expect(screen.getByTestId('header')).toBeInTheDocument()
      expect(screen.getByTestId('main')).toBeInTheDocument()
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })
  })
})
