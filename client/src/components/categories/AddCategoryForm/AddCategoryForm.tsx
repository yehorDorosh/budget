import { FC } from 'react'

import useField from '../../../hooks/useField'
import useForm from '../../../hooks/useForm'
import { notEmpty } from '../../../utils/validators'
import { addCategory } from '../../../store/categories/categories-actions'
import { LogType } from '../../../types/enum'

interface Props {
  token: string
}

const AddCategoryForm: FC<Props> = ({ token }) => {
  const { fieldState: categoryState, fieldDispatch: categoryDispatch } = useField()
  const { fieldState: logTypeState, fieldDispatch: logTypeDispatch } = useField(LogType.EXPENSE)
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
        id: 'logTypeExpense',
        name: 'logType',
        type: 'radio',
        label: 'Log type Expense',
        errMsg: 'Field is required.',
        validator: null,
        state: logTypeState,
        dispatch: logTypeDispatch,
        defaultValue: LogType.EXPENSE,
        attrs: { defaultChecked: true }
      },
      {
        id: 'logTypeIncome',
        name: 'logType',
        type: 'radio',
        label: 'Log type Income',
        errMsg: 'Field is required.',
        validator: null,
        state: logTypeState,
        dispatch: logTypeDispatch,
        defaultValue: LogType.INCOME
      }
    ],
    {
      submitBtnText: 'Create category',
      submitAction: addCategory,
      submitActionData: { token, name: categoryState.value, logType: logTypeState.value }
    }
  )

  return formMarkup
}

export default AddCategoryForm
