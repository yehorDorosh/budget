import React, { FC } from 'react'
import ReactDOM from 'react-dom'

import classes from './BaseModal.module.scss'

interface Props {
  children: React.ReactNode
  isOpen: boolean
  onClose: Function
}

const BaseModal: FC<Props> = ({ children, isOpen, onClose }) => {
  const modalMarkup = (
    <div className={classes.overllay}>
      <dialog className={classes.modal} open>
        {children}
        <button className={classes.closeBtn} onClick={() => onClose()}>
          x
        </button>
      </dialog>
    </div>
  )
  return ReactDOM.createPortal(isOpen ? modalMarkup : null, document.getElementById('modal-root') as HTMLElement)
}

export default BaseModal
