import { FC } from 'react'

import useField from '../../../hooks/useField'
import useForm from '../../../hooks/useForm'
import { notEmpty } from '../../../utils/validators'
import { updateCategory } from '../../../store/categories/categories-actions'

interface Props {
  id: number
  token: string
}

const UpdateCategoryForm: FC<Props> = ({ token, id }) => {
  const { fieldState: categoryState, fieldDispatch: categoryDispatch } = useField()
  const { formMarkup } = useForm(
    [
      {
        name: 'name',
        type: 'text',
        label: 'Category name',
        placeholder: 'Category name',
        errMsg: 'Field is required.',
        validator: notEmpty,
        state: categoryState,
        dispatch: categoryDispatch
      }
    ],
    {
      submitBtnText: 'Create category',
      submitAction: updateCategory,
      submitActionParams: [token, id, categoryState.value]
    }
  )

  return formMarkup
}

export default UpdateCategoryForm
