import React, { Fragment } from 'react'

import BaseForm from '../../ui/BaseForm/BaseForm'
import BaseInput from '../../ui/BaseInput/BaseInput'
import { useAppSelector, useAppDispatch } from '../../../hooks/useReduxTS'
import { budgetItemActions } from '../../../store/budget/budget-item-slice'
import { QueryFilter as Filter } from '../../../types/enum'

import classes from './FilterBudgetListForm.module.scss'

const FilterBudgetListForm = () => {
  const dispatch = useAppDispatch()
  const filterMonth = useAppSelector((state) => state.budgetItem.filters.month)!
  const filterYear = useAppSelector((state) => state.budgetItem.filters.year)!
  const filterType = useAppSelector((state) => state.budgetItem.filters.active)!
  const nameFilter = useAppSelector((state) => state.budgetItem.filters.name)!

  const setFilterHandler = (filter: Filter) => {
    dispatch(budgetItemActions.setActiveFilter(filter))
  }

  const findByNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(budgetItemActions.setFilterName(e.target.value))
  }
  return (
    <Fragment>
      <BaseForm isLoading={false}>
        <BaseInput
          id="name"
          name="name"
          type="text"
          label="Filter by name"
          isValid={true}
          value={nameFilter}
          onChange={findByNameHandler}
        />
      </BaseForm>
      {filterType === Filter.MONTH && (
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
      {filterType === Filter.YEAR && (
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
        <button type="button" className={filterType === Filter.ALL ? classes.active : ''} onClick={setFilterHandler.bind(null, Filter.ALL)}>
          Show all
        </button>
        <button
          type="button"
          className={filterType === Filter.YEAR ? classes.active : ''}
          onClick={setFilterHandler.bind(null, Filter.YEAR)}
        >
          Show by year
        </button>
        <button
          type="button"
          className={filterType === Filter.MONTH ? classes.active : ''}
          onClick={setFilterHandler.bind(null, Filter.MONTH)}
        >
          Show by month
        </button>
      </div>
    </Fragment>
  )
}

export default FilterBudgetListForm
