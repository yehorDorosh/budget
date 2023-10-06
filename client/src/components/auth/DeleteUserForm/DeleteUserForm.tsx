import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import useField from '../../../hooks/useFiled/useField'
import useForm from '../../../hooks/useForm/useForm'
import { notEmpty } from '../../../utils/validators'
import { ResCodes } from '../../../types/enum'
import { deleteUser } from '../../../store/user/user-actions'
import { userActions } from '../../../store/user/user-slice'
import BaseCard from '../../ui/BaseCard/BaseCard'

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
      submitActionData: { token, password: passwordState.value }
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
  return <BaseCard>{formMarkup}</BaseCard>
}

export default DeleteUserForm
