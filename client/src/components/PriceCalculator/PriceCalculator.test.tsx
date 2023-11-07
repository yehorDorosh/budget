import PriceCalculator from './PriceCalculator'
import { render, screen } from '@testing-library/react'
import { RenderWithProviders } from '../../utils/test-utils'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'

describe('PriceCalculator', () => {
  test('Should render Price Calculator.', async () => {
    render(
      <RenderWithProviders>
        <PriceCalculator onPressEqual={() => {}} />
      </RenderWithProviders>
    )

    expect(screen.getByText('Calculator')).toBeInTheDocument()
    expect(screen.getByText('Preview')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '+/-' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /c/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '<-' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '/' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '*' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '=' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '.' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '0' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '8' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '9' })).toBeInTheDocument()
  })

  test('Should render expression and result.', async () => {
    render(
      <RenderWithProviders>
        <PriceCalculator onPressEqual={() => {}} />
      </RenderWithProviders>
    )

    const expression = screen.getByTestId('expression')
    const result = screen.getByTestId('result')

    expect(expression).toHaveTextContent('0')
    expect(result).toHaveTextContent('0')
  })

  test('Should calc 2 + 2 = 4', async () => {
    render(
      <RenderWithProviders>
        <PriceCalculator onPressEqual={() => {}} />
      </RenderWithProviders>
    )

    act(() => {
      userEvent.click(screen.getByRole('button', { name: '2' }))
      userEvent.click(screen.getByRole('button', { name: '+' }))
      userEvent.click(screen.getByRole('button', { name: '2' }))
    })

    expect(screen.getByTestId('expression')).toHaveTextContent('2+2')
    expect(screen.getByTestId('result')).toHaveTextContent('4')
  })

  test('Should calc 0.3 - 0.1 = 0.2', async () => {
    render(
      <RenderWithProviders>
        <PriceCalculator onPressEqual={() => {}} />
      </RenderWithProviders>
    )

    act(() => {
      userEvent.click(screen.getByRole('button', { name: '0' }))
      userEvent.click(screen.getByRole('button', { name: '.' }))
      userEvent.click(screen.getByRole('button', { name: '3' }))
      userEvent.click(screen.getByRole('button', { name: '-' }))
      userEvent.click(screen.getByRole('button', { name: '0' }))
      userEvent.click(screen.getByRole('button', { name: '.' }))
      userEvent.click(screen.getByRole('button', { name: '1' }))
    })

    expect(screen.getByTestId('expression')).toHaveTextContent('0.3-0.1')
    expect(screen.getByTestId('result')).toHaveTextContent('0.2')
  })

  test('The backspace button should remove the last char from the expression.', async () => {
    render(
      <RenderWithProviders>
        <PriceCalculator onPressEqual={() => {}} />
      </RenderWithProviders>
    )

    act(() => {
      userEvent.click(screen.getByRole('button', { name: '2' }))
      userEvent.click(screen.getByRole('button', { name: '+' }))
      userEvent.click(screen.getByRole('button', { name: '2' }))
      userEvent.click(screen.getByRole('button', { name: '<-' }))
    })

    expect(screen.getByTestId('expression')).toHaveTextContent('2+')
    expect(screen.getByTestId('result')).toHaveTextContent('0')
  })

  test('If the backspace remove last char return 0.', () => {
    render(
      <RenderWithProviders>
        <PriceCalculator onPressEqual={() => {}} />
      </RenderWithProviders>
    )

    act(() => {
      userEvent.click(screen.getByRole('button', { name: '<-' }))
    })

    expect(screen.getByTestId('expression')).toHaveTextContent('0')
    expect(screen.getByTestId('result')).toHaveTextContent('0')
  })

  test('The C button should clear the expression and result.', async () => {
    render(
      <RenderWithProviders>
        <PriceCalculator onPressEqual={() => {}} />
      </RenderWithProviders>
    )

    act(() => {
      userEvent.click(screen.getByRole('button', { name: '2' }))
      userEvent.click(screen.getByRole('button', { name: '+' }))
      userEvent.click(screen.getByRole('button', { name: '2' }))
      userEvent.click(screen.getByRole('button', { name: 'c' }))
    })

    expect(screen.getByTestId('expression')).toHaveTextContent('0')
    expect(screen.getByTestId('result')).toHaveTextContent('0')
  })

  test('The expression should render 123', async () => {
    render(
      <RenderWithProviders>
        <PriceCalculator onPressEqual={() => {}} />
      </RenderWithProviders>
    )

    act(() => {
      userEvent.click(screen.getByRole('button', { name: '1' }))
      userEvent.click(screen.getByRole('button', { name: '2' }))
      userEvent.click(screen.getByRole('button', { name: '3' }))
    })

    expect(screen.getByTestId('expression')).toHaveTextContent('123')
    expect(screen.getByTestId('result')).toHaveTextContent('0')
  })

  test('If the expression started form -, should return negative result.', async () => {
    render(
      <RenderWithProviders>
        <PriceCalculator onPressEqual={() => {}} />
      </RenderWithProviders>
    )

    act(() => {
      userEvent.click(screen.getByRole('button', { name: '-' }))
      userEvent.click(screen.getByRole('button', { name: '1' }))
      userEvent.click(screen.getByRole('button', { name: '2' }))
      userEvent.click(screen.getByRole('button', { name: '3' }))
    })

    expect(screen.getByTestId('expression')).toHaveTextContent('-123')
    expect(screen.getByTestId('result')).toHaveTextContent('-123')
  })

  test('If expression started from +, should return same expression.', async () => {
    render(
      <RenderWithProviders>
        <PriceCalculator onPressEqual={() => {}} />
      </RenderWithProviders>
    )

    act(() => {
      userEvent.click(screen.getByRole('button', { name: '+' }))
      userEvent.click(screen.getByRole('button', { name: '1' }))
      userEvent.click(screen.getByRole('button', { name: '2' }))
      userEvent.click(screen.getByRole('button', { name: '3' }))
    })

    expect(screen.getByTestId('expression')).toHaveTextContent('123')
    expect(screen.getByTestId('result')).toHaveTextContent('0')
  })

  test('Should prevent double operators.', async () => {
    render(
      <RenderWithProviders>
        <PriceCalculator onPressEqual={() => {}} />
      </RenderWithProviders>
    )
    act(() => {
      userEvent.click(screen.getByRole('button', { name: '1' }))
      userEvent.click(screen.getByRole('button', { name: '+' }))
      userEvent.click(screen.getByRole('button', { name: '+' }))
      userEvent.click(screen.getByRole('button', { name: '2' }))
    })

    expect(screen.getByTestId('expression')).toHaveTextContent('1+2')
    expect(screen.getByTestId('result')).toHaveTextContent('3')
  })

  test('Should prevent double dots.', async () => {
    render(
      <RenderWithProviders>
        <PriceCalculator onPressEqual={() => {}} />
      </RenderWithProviders>
    )
    act(() => {
      userEvent.click(screen.getByRole('button', { name: '1' }))
      userEvent.click(screen.getByRole('button', { name: '.' }))
      userEvent.click(screen.getByRole('button', { name: '.' }))
      userEvent.click(screen.getByRole('button', { name: '2' }))
    })

    expect(screen.getByTestId('expression')).toHaveTextContent('1.2')
    expect(screen.getByTestId('result')).toHaveTextContent('0')
  })

  test('If expression start from dot return 0.', async () => {
    render(
      <RenderWithProviders>
        <PriceCalculator onPressEqual={() => {}} />
      </RenderWithProviders>
    )
    act(() => {
      userEvent.click(screen.getByRole('button', { name: '.' }))
      userEvent.click(screen.getByRole('button', { name: '2' }))
    })

    expect(screen.getByTestId('expression')).toHaveTextContent('0.2')
    expect(screen.getByTestId('result')).toHaveTextContent('0')
  })

  test('The +/- button should change the sign of the expression and result.', async () => {
    render(
      <RenderWithProviders>
        <PriceCalculator onPressEqual={() => {}} />
      </RenderWithProviders>
    )
    act(() => {
      userEvent.click(screen.getByRole('button', { name: '1' }))
      userEvent.click(screen.getByRole('button', { name: '2' }))
      userEvent.click(screen.getByRole('button', { name: '3' }))
      userEvent.click(screen.getByRole('button', { name: '+/-' }))
    })

    expect(screen.getByTestId('expression')).toHaveTextContent('-123')
    expect(screen.getByTestId('result')).toHaveTextContent('-123')

    act(() => {
      userEvent.click(screen.getByRole('button', { name: '+/-' }))
    })

    expect(screen.getByTestId('expression')).toHaveTextContent('123')
    expect(screen.getByTestId('result')).toHaveTextContent('123')
  })

  test('The +/- button should change the sign of the last argument in expression', async () => {
    render(
      <RenderWithProviders>
        <PriceCalculator onPressEqual={() => {}} />
      </RenderWithProviders>
    )
    act(() => {
      userEvent.click(screen.getByRole('button', { name: '1' }))
      userEvent.click(screen.getByRole('button', { name: '+' }))
      userEvent.click(screen.getByRole('button', { name: '2' }))
      userEvent.click(screen.getByRole('button', { name: '+/-' }))
    })

    expect(screen.getByTestId('expression')).toHaveTextContent('1+(-2)')
    expect(screen.getByTestId('result')).toHaveTextContent('-1')

    act(() => {
      userEvent.click(screen.getByRole('button', { name: '+' }))
      userEvent.click(screen.getByRole('button', { name: '3' }))
      userEvent.click(screen.getByRole('button', { name: '-' }))
      userEvent.click(screen.getByRole('button', { name: '4' }))
      userEvent.click(screen.getByRole('button', { name: '+/-' }))
    })

    expect(screen.getByTestId('expression')).toHaveTextContent('1+(-2)+3-(-4)')
    expect(screen.getByTestId('result')).toHaveTextContent('6')

    act(() => {
      userEvent.click(screen.getByRole('button', { name: '+/-' }))
    })

    expect(screen.getByTestId('expression')).toHaveTextContent('1+(-2)+3-4')
    expect(screen.getByTestId('result')).toHaveTextContent('-2')
  })

  test('The equal btn should call onPressEqual handler with result.', async () => {
    const onPressEqual = jest.fn()

    render(
      <RenderWithProviders>
        <PriceCalculator onPressEqual={onPressEqual} />
      </RenderWithProviders>
    )

    act(() => {
      userEvent.click(screen.getByRole('button', { name: '1' }))
      userEvent.click(screen.getByRole('button', { name: '+' }))
      userEvent.click(screen.getByRole('button', { name: '2' }))
    })

    expect(screen.getByTestId('result')).toHaveTextContent('3')

    act(() => {
      userEvent.click(screen.getByRole('button', { name: '=' }))
    })

    expect(screen.getByTestId('expression')).toHaveTextContent('3')
    expect(onPressEqual).toBeCalledTimes(1)
    expect(onPressEqual).toBeCalledWith(3)
  })

  test('Backspace btn should remove last argument with brackets and minus sign.', async () => {
    render(
      <RenderWithProviders>
        <PriceCalculator onPressEqual={() => {}} />
      </RenderWithProviders>
    )

    act(() => {
      userEvent.click(screen.getByRole('button', { name: '2' }))
      userEvent.click(screen.getByRole('button', { name: '+' }))
      userEvent.click(screen.getByRole('button', { name: '2' }))
      userEvent.click(screen.getByRole('button', { name: '+/-' }))
      userEvent.click(screen.getByRole('button', { name: '<-' }))
    })

    expect(screen.getByTestId('expression')).toHaveTextContent('2+')
  })
})
