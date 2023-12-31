import { FC, Fragment, useState, useCallback } from 'react'

import useField from '../../../hooks/useFiled/useField'
import useForm from '../../../hooks/useForm/useForm'
import { notEmpty } from '../../../utils/validators'
import { addBudgetItem } from '../../../store/budget/budget-item-actions'
import { useAppSelector } from '../../../hooks/useReduxTS'
import { CategoryType } from '../../../types/enum'
import BaseCard from '../../ui/BaseCard/BaseCard'
import BaseModal from '../../ui/BaseModal/BaseModal'
import PriceCalculator from '../../PriceCalculator/PriceCalculator'

interface Props {
  token: string
}

const AddBudgetItemForm: FC<Props> = ({ token }) => {
  const [openCalc, setOpenCalc] = useState(false)
  const [calcResult, setCalcResult] = useState<number | undefined>()
  const currentDate = new Date().toISOString().split('T')[0]
  const { fieldState: nameState, fieldDispatch: nameDispatch } = useField()
  const { fieldState: valueState, fieldDispatch: valueDispatch } = useField()
  const { fieldState: dateState, fieldDispatch: dateDispatch } = useField(currentDate)
  const { fieldState: categoryState, fieldDispatch: categoryDispatch } = useField(undefined, false)
  const { fieldState: categoryTypeState, fieldDispatch: categoryTypeDispatch } = useField(CategoryType.EXPENSE)
  const categories = useAppSelector((state) => state.categories.categories)

  const calculatorHandler = useCallback(
    (result: number) => {
      setCalcResult(result)
      setOpenCalc(false)
      valueDispatch({ type: 'set&check', payload: { value: result.toString(), touched: true }, validation: notEmpty })
    },
    [valueDispatch]
  )

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
        dispatch: nameDispatch,
        dataList: true
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
        secondLabel: 'Calc',
        onClickLabel: () => setOpenCalc(true),
        defaultValue: calcResult?.toString(),
        attrs: { min: '0', step: '0.01', pattern: 'd+(.d{1,2})?' }
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
        defaultValue: currentDate
      }
    ],
    {
      submitBtnText: 'Create budget item',
      submitAction: addBudgetItem,
      submitActionData: {
        token,
        name: nameState.value,
        value: +valueState.value,
        userDate: new Date(dateState.value).toDateString(),
        categoryId: +categoryState.value
      }
    },
    { onGetResponse: () => setCalcResult(undefined) }
  )
  return (
    <Fragment>
      <BaseModal isOpen={openCalc} onClose={() => setOpenCalc(false)} title="Set value">
        <PriceCalculator onPressEqual={calculatorHandler} />
      </BaseModal>
      <BaseCard data-testid="add-budget-item-form">{formMarkup}</BaseCard>
    </Fragment>
  )
}

export default AddBudgetItemForm
