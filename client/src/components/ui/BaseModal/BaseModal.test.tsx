import React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import BaseModal from './BaseModal'
import { RenderWithProviders } from '../../../utils/test-utils'

describe('BaseModal', () => {
  beforeAll(() => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('id', 'modal-root')
    document.body.appendChild(portalRoot)
  })

  afterAll(() => {
    cleanup()
  })

  test('Should be render modal.', () => {
    render(
      <RenderWithProviders>
        <BaseModal isOpen={true} onClose={() => {}}>
          <div>Modal content</div>
        </BaseModal>
      </RenderWithProviders>
    )

    const modal = screen.getByTestId('modal')
    const modalContent = screen.getByText('Modal content')

    expect(modal).toBeInTheDocument()
    expect(modalContent).toBeInTheDocument()
  })

  test('Should be render modal with title.', () => {
    render(
      <RenderWithProviders>
        <BaseModal isOpen={true} onClose={() => {}} title="Modal title">
          <div>Modal content</div>
        </BaseModal>
      </RenderWithProviders>
    )

    const modalTitle = screen.getByText('Modal title')

    expect(modalTitle).toBeInTheDocument()
  })

  test('Should close modal after click on close button.', () => {
    let isOpen = true
    const onClose = jest.fn(() => {
      isOpen = false
    })

    const { rerender } = render(
      <RenderWithProviders>
        <BaseModal isOpen={isOpen} onClose={onClose}>
          <div>Modal content</div>
        </BaseModal>
      </RenderWithProviders>
    )

    const modalCloseBtn = screen.getByLabelText('Close')

    fireEvent.click(modalCloseBtn)
    rerender(
      <RenderWithProviders>
        <BaseModal isOpen={isOpen} onClose={onClose}>
          <div>Modal content</div>
        </BaseModal>
      </RenderWithProviders>
    )

    expect(onClose).toHaveBeenCalled()
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })
})
