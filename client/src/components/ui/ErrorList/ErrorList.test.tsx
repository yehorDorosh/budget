import React from 'react'
import { render, screen } from '@testing-library/react'
import ErrorList from './ErrorList'
import { cleanup } from '@testing-library/react'

describe('ErrorList', () => {
  afterAll(() => {
    cleanup()
  })

  test('Should render string of error.', () => {
    const errors = 'error1'

    render(<ErrorList errors={errors} />)

    expect(screen.getByTestId('error-list')).toBeInTheDocument()
    expect(screen.getByText('error1')).toBeInTheDocument()
  })

  test('Should render array of errors.', () => {
    const errors = [
      {
        location: 'body',
        msg: 'error1',
        path: 'email',
        type: 'string.base',
        value: 'emailuser.com'
      },
      {
        location: 'body',
        msg: 'error2',
        path: 'password',
        type: 'string.base',
        value: 'Qwerty78'
      }
    ]

    render(<ErrorList errors={errors} />)

    expect(screen.getByTestId('error-list')).toBeInTheDocument()
    expect(screen.getByText('error1')).toBeInTheDocument()
    expect(screen.getByText('error2')).toBeInTheDocument()
  })
})
