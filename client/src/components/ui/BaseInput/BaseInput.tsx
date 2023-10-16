import React, { FC, useRef, useEffect } from 'react'

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  isValid?: boolean
  msg?: string
}

const BaseInput: FC<BaseInputProps> = ({ id, label, isValid, msg, ...props }) => {
  const input = useRef<HTMLInputElement>(null)
  let attrs

  useEffect(() => {
    if (props.type !== 'radio' && props.type !== 'checkbox') {
      input.current?.setCustomValidity(isValid ? '' : msg || 'invalid field')
    }
  }, [isValid, msg, props.type])

  if (props.type === 'password') {
    attrs = (({ value, ...p }) => p)(props) // remove value from props
  } else {
    attrs = props
  }

  const text = (
    <div className={`mb-3 ${isValid === false ? 'was-validated' : ''}`} data-testid="base-input">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <div className={`input-group ${isValid !== undefined ? 'has-validation' : ''}`} data-testid="input-formatter">
        <input ref={input} id={id} className="form-control" data-testid="input" {...attrs} />
        {!isValid && msg && (
          <div className="invalid-feedback" data-testid="invalid-msg">
            {msg}
          </div>
        )}
      </div>
    </div>
  )

  const radio = (
    <div className="mb-3 form-check">
      <input id={id} className="form-check-input" data-testid="input" {...props} />
      <label htmlFor={id} className="form-check-label">
        {label}
      </label>
    </div>
  )

  const checkbox = (
    <div className="mb-3 form-check">
      <input id={id} className="form-check-input" data-testid="input" {...props} />
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
