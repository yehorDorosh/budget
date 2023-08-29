import React, { FC, useState } from 'react'

import { notEmpty } from '../../../utils/validators'
import useField from '../../../hooks/useField'
import useFormSubmit from '../../../hooks/useFormSubmit'
import { getRestoreEmail } from '../../../store/user/user-actions'
import BaseForm from '../../ui/BaseForm/BaseForm'
import BaseInput from '../../ui/BaseInput/BaseInput'
import { isActionPayload, isAxiosErrorPayload } from '../../../types/actions/actions'
import { ResCodes } from '../../../types/enum'

interface Props {
  onSendEmail: (email: string) => void
}

const RestorePassSendEmailForm: FC<Props> = ({ onSendEmail }) => {
  const { submit, isLoading, validationErrorsBE } = useFormSubmit()
  const { fieldState: emailState, filedDispatch: emailDispatch } = useField()
  const [userNotFound, setUserNotFound] = useState(false)

  function emailHandler(e: React.ChangeEvent<HTMLInputElement>) {
    emailDispatch({ type: 'set', payload: { value: e.target.value, touched: true } })
  }

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    setUserNotFound(false)
    e.preventDefault()
    const res = await submit([emailState], new Map([[emailDispatch, notEmpty]]), getRestoreEmail, [emailState.value])
    if (res && isAxiosErrorPayload(res) && res.status === 403) {
      setUserNotFound(true)
    }
    if (res && isActionPayload(res) && res.data.code === ResCodes.SEND_RESTORE_PASSWORD_EMAIL) {
      onSendEmail(emailState.value)
    }
  }

  const errorMsgs = validationErrorsBE || (userNotFound ? 'User with this email does not exist' : undefined)

  return (
    <BaseForm onSubmit={submitHandler} isLoading={isLoading} errors={errorMsgs} noValidate>
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
      <button type="submit">Send email</button>
    </BaseForm>
  )
}

export default RestorePassSendEmailForm
