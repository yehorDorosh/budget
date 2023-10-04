import { FC, useState } from 'react'

import { notEmpty } from '../../../utils/validators'
import useField from '../../../hooks/useFiled/useField'
import useForm from '../../../hooks/useForm'
import { getRestoreEmail } from '../../../store/user/user-actions'
import { ResCodes } from '../../../types/enum'
import BaseCard from '../../ui/BaseCard/BaseCard'

interface Props {
  onSendEmail: (email: string) => void
}

const RestorePassSendEmailForm: FC<Props> = ({ onSendEmail }) => {
  const { fieldState: emailState, fieldDispatch: emailDispatch } = useField()
  const [userNotFound, setUserNotFound] = useState(false)
  const { formMarkup } = useForm(
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
      }
    ],
    {
      submitBtnText: 'Send email',
      submitAction: getRestoreEmail,
      submitActionData: { email: emailState.value },
      errMsg: userNotFound ? 'User with this email does not exist' : undefined
    },
    {
      onSubmit: () => setUserNotFound(false),
      onGetResponse: (res) => {
        if (res.data.code === ResCodes.SEND_RESTORE_PASSWORD_EMAIL) onSendEmail(emailState.value)
      },
      onReject: (res, isAxiosErr) => {
        if (isAxiosErr && res.status === 403) setUserNotFound(true)
      }
    }
  )

  return <BaseCard>{formMarkup}</BaseCard>
}

export default RestorePassSendEmailForm
