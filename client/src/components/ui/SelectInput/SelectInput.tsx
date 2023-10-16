import React, { FC, useEffect, useRef } from 'react'

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
  const input = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    input.current?.setCustomValidity(isValid ? '' : msg || 'invalid field')
  }, [isValid, msg])

  return (
    <div className={`mb-3 ${isValid === false ? 'was-validated' : ''}`} data-testid="select-input">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <div className={`input-group ${isValid !== undefined ? 'has-validation' : ''}`} data-testid="input-formatter">
        <select ref={input} id={id} className="form-select" data-testid="input" {...props}>
          {options.length > 0 &&
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
        {!isValid && msg && (
          <div className="invalid-feedback" data-testid="invalid-msg">
            {msg}
          </div>
        )}
      </div>
    </div>
  )
}

export default BaseInput
