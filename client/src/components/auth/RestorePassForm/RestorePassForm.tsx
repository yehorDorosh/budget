import { Fragment, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import * as jose from 'jose'

import BaseForm from '../../ui/BaseForm/BaseForm'
import BaseInput from '../../ui/BaseInput/BaseInput'
import useField from '../../../hooks/useField'
import useFormSubmit from '../../../hooks/useFormSubmit'
import { passwordValidator } from '../../../utils/validators'
import { restorePassword } from '../../../store/user/user-actions'
import { isActionPayload } from '../../../types/actions/actions'
import { ResCodes } from '../../../types/enum'

interface Props {
  token: string
}

const SignupForm: React.FC<Props> = ({ token }) => {
  const navigate = useNavigate()
  const { submit, isLoading, validationErrorsBE } = useFormSubmit()
  const { fieldState: passwordState, filedDispatch: passwordDispatch } = useField()
  const [tokenExpired, setTokenExpired] = useState(false)

  function passwordHandler(e: React.ChangeEvent<HTMLInputElement>) {
    passwordDispatch({ type: 'set&check', payload: { value: e.target.value, touched: true }, validation: passwordValidator })
  }

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setTokenExpired(false)
    const { exp: expiryDate } = jose.decodeJwt(token)
    if (expiryDate && Date.now() >= expiryDate * 1000) {
      setTokenExpired(true)
      return
    }
    const res = await submit([passwordState], new Map([[passwordDispatch, passwordValidator]]), restorePassword, [
      token,
      passwordState.value
    ])

    if (res && isActionPayload(res) && res.data.code === ResCodes.RESET_PASSWORD) {
      navigate('/login', { replace: true })
    }
  }

  return (
    <Fragment>
      {tokenExpired && (
        <p>
          <span className="error">
            The time to restore your password is over. Please request an email with password restore instructions again.
          </span>
          <NavLink to="/restore-password">Restore password</NavLink>
        </p>
      )}
      <BaseForm onSubmit={submitHandler} isLoading={isLoading} errors={validationErrorsBE} noValidate>
        <BaseInput
          label="Password"
          isValid={passwordState.isValid}
          msg="Please enter a password."
          type="password"
          placeholder="password"
          name="newPassword"
          onChange={passwordHandler}
          value={passwordState.value}
        />
        <button type="submit">Restore password</button>
      </BaseForm>
    </Fragment>
  )
}

export default SignupForm
