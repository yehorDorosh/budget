import { render, screen, cleanup } from '@testing-library/react'
import SelectInput from './SelectInput'
import userEvent from '@testing-library/user-event'

describe('SelectInput', () => {
  const options = [
    { value: '1', label: '1' },
    { value: '2', label: '2' }
  ]

  afterEach(() => {
    cleanup()
  })

  test('Should render correctly.', () => {
    render(<SelectInput id="inputId" label="name" options={options} />)

    const input = screen.getByTestId('input')

    expect(input).toBeInTheDocument()
    expect(screen.getByLabelText('name')).toBeInTheDocument()
  })

  test('Should be valid.', () => {
    render(<SelectInput id="inputId" label="name" isValid={true} options={options} />)
    const input = screen.getByTestId('input')

    expect(input).toBeValid()
    expect(screen.queryByTestId('invalid-msg')).not.toBeInTheDocument()
  })

  test('Should be invalid.', () => {
    render(<SelectInput id="inputId" label="name" isValid={false} msg="invalid field" options={options} />)
    const input = screen.getByTestId('input')

    expect(input).toBeInvalid()
    expect(screen.getByTestId('invalid-msg')).toBeInTheDocument()
  })

  test('Should be validated after touched.', () => {
    const { rerender } = render(<SelectInput id="inputId" label="name" isValid={true} msg="invalid field" options={options} />)
    const input = screen.getByTestId('select-input')

    expect(input).not.toHaveClass('was-validated')
    rerender(<SelectInput id="inputId" label="name" isValid={false} msg="invalid field" options={options} />)

    expect(screen.queryByTestId('select-input')).toHaveClass('was-validated')
  })

  test('Should be validate if props isValid was used.', () => {
    render(<SelectInput id="inputId" label="name" isValid={true} msg="invalid field" options={options} />)
    const inputGroup = screen.getByTestId('input-formatter')

    expect(inputGroup).toHaveClass('has-validation')
  })

  test('Should has value "2"', () => {
    render(<SelectInput id="inputId" label="name" isValid={true} msg="invalid field" options={options} />)
    const input = screen.getByTestId('input')
    userEvent.selectOptions(input, '2')

    expect(input).toHaveValue('2')
  })
})
