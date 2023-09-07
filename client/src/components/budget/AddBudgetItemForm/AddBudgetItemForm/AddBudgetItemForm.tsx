import { FC } from 'react'

import useField from '../../../../hooks/useField'
import useForm from '../../../../hooks/useForm'
import { notEmpty } from '../../../../utils/validators'
import { addBudgetItem } from '../../../../store/budget/budget-item-actions'
import { useAppSelector } from '../../../../hooks/useReduxTS'
import { CategoryType } from '../../../../types/enum'

interface Props {
  token: string
}

const AddBudgetItemForm: FC<Props> = ({ token }) => {
  const { fieldState: nameState, fieldDispatch: nameDispatch } = useField()
  const { fieldState: valueState, fieldDispatch: valueDispatch } = useField()
  const { fieldState: dateState, fieldDispatch: dateDispatch } = useField()
  const { fieldState: categoryState, fieldDispatch: categoryDispatch } = useField()
  const { fieldState: categoryTypeState, fieldDispatch: categoryTypeDispatch } = useField(CategoryType.EXPENSE)
  const categories = useAppSelector((state) => state.categories.categories)

  const { formMarkup } = useForm(
    [
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
      },
      {
        id: 'name',
        name: 'name',
        type: 'text',
        label: 'Name',
        placeholder: 'Name',
        errMsg: 'Field is required.',
        validator: notEmpty,
        state: nameState,
        dispatch: nameDispatch
      },
      {
        id: 'value',
        name: 'value',
        type: 'number',
        label: 'Value',
        placeholder: 'Value',
        errMsg: 'Field is required.',
        validator: notEmpty,
        state: valueState,
        dispatch: valueDispatch
      },
      {
        id: 'date',
        name: 'date',
        type: 'date',
        label: 'Date',
        placeholder: 'Date',
        errMsg: 'Field is required.',
        validator: notEmpty,
        state: dateState,
        dispatch: dateDispatch
        // defaultValue: new Date().toISOString().slice(0, 10)
      },
      {
        id: 'category',
        name: 'category',
        type: 'select',
        label: 'Category',
        errMsg: 'Field is required.',
        validator: notEmpty,
        state: categoryState,
        dispatch: categoryDispatch,
        options: [
          { value: '', label: 'Choose category' },
          ...categories
            .filter((category) => category.categoryType === categoryTypeState.value)
            .map((category) => ({ value: category.id.toString(), label: category.name }))
        ]
      }
    ],
    {
      submitBtnText: 'Create budget item',
      submitAction: addBudgetItem,
      submitActionData: {
        token,
        name: nameState.value,
        value: +valueState.value,
        userDate: new Date(dateState.value),
        categoryId: +categoryState.value
      }
    }
  )
  return formMarkup
}

export default AddBudgetItemForm
