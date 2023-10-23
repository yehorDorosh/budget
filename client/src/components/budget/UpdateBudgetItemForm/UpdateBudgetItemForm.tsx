import { FC } from 'react'

import useField from '../../../hooks/useFiled/useField'
import useForm from '../../../hooks/useForm/useForm'
import { notEmpty } from '../../../utils/validators'
import { updateBudgetItem } from '../../../store/budget/budget-item-actions'
import { useAppSelector } from '../../../hooks/useReduxTS'
import { CategoryType } from '../../../types/enum'
import { BudgetItem } from '../../../store/budget/budget-item-slice'
import BaseCard from '../../ui/BaseCard/BaseCard'
import { isDateValid } from '../../../utils/date'

interface Props {
  token: string
  currentBudgetItem: BudgetItem
  onSave: () => void
}

const UpdateBudgetItemForm: FC<Props> = ({ token, currentBudgetItem, onSave }) => {
  const { fieldState: nameState, fieldDispatch: nameDispatch } = useField(currentBudgetItem.name)
  const { fieldState: valueState, fieldDispatch: valueDispatch } = useField(currentBudgetItem.value.toString())
  const { fieldState: dateState, fieldDispatch: dateDispatch } = useField(currentBudgetItem.userDate)
  const { fieldState: categoryState, fieldDispatch: categoryDispatch } = useField(currentBudgetItem.category.id.toString())
  const { fieldState: categoryTypeState, fieldDispatch: categoryTypeDispatch } = useField(currentBudgetItem.category.categoryType)
  const { fieldState: ignoreState, fieldDispatch: ignoreDispatch } = useField(currentBudgetItem.ignore.toString())
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
        attrs: { defaultChecked: currentBudgetItem.category.categoryType === CategoryType.EXPENSE }
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
        attrs: { defaultChecked: currentBudgetItem.category.categoryType === CategoryType.INCOME }
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
        dispatch: nameDispatch,
        defaultValue: currentBudgetItem.name
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
        dispatch: valueDispatch,
        attrs: { min: '0', step: '0.01', pattern: 'd+(.d{1,2})?' },
        defaultValue: currentBudgetItem.value.toString()
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
        dispatch: dateDispatch,
        defaultValue: currentBudgetItem.userDate
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
        ],
        defaultValue: currentBudgetItem.category.id.toString()
      },
      {
        id: 'ignore',
        name: 'ignore',
        type: 'checkbox',
        label: 'Ignore this item in statistics',
        errMsg: 'Field is required.',
        validator: null,
        state: ignoreState,
        dispatch: ignoreDispatch,
        defaultValue: currentBudgetItem.ignore.toString(),
        attrs: { defaultChecked: currentBudgetItem.ignore }
      }
    ],
    {
      submitBtnText: 'Save budget item',
      submitAction: updateBudgetItem,
      submitActionData: {
        token,
        id: currentBudgetItem.id,
        name: nameState.value,
        value: +valueState.value,
        userDate: isDateValid(dateState.value) ? new Date(dateState.value).toISOString() : currentBudgetItem.userDate,
        categoryId: +categoryState.value,
        ignore: ignoreState.value === 'true'
      }
    },
    {
      onGetResponse: () => onSave()
    }
  )
  return <BaseCard data-testid="update-budget-item-form">{formMarkup}</BaseCard>
}

export default UpdateBudgetItemForm
