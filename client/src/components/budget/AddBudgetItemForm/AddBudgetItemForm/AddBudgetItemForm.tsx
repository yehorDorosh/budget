import { FC } from 'react'

import useField from '../../../../hooks/useField'
import useForm from '../../../../hooks/useForm'
import { notEmpty } from '../../../../utils/validators'
import { addBudgetItem } from '../../../../store/budget/budget-item-actions'

interface Props {
  token: string
}

const AddBudgetItemForm: FC<Props> = ({ token }) => {
  const { fieldState: nameState, fieldDispatch: nameDispatch } = useField()
  const { fieldState: valueState, fieldDispatch: valueDispatch } = useField()
  const { fieldState: dateState, fieldDispatch: dateDispatch } = useField()
  const { fieldState: categoryState, fieldDispatch: categoryDispatch } = useField()
  const { formMarkup } = useForm(
    [
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
      },
      {
        id: 'category',
        name: 'category',
        type: 'text',
        label: 'Category',
        placeholder: 'Category',
        errMsg: 'Field is required.',
        validator: null,
        state: categoryState,
        dispatch: categoryDispatch
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
