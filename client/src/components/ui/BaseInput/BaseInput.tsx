import React, { FC } from 'react'

import classes from './BaseInput.module.scss'

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  isValid?: boolean
  msg?: string
}

const BaseInput: FC<BaseInputProps> = ({ id, label, isValid, msg, ...props }) => {
  return (
    <div className={classes.input}>
      <label htmlFor={id}>{label}</label>
      {!isValid && msg && <p className={classes.errorTxt}>{msg}</p>}
      <input id={id} className={isValid ? '' : classes.invalid} {...props} />
    </div>
  )
}

export default BaseInput
