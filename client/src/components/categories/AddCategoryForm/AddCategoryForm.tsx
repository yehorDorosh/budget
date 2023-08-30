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
import { userActions } from '../../../store/user/user-slice'
import { addCategory } from '../../../store/categories/categories-actions'

interface Props {
  token: string
}

const AddCategoryForm: FC<Props> = ({ token }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { submit, isLoading, validationErrorsBE } = useFormSubmit()
  const { fieldState: categoryState, fieldDispatch: categoryDispatch } = useField()

  function categoryHandler(e: React.ChangeEvent<HTMLInputElement>) {
    categoryDispatch({ type: 'set&check', payload: { value: e.target.value, touched: true }, validation: notEmpty })
  }

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await submit([categoryState], new Map([[categoryDispatch, notEmpty]]), addCategory, [token, categoryState.value])

    if (res && isActionPayload(res) && res.data.code === ResCodes.DELETE_USER) {
      dispatch(userActions.logout())
      navigate('/', { replace: true })
    }
  }

  return (
    <BaseForm onSubmit={submitHandler} isLoading={isLoading} errors={validationErrorsBE}>
      <BaseInput
        label="Category name"
        isValid={categoryState.isValid}
        msg="Please enter a category name."
        type="text"
        placeholder="Category name"
        name="name"
        onChange={categoryHandler}
        value={categoryState.value}
      />
      <button type="submit">Create category</button>
    </BaseForm>
  )
}

export default AddCategoryForm
