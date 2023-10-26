import { render, screen, cleanup } from '@testing-library/react'
import BaseInput from './BaseInput'
import DataList from './DataList'
import userEvent from '@testing-library/user-event'

describe('BaseInput', () => {
  afterEach(() => {
    cleanup()
  })

  describe('BaseInput', () => {
    test('Should render correctly.', () => {
      render(<BaseInput id="inputId" label="name" />)

      const input = screen.getByTestId('input')

      expect(input).toBeInTheDocument()
      expect(screen.getByLabelText('name')).toBeInTheDocument()
    })

    test('Should be valid.', () => {
      render(<BaseInput id="inputId" label="name" isValid={true} type="text" />)
      const input = screen.getByTestId('input')

      expect(input).toBeValid()
      expect(screen.queryByTestId('invalid-msg')).not.toBeInTheDocument()
    })

    test('Should be invalid.', () => {
      render(<BaseInput id="inputId" label="name" isValid={false} msg="invalid field" type="text" />)
      const input = screen.getByTestId('input')

      expect(input).toBeInvalid()
      expect(screen.getByTestId('invalid-msg')).toBeInTheDocument()
    })

    test('Should not be value attr.', () => {
      render(<BaseInput id="inputId" label="name" isValid={true} type="password" />)
      const input = screen.getByTestId('input')

      userEvent.type(input, 'secret')

      expect(input).not.toHaveAttribute('value')
    })

    test('Should be validated after touched.', () => {
      const { rerender } = render(<BaseInput id="inputId" label="name" isValid={true} msg="invalid field" type="text" />)
      const baseInput = screen.getByTestId('base-input')

      expect(baseInput).not.toHaveClass('was-validated')
      rerender(<BaseInput id="inputId" label="name" isValid={false} msg="invalid field" type="text" />)

      expect(baseInput).toHaveClass('was-validated')
    })

    test('Should be validate if props isValid was used.', () => {
      render(<BaseInput id="inputId" label="name" isValid={true} msg="invalid field" type="text" />)
      const inputGroup = screen.getByTestId('input-formatter')

      expect(inputGroup).toHaveClass('has-validation')
    })

    test('Should render radio input.', () => {
      render(<BaseInput id="inputId" label="name" type="radio" />)
      const input = screen.getByTestId('input')

      expect(input).toHaveAttribute('type', 'radio')
    })

    test('Should render checkbox input.', () => {
      render(<BaseInput id="inputId" label="name" type="checkbox" />)
      const input = screen.getByTestId('input')

      expect(input).toHaveAttribute('type', 'checkbox')
    })

    test('Should render datalist.', () => {
      render(<BaseInput id="inputId" label="name" dataList={['fuel', 'book']} />)
      const dataList = screen.getByTestId('data-list')

      expect(dataList).toBeInTheDocument()
      expect(dataList).toHaveAttribute('id', 'inputId-list')
      expect(screen.getAllByTestId('data-list-option')[0]).toHaveAttribute('value', 'fuel')
      expect(screen.getAllByTestId('data-list-option')[1]).toHaveAttribute('value', 'book')
    })
  })

  describe('DataList', () => {
    test('Should render correctly.', () => {
      render(<DataList id="inputId" dataList={['fuel', 'book']} />)

      const dataList = screen.getByTestId('data-list')

      expect(dataList).toBeInTheDocument()
      expect(dataList).toHaveAttribute('id', 'inputId')
      expect(screen.getAllByTestId('data-list-option')).toHaveLength(2)
      expect(screen.getAllByTestId('data-list-option')[0]).toHaveAttribute('value', 'fuel')
      expect(screen.getAllByTestId('data-list-option')[1]).toHaveAttribute('value', 'book')
    })
  })
})
