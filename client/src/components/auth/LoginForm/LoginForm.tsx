import { Fragment, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { login } from '../../../store/user/user-actions'
import useField from '../../../hooks/useField'
import useForm from '../../../hooks/useForm'
import { notEmpty } from '../../../utils/validators'

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
        dispatch: emailDispatch
      },
      {
        name: 'password',
        type: 'password',
        label: 'Password',
        placeholder: 'password',
        errMsg: 'Field is required.',
        validator: notEmpty,
        state: passwordState,
        dispatch: passwordDispatch
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
        if (isAxiosErr && res.status === 403) setWrongCredentials(true)
      }
    }
  )

  return (
    <Fragment>
      {formMarkup}
      <p className="center">
        <NavLink to="/restore-password">Forgot password?</NavLink>
      </p>
    </Fragment>
  )
}

export default LoginForm
