import React, { FC } from 'react'

// import classes from './SelectInput.module.scss'

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
    <div className={`mb-3 ${isValid === false ? 'was-validated' : ''}`}>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <div className={`input-group ${isValid !== undefined ? 'has-validation' : ''}`}>
        <select id={id} className="form-select" {...props}>
          {options.length > 0 &&
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
        {!isValid && msg && <div className="invalid-feedback">{msg}</div>}
      </div>
    </div>
  )
}

export default BaseInput
