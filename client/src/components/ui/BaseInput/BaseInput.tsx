import React, { FC } from 'react'

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  isValid?: boolean
  msg?: string
}

const BaseInput: FC<BaseInputProps> = ({ id, label, isValid, msg, ...props }) => {
  const text = (
    <div className={`mb-3 ${isValid === false ? 'was-validated' : ''}`}>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <div className={`input-group ${isValid !== undefined ? 'has-validation' : ''}`}>
        <input id={id} className="form-control" {...props} />
        {!isValid && msg && <div className="invalid-feedback">{msg}</div>}
      </div>
    </div>
  )
  const radio = (
    <div className="form-check">
      <input id={id} className="form-check-input" {...props} />
      <label htmlFor={id} className="form-check-label">
        {label}
      </label>
    </div>
  )
  switch (props.type) {
    case 'radio':
      return radio
    default:
      return text
  }
}

export default BaseInput
