import { FC } from 'react'

import useField from '../../../hooks/useField'
import useForm from '../../../hooks/useForm'
import { notEmpty } from '../../../utils/validators'
import { updateCategory } from '../../../store/categories/categories-actions'

interface Props {
  id: number
  token: string
  defaultName: string
  onSave: () => void
}

const UpdateCategoryForm: FC<Props> = ({ token, id, defaultName, onSave }) => {
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
        dispatch: categoryDispatch,
        defaultValue: defaultName
      }
    ],
    {
      submitBtnText: 'Save',
      submitAction: updateCategory,
      submitActionParams: [token, id, categoryState.value]
    },
    {
      onGetResponse: () => {
        onSave()
      }
    }
  )

  return formMarkup
}

export default UpdateCategoryForm
