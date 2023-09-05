import { FC } from 'react'

import useField from '../../../hooks/useField'
import useForm from '../../../hooks/useForm'
import { notEmpty } from '../../../utils/validators'
import { updateCategory } from '../../../store/categories/categories-actions'
import { LogType } from '../../../types/enum'

interface Props {
  id: number
  token: string
  defaultName: string
  defaultLogType: string
  onSave: () => void
}

const UpdateCategoryForm: FC<Props> = ({ token, id, defaultName, defaultLogType, onSave }) => {
  const { fieldState: categoryState, fieldDispatch: categoryDispatch } = useField(defaultName)
  const { fieldState: logTypeState, fieldDispatch: logTypeDispatch } = useField(defaultLogType)
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
        id: 'logTypeExpense',
        name: 'logType',
        type: 'radio',
        label: 'Log type Expense',
        errMsg: 'Field is required.',
        validator: null,
        state: logTypeState,
        dispatch: logTypeDispatch,
        defaultValue: LogType.EXPENSE,
        attrs: { defaultChecked: defaultLogType === LogType.EXPENSE }
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
        defaultValue: LogType.INCOME,
        attrs: { defaultChecked: defaultLogType === LogType.INCOME }
      }
    ],
    {
      submitBtnText: 'Save',
      submitAction: updateCategory,
      submitActionParams: [token, id, categoryState.value, logTypeState.value]
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
