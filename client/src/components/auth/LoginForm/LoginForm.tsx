import React, { Fragment, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { login } from '../../../store/user/user-actions'
import useSubmit from '../../../hooks/useFormSubmit'
import useField from '../../../hooks/useField'
import BaseForm from '../../ui/BaseForm/BaseForm'
import BaseInput from '../../ui/BaseInput/BaseInput'
import { notEmpty } from '../../../utils/validators'
import { isAxiosErrorPayload } from '../../../types/actions/actions'

const LoginForm = () => {
  const navigate = useNavigate()
  const { submit, isLoading } = useSubmit()
  const [wrongCredentials, setWrongCredentials] = useState(false)
  const { fieldState: emailState, fieldDispatch: emailDispatch } = useField()
  const { fieldState: passwordState, fieldDispatch: passwordDispatch } = useField()

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
      [emailState, passwordState],
      new Map([
        [emailDispatch, notEmpty],
        [passwordDispatch, notEmpty]
      ]),
      login,
      [emailState.value, passwordState.value]
    )
    if (res && isAxiosErrorPayload(res) && res.status === 403) {
      setWrongCredentials(true)
    } else {
      navigate('/')
    }
  }

  return (
    <Fragment>
      <BaseForm onSubmit={submitHandler} isLoading={isLoading} errors={wrongCredentials ? 'Wrong credentials' : undefined} noValidate>
        <BaseInput
          label="Email"
          isValid={emailState.isValid}
          msg="Please enter a email."
          type="email"
          placeholder="email"
          name="email"
          onChange={emailHandler}
          value={emailState.value}
        />
        <BaseInput
          label="Password"
          isValid={passwordState.isValid}
          msg="Please enter a password."
          type="password"
          placeholder="password"
          name="password"
          onChange={passwordHandler}
          value={passwordState.value}
        />
        <button type="submit">Login</button>
      </BaseForm>
      <p className="center">
        <NavLink to="/restore-password">Forgot password?</NavLink>
      </p>
    </Fragment>
  )
}

export default LoginForm
