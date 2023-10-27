import React, { FC } from 'react'

import classes from './CalculatorButton.module.scss'

interface Props {
  btnTxt: string
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  className?: string
}

const CalculatorButton: FC<Props> = ({ onClick, btnTxt, className }) => {
  return (
    <button id={`calc-${btnTxt}`} className={`btn ${classes.btn} ${className}`} onClick={onClick}>
      {btnTxt}
    </button>
  )
}

export default CalculatorButton
