import React, { FC } from 'react'
import ReactDOM from 'react-dom'

import classes from './BaseModal.module.scss'

interface Props {
  children: React.ReactNode
  isOpen: boolean
  onClose: Function
  title?: string
  footer?: {
    accept: {
      text: string
      onClick: Function
    }
    reject: {
      text: string
      onClick: Function
    }
  }
}

const BaseModal: FC<Props> = ({ children, isOpen, onClose, title, footer }) => {
  const modalMarkup = (
    <div className={classes.overlay} data-testid="modal">
      <div className={`modal ${classes.modal}`}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              {title && <h5 className="modal-title">{title}</h5>}
              <button type="button" className="btn-close" aria-label="Close" onClick={() => onClose()} data-testid="close-btn"></button>
            </div>
            <div className="modal-body">{children}</div>
            {footer && (
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => footer.reject.onClick()} data-testid="reject">
                  {footer.reject.text}
                </button>
                <button type="button" className="btn btn-primary" onClick={() => footer.accept.onClick()} data-testid="accept">
                  {footer.accept.text}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
  return ReactDOM.createPortal(isOpen ? modalMarkup : null, document.getElementById('modal-root') as HTMLElement)
}

export default BaseModal
