import React, { FC } from 'react'

import classes from './BurgerButton.module.scss'

interface Props {
  id: string
  className?: string
  onClick: () => void
  isOpen?: boolean
}

const BurgerButton: FC<Props> = ({ id, className, onClick, isOpen }) => {
  return (
    <div className={`${classes.burger} ${className} ${isOpen ? classes.open : ''}`}>
      <label htmlFor={id}>
        <input type="checkbox" id={id} onChange={() => onClick()} checked={isOpen} />
        <span></span>
        <span></span>
        <span></span>
      </label>
    </div>
  )
}

export default BurgerButton
