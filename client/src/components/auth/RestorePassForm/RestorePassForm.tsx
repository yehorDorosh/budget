import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import * as jose from 'jose'

import useField from '../../../hooks/useFiled/useField'
import useForm from '../../../hooks/useForm/useForm'
import { passwordValidator } from '../../../utils/validators'
import { restorePassword } from '../../../store/user/user-actions'
import { ResCodes } from '../../../types/enum'
import BaseCard from '../../ui/BaseCard/BaseCard'

interface Props {
  token: string
}

const SignupForm: React.FC<Props> = ({ token }) => {
  const navigate = useNavigate()
  const { fieldState: passwordState, fieldDispatch: passwordDispatch } = useField()
  const [tokenExpired, setTokenExpired] = useState(false)
  try {
    jose.decodeJwt(token)
  } catch (e) {
    throw new Error('Invalid token')
  }
  const { formMarkup } = useForm(
    [
      {
        name: 'newPassword',
        type: 'password',
        label: 'Password',
        placeholder: 'password',
        errMsg: 'Password should contain at least 8 symbols. At least one char in upper case and at least 1 number.',
        validator: passwordValidator,
        state: passwordState,
        dispatch: passwordDispatch
      }
    ],
    {
      submitBtnText: 'Restore password',
      submitAction: restorePassword,
      submitActionData: { token, password: passwordState.value }
    },
    {
      onSubmit: () => {
        setTokenExpired(false)
        const { exp: expiryDate } = jose.decodeJwt(token)
        if (expiryDate && Date.now() >= expiryDate * 1000) {
          setTokenExpired(true)
          return
        }
      },
      onGetResponse: (res) => {
        if (res.data.code === ResCodes.RESET_PASSWORD) navigate('/login', { replace: true })
      }
    }
  )

  return (
    <BaseCard>
      {tokenExpired && (
        <p>
          <span className="error">
            The time to restore your password is over. Please request an email with password restore instructions again.
          </span>
          <NavLink to="/restore-password">Restore password</NavLink>
        </p>
      )}
      {formMarkup}
    </BaseCard>
  )
}

export default SignupForm
