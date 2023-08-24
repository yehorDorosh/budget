import React, { FC } from 'react'

import classes from './BaseInput.module.scss'

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  isValid?: boolean
  msg?: string
}

const BaseInput: FC<BaseInputProps> = ({ label, isValid, msg, ...props }) => {
  return (
    <div className={classes.input}>
      <label>{label}</label>
      {!isValid && msg && <p className={classes.errorTxt}>{msg}</p>}
      <input className={isValid ? '' : classes.invalid} {...props} />
    </div>
  )
}

export default BaseInput
