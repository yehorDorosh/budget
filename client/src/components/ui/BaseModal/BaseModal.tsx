import React, { FC } from 'react'
import ReactDOM from 'react-dom'

import classes from './BaseModal.module.scss'

interface Props {
  children: React.ReactNode
  isOpen: boolean
  onClose: Function
  title?: string
}

const BaseModal: FC<Props> = ({ children, isOpen, onClose, title }) => {
  const modalMarkup = (
    <div className={classes.overllay} data-testid="modal">
      <div className={`modal ${classes.modal}`}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              {title && <h5 className="modal-title">{title}</h5>}
              <button type="button" className="btn-close" aria-label="Close" onClick={() => onClose()} data-testid="close-btn"></button>
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
  return ReactDOM.createPortal(isOpen ? modalMarkup : null, document.getElementById('modal-root') as HTMLElement)
}

export default BaseModal
