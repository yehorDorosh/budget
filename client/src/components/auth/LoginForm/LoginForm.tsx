import React, { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { login } from '../../../store/user/user-actions'
import useSubmit from '../../../hooks/useFormSubmit'
import useField from '../../../hooks/useField'
import BaseForm from '../../ui/BaseForm/BaseForm'
import BaseInput from '../../ui/BaseInput/BaseInput'

const LoginForm = () => {
  const navigate = useNavigate()
  const submit = useSubmit()
  const [wrongCredentials, setWrongCredentials] = useState(false)
  const { fieldState: emailState, filedDispatch: emailDispatch } = useField()
  const { fieldState: passwordState, filedDispatch: passwordDispatch } = useField()

  function emailHandler(e: React.ChangeEvent<HTMLInputElement>) {
    emailDispatch({ type: 'set', payload: { value: e.target.value, touched: true } })
  }

  function passwordHandler(e: React.ChangeEvent<HTMLInputElement>) {
    passwordDispatch({ type: 'set', payload: { value: e.target.value, touched: true } })
  }

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    setWrongCredentials(false)
    e.preventDefault()
    const res = await submit<UserPayload>(
      [],
      new Map([
        [emailDispatch, null],
        [passwordDispatch, null]
      ]),
      login,
      [emailState.value, passwordState.value],
      () => navigate('/')
    )
    if (res && res.status && res.status === 403) setWrongCredentials(true)
  }

  return (
    <Fragment>
      {wrongCredentials && <p className="center error">Wrong credentials</p>}
      <BaseForm onSubmit={submitHandler} noValidate>
        <BaseInput
          label="Email"
          isValid={emailState.isValid}
          msg="Please enter a valid email."
          type="email"
          placeholder="email"
          name="email"
          onChange={emailHandler}
          value={emailState.value}
        />
        <BaseInput
          label="Password"
          isValid={passwordState.isValid}
          msg="Please enter a valid password."
          type="password"
          placeholder="password"
          name="password"
          onChange={passwordHandler}
          value={passwordState.value}
        />
        <button type="submit">Login</button>
      </BaseForm>
      <p className="center">
        <a href="/restore-password">Forgot password?</a>
      </p>
    </Fragment>
  )
}

export default LoginForm
