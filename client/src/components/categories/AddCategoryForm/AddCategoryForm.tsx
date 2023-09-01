import { FC } from 'react'

import useField from '../../../hooks/useField'
import useForm from '../../../hooks/useForm'
import { notEmpty } from '../../../utils/validators'
import { addCategory } from '../../../store/categories/categories-actions'

interface Props {
  token: string
}

const AddCategoryForm: FC<Props> = ({ token }) => {
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
      submitAction: addCategory,
      submitActionParams: [token, categoryState.value]
    }
  )

  return formMarkup
}

export default AddCategoryForm
