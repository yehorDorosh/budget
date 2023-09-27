import React, { FC, useRef } from 'react'

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  isValid?: boolean
  msg?: string
}

const BaseInput: FC<BaseInputProps> = ({ id, label, isValid, msg, ...props }) => {
  const input = useRef<HTMLInputElement>(null)
  let attrs
  if (props.type !== 'radio' && props.type !== 'checkbox') {
    input.current?.setCustomValidity(isValid ? '' : msg || 'invalid field')
  }

  if (props.type === 'password') {
    attrs = (({ value, ...p }) => p)(props) // remove value from props
  } else {
    attrs = props
  }

  const text = (
    <div className={`mb-3 ${isValid === false ? 'was-validated' : ''}`}>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <div className={`input-group ${isValid !== undefined ? 'has-validation' : ''}`}>
        <input ref={input} id={id} className="form-control" {...attrs} />
        {!isValid && msg && <div className="invalid-feedback">{msg}</div>}
      </div>
    </div>
  )

  const radio = (
    <div className="mb-3 form-check">
      <input id={id} className="form-check-input" {...props} />
      <label htmlFor={id} className="form-check-label">
        {label}
      </label>
    </div>
  )

  const checkbox = (
    <div className="mb-3 form-check">
      <input id={id} className="form-check-input" {...props} />
      <label htmlFor={id} className="form-check-label">
        {label}
      </label>
    </div>
  )

  switch (props.type) {
    case 'radio':
      return radio
    case 'checkbox':
      return checkbox
    default:
      return text
  }
}

export default BaseInput
