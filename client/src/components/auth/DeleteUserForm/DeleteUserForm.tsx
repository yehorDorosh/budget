import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import BaseForm from '../../ui/BaseForm/BaseForm'
import BaseInput from '../../ui/BaseInput/BaseInput'
import useField from '../../../hooks/useField'
import useFormSubmit from '../../../hooks/useFormSubmit'
import { notEmpty } from '../../../utils/validators'
import { ResCodes } from '../../../types/enum'
import { isActionPayload } from '../../../types/actions/actions'
import { deleteUser } from '../../../store/user/user-actions'
import { userActions } from '../../../store/user/user-slice'

interface Props {
  token: string
}

const DeleteUserForm: FC<Props> = ({ token }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { submit, isLoading, validationErrorsBE } = useFormSubmit()
  const { fieldState: passwordState, fieldDispatch: passwordDispatch } = useField()

  function passwordHandler(e: React.ChangeEvent<HTMLInputElement>) {
    passwordDispatch({ type: 'set&check', payload: { value: e.target.value, touched: true }, validation: notEmpty })
  }

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await submit([passwordState], new Map([[passwordDispatch, notEmpty]]), deleteUser, [token, passwordState.value])

    if (res && isActionPayload(res) && res.data.code === ResCodes.DELETE_USER) {
      dispatch(userActions.logout())
      navigate('/', { replace: true })
    }
  }
  return (
    <BaseForm onSubmit={submitHandler} isLoading={isLoading} errors={validationErrorsBE}>
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
      <button type="submit">Delete user</button>
    </BaseForm>
  )
}

export default DeleteUserForm
