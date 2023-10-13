import { FC } from 'react'

import useField from '../../../hooks/useFiled/useField'
import useForm from '../../../hooks/useForm/useForm'
import { notEmpty } from '../../../utils/validators'
import { addCategory } from '../../../store/categories/categories-actions'
import { CategoryType } from '../../../types/enum'
import BaseCard from '../../ui/BaseCard/BaseCard'

interface Props {
  token: string
}

const AddCategoryForm: FC<Props> = ({ token }) => {
  const { fieldState: categoryState, fieldDispatch: categoryDispatch } = useField()
  const { fieldState: categoryTypeState, fieldDispatch: categoryTypeDispatch } = useField(CategoryType.EXPENSE)
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
        dispatch: categoryDispatch
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
        attrs: { defaultChecked: true }
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
        defaultValue: CategoryType.INCOME
      }
    ],
    {
      submitBtnText: 'Create category',
      submitAction: addCategory,
      submitActionData: { token, name: categoryState.value, categoryType: categoryTypeState.value }
    }
  )

  return (
    <BaseCard className="mb-4" data-testid="add-category-form">
      {formMarkup}
    </BaseCard>
  )
}

export default AddCategoryForm
