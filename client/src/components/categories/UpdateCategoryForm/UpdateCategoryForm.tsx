import { FC } from 'react'

import useField from '../../../hooks/useField'
import useForm from '../../../hooks/useForm'
import { notEmpty } from '../../../utils/validators'
import { updateCategory } from '../../../store/categories/categories-actions'
import { CategoryType } from '../../../types/enum'

interface Props {
  id: number
  token: string
  defaultName: string
  defaultCategoryType: string
  onSave: () => void
}

const UpdateCategoryForm: FC<Props> = ({ token, id, defaultName, defaultCategoryType, onSave }) => {
  const { fieldState: categoryState, fieldDispatch: categoryDispatch } = useField(defaultName)
  const { fieldState: categoryTypeState, fieldDispatch: categoryTypeDispatch } = useField(defaultCategoryType)
  const { formMarkup } = useForm(
    [
      {
        id: 'name',
        name: 'name',
        type: 'text',
        label: 'Category name',
        placeholder: 'Category name',
        errMsg: 'Field is required.',
        validator: notEmpty,
        state: categoryState,
        dispatch: categoryDispatch,
        defaultValue: defaultName
      },
      {
        id: 'categoryTypeExpense',
        name: 'categoryType',
        type: 'radio',
        label: 'Log type Expense',
        errMsg: 'Field is required.',
        validator: null,
        state: categoryTypeState,
        dispatch: categoryTypeDispatch,
        defaultValue: CategoryType.EXPENSE,
        attrs: { defaultChecked: defaultCategoryType === CategoryType.EXPENSE }
      },
      {
        id: 'categoryTypeIncome',
        name: 'categoryType',
        type: 'radio',
        label: 'Log type Income',
        errMsg: 'Field is required.',
        validator: null,
        state: categoryTypeState,
        dispatch: categoryTypeDispatch,
        defaultValue: CategoryType.INCOME,
        attrs: { defaultChecked: defaultCategoryType === CategoryType.INCOME }
      }
    ],
    {
      submitBtnText: 'Save',
      submitAction: updateCategory,
      submitActionData: { token, id, name: categoryState.value, categoryType: categoryTypeState.value }
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
