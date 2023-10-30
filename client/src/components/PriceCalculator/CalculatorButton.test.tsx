import CalculatorButton from './CalculatorButton'
import { render, screen } from '@testing-library/react'
import { RenderWithProviders } from '../../utils/test-utils'

import userEvent from '@testing-library/user-event'

describe('CalculatorButton', () => {
  test('Should render button label.', () => {
    render(
      <RenderWithProviders>
        <CalculatorButton btnTxt="test" onClick={() => {}} />
      </RenderWithProviders>
    )

    const btn = screen.queryByRole('button', { name: /test/i })

    expect(btn).toBeInTheDocument()
  })

  test('Should change class name if className prop is passed.', () => {
    render(
      <RenderWithProviders>
        <CalculatorButton btnTxt="test" onClick={() => {}} className="test" />
      </RenderWithProviders>
    )

    const btn = screen.queryByRole('button', { name: /test/i })

    expect(btn).toHaveClass('test')
  })

  test('Should call onClick handler when button is clicked.', () => {
    const onClick = jest.fn()

    render(
      <RenderWithProviders>
        <CalculatorButton btnTxt="test" onClick={onClick} />
      </RenderWithProviders>
    )

    const btn = screen.getByRole('button', { name: /test/i })

    userEvent.click(btn)

    expect(onClick).toBeCalledTimes(1)
  })
})
