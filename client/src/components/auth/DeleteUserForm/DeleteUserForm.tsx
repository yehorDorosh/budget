import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import useField from '../../../hooks/useField'
import useForm from '../../../hooks/useForm'
import { notEmpty } from '../../../utils/validators'
import { ResCodes } from '../../../types/enum'
import { deleteUser } from '../../../store/user/user-actions'
import { userActions } from '../../../store/user/user-slice'

interface Props {
  token: string
}

const DeleteUserForm: FC<Props> = ({ token }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { fieldState: passwordState, fieldDispatch: passwordDispatch } = useField()
  const { formMarkup } = useForm(
    [
      {
        name: 'password',
        type: 'password',
        label: 'Password',
        placeholder: 'password',
        errMsg: 'Please enter a password.',
        validator: notEmpty,
        state: passwordState,
        dispatch: passwordDispatch
      }
    ],
    {
      submitBtnText: 'Delete user',
      submitAction: deleteUser,
      submitActionParams: [token, passwordState.value]
    },
    {
      onGetResponse: (res) => {
        if (res.data.code === ResCodes.DELETE_USER) {
          dispatch(userActions.logout())
          navigate('/', { replace: true })
        }
      }
    }
  )
  return formMarkup
}

export default DeleteUserForm
