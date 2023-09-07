import React, { FC } from 'react'

import classes from './SelectInput.module.scss'

export interface SelectOption {
  value: string
  label: string
}

interface BaseInputProps extends React.InputHTMLAttributes<HTMLSelectElement> {
  id: string
  label: string
  options: SelectOption[]
  isValid?: boolean
  msg?: string
}

const BaseInput: FC<BaseInputProps> = ({ id, options, label, isValid, msg, ...props }) => {
  return (
    <div className={classes.input}>
      <label htmlFor={id}>{label}</label>
      {!isValid && msg && <p className={classes.errorTxt}>{msg}</p>}
      <select id={id} className={isValid ? '' : classes.invalid} {...props}>
        {options.length > 0 &&
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
    </div>
  )
}

export default BaseInput
