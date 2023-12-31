import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { login } from '../../../store/user/user-actions'
import useField from '../../../hooks/useFiled/useField'
import useForm from '../../../hooks/useForm/useForm'
import { notEmpty } from '../../../utils/validators'
import BaseCard from '../../ui/BaseCard/BaseCard'

const LoginForm = () => {
  const navigate = useNavigate()
  const [wrongCredentials, setWrongCredentials] = useState(false)
  const { fieldState: emailState, fieldDispatch: emailDispatch } = useField()
  const { fieldState: passwordState, fieldDispatch: passwordDispatch } = useField()
  const { formMarkup } = useForm<UserPayload>(
    [
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'email',
        errMsg: 'Field is required.',
        validator: notEmpty,
        state: emailState,
        dispatch: emailDispatch,
        attrs: { 'data-testid': 'email' }
      },
      {
        name: 'password',
        type: 'password',
        label: 'Password',
        placeholder: 'password',
        errMsg: 'Field is required.',
        validator: notEmpty,
        state: passwordState,
        dispatch: passwordDispatch,
        attrs: { 'data-testid': 'password' }
      }
    ],
    {
      submitBtnText: 'Login',
      submitAction: login,
      submitActionData: { email: emailState.value, password: passwordState.value },
      errMsg: wrongCredentials ? 'Wrong credentials' : undefined
    },
    {
      onSubmit: () => setWrongCredentials(false),
      onGetResponse: () => navigate('/', { replace: true }),
      onReject: (res, isAxiosErr) => {
        if (isAxiosErr && (res.status === 403 || res.status === 401)) setWrongCredentials(true)
      }
    }
  )

  return (
    <BaseCard data-testid="login-form">
      {formMarkup}
      <p className="text-center">
        <NavLink to="/restore-password">Forgot password?</NavLink>
      </p>
    </BaseCard>
  )
}

export default LoginForm
