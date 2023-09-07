import React, { Fragment } from 'react'

import BaseForm from '../../ui/BaseForm/BaseForm'
import BaseInput from '../../ui/BaseInput/BaseInput'
import { useAppSelector, useAppDispatch } from '../../../hooks/useReduxTS'
import { budgetItemActions } from '../../../store/budget/budget-item-slice'
import { QueryFilter as Filter } from '../../../types/enum'

const FilterBudgetListForm = () => {
  const dispatch = useAppDispatch()
  const filterMonth = useAppSelector((state) => state.budgetItem.filters.month)!
  const filterYear = useAppSelector((state) => state.budgetItem.filters.year)!
  const filter = useAppSelector((state) => state.budgetItem.filters.active)!

  const setFilterHandler = (filter: Filter) => {
    dispatch(budgetItemActions.setActiveFilter(filter))
  }
  return (
    <Fragment>
      {filter === Filter.MONTH && (
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
      )}
      {filter === Filter.YEAR && (
        <BaseForm isLoading={false}>
          <BaseInput
            id="year"
            name="year"
            type="number"
            label="Year"
            isValid={true}
            value={filterYear}
            onChange={(e) => dispatch(budgetItemActions.setFilterYear(e.target.value))}
            min={2015}
            max={2100}
            step={1}
          />
        </BaseForm>
      )}
      <div>
        <button type="button" onClick={setFilterHandler.bind(null, Filter.ALL)}>
          Show all
        </button>
        <button type="button" onClick={setFilterHandler.bind(null, Filter.YEAR)}>
          Show by year
        </button>
        <button type="button" onClick={setFilterHandler.bind(null, Filter.MONTH)}>
          Show by month
        </button>
      </div>
    </Fragment>
  )
}

export default FilterBudgetListForm
