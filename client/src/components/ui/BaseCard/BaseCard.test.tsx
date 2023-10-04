import React from 'react'
import { render, screen } from '@testing-library/react'
import BaseCard from './BaseCard'

describe('BaseCard', () => {
  test('Should render correctly.', () => {
    const { container } = render(<BaseCard>BaseCard</BaseCard>)

    expect(container).toBeInTheDocument()
    expect(screen.getByText('BaseCard')).toBeInTheDocument()
  })
})
