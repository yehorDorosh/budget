import React from 'react'
import { render, screen } from '@testing-library/react'
import BurgerButton from './BurgerButton'
import userEvent from '@testing-library/user-event'
import { cleanup } from '@testing-library/react'

describe('BurgerButton', () => {
  afterAll(() => {
    cleanup()
  })

  test('Should fire onClick callback.', () => {
    const onClick = jest.fn()
    render(<BurgerButton id="burger" onClick={onClick} />)
    const burger = screen.getByTestId('burger')

    userEvent.click(burger)

    expect(onClick).toHaveBeenCalled()
  })

  test('Should be open.', () => {
    render(<BurgerButton id="burger" isOpen={true} onClick={() => {}} />)
    const burger = screen.getByTestId('burger')

    expect(burger).toHaveAttribute('checked')
  })

  test('Should be closed.', () => {
    render(<BurgerButton id="burger" isOpen={false} onClick={() => {}} />)
    const burger = screen.getByTestId('burger')

    expect(burger).not.toHaveAttribute('checked')
  })
})
