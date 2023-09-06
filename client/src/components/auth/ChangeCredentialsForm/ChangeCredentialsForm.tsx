import { FC } from 'react'

import { notEmpty, emailValidator, passwordValidator } from '../../../utils/validators'
import useField from '../../../hooks/useField'
import useForm from '../../../hooks/useForm'
import { updateUser } from '../../../store/user/user-actions'
import { ResCodes } from '../../../types/enum'
import { EmailOrPassword } from '../../../types/store-actions'

interface Props {
  fieldName: keyof EmailOrPassword
  token: string
  onEdit: (email: string) => void
}

const ChangeCredentialsForm: FC<Props> = ({ fieldName, token, onEdit: onEditEmail }) => {
  const { fieldState, fieldDispatch } = useField()
  let validator: ValidationFunction
  switch (fieldName) {
    case 'email':
      validator = emailValidator
      break
    case 'password':
      validator = passwordValidator
      break
    default:
      validator = notEmpty
  }
  const { formMarkup } = useForm(
    [
      {
        name: fieldName,
        type: fieldName,
        label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
        placeholder: fieldName,
        errMsg: `Please enter a valid ${fieldName}.`,
        validator,
        state: fieldState,
        dispatch: fieldDispatch
      }
    ],
    {
      submitBtnText: `Change ${fieldName}`,
      submitAction: updateUser,
      submitActionParams: [token, { [fieldName]: fieldState.value } as EmailOrPassword]
    },
    {
      onGetResponse: (res) => {
        if (res.data.code === ResCodes.UPDATE_USER) onEditEmail(fieldState.value)
      }
    }
  )

  return formMarkup
}

export default ChangeCredentialsForm
