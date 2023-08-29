import React, { FC } from 'react'

import { notEmpty, emailValidator, passwordValidator } from '../../../utils/validators'
import useField from '../../../hooks/useField'
import useFormSubmit from '../../../hooks/useFormSubmit'
import { updateUser } from '../../../store/user/user-actions'
import BaseForm from '../../ui/BaseForm/BaseForm'
import BaseInput from '../../ui/BaseInput/BaseInput'
import { isActionPayload } from '../../../types/actions/actions'
import { ResCodes } from '../../../types/enum'

interface Props {
  fieldName: string
  token: string
  onEdit: (email: string) => void
}

const ChangeCredentialsForm: FC<Props> = ({ fieldName, token, onEdit: onEditEmail }) => {
  const { submit, isLoading, validationErrorsBE } = useFormSubmit()
  const { fieldState, fieldDispatch } = useField()

  let validation: ValidationFunction

  switch (fieldName) {
    case 'email':
      validation = emailValidator
      break
    case 'password':
      validation = passwordValidator
      break
    default:
      validation = notEmpty
  }

  function fieldHandler(e: React.ChangeEvent<HTMLInputElement>) {
    fieldDispatch({ type: 'set&check', payload: { value: e.target.value, touched: true }, validation })
  }

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const res = await submit([fieldState], new Map([[fieldDispatch, validation]]), updateUser, [token, { [fieldName]: fieldState.value }])

    if (res && isActionPayload(res) && res.data.code === ResCodes.UPDATE_USER) {
      onEditEmail(fieldState.value)
    }
  }

  return (
    <BaseForm onSubmit={submitHandler} isLoading={isLoading} errors={validationErrorsBE} noValidate>
      <BaseInput
        label={fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
        isValid={fieldState.isValid}
        msg={`Please enter a ${fieldName}.`}
        type={fieldName}
        placeholder={fieldName}
        name={fieldName}
        onChange={fieldHandler}
        value={fieldState.value}
      />
      <button type="submit">Change {fieldName}</button>
    </BaseForm>
  )
}

export default ChangeCredentialsForm
