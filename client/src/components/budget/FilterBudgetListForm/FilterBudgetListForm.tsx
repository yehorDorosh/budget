import BaseForm from '../../ui/BaseForm/BaseForm'
import BaseInput from '../../ui/BaseInput/BaseInput'
import { useAppSelector, useAppDispatch } from '../../../hooks/useReduxTS'
import { budgetItemActions } from '../../../store/budget/budget-item-slice'

const FilterBudgetListForm = () => {
  const dispatch = useAppDispatch()
  const filterMonth = useAppSelector((state) => state.budgetItem.filters.month)
  return (
    <BaseForm isLoading={false}>
      <BaseInput
        id="month"
        name="month"
        type="month"
        label="Month"
        isValid={true}
        value={filterMonth}
        onChange={(e) => dispatch(budgetItemActions.setFilterMonth(e.target.value))}
      />
      <button type="button" onClick={() => dispatch(budgetItemActions.decreaseMonth())}>
        Previous Month
      </button>
      <button type="button" onClick={() => dispatch(budgetItemActions.increaseMonth())}>
        Next Month
      </button>
    </BaseForm>
  )
}

export default FilterBudgetListForm
