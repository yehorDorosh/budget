import React from 'react'

import BaseForm from '../../ui/BaseForm/BaseForm'
import BaseInput from '../../ui/BaseInput/BaseInput'
import SelectInput from '../../ui/SelectInput/SelectInput'
import { useAppSelector, useAppDispatch } from '../../../hooks/useReduxTS'
import { budgetItemActions } from '../../../store/budget/budget-item-slice'
import { CategoryType, QueryFilter as Filter } from '../../../types/enum'
import BaseCard from '../../ui/BaseCard/BaseCard'

// import classes from './FilterBudgetListForm.module.scss'

const FilterBudgetListForm = () => {
  const dispatch = useAppDispatch()
  const filterMonth = useAppSelector((state) => state.budgetItem.filters.month)!
  const filterYear = useAppSelector((state) => state.budgetItem.filters.year)!
  const filterType = useAppSelector((state) => state.budgetItem.filters.active)!
  const nameFilter = useAppSelector((state) => state.budgetItem.filters.name)!
  const categories = useAppSelector((state) => state.categories.categories)
  const categoryTypeFilter = useAppSelector((state) => state.budgetItem.filters.categoryType)!
  const categoryFilter = useAppSelector((state) => state.budgetItem.filters.category)!
  const ignoreFilter = useAppSelector((state) => state.budgetItem.filters.ignore)!

  const setFilterHandler = (filter: Filter) => {
    dispatch(budgetItemActions.setActiveFilter(filter))
  }

  const findByNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(budgetItemActions.setFilterName(e.target.value))
  }

  const categoryTypeFilterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(budgetItemActions.setFilterCategoryType(e.target.value))
  }

  const categoryFilterHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(budgetItemActions.setFilterCategory(e.target.value))
  }

  const ignoreFilterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(budgetItemActions.setFilterIgnore(e.target.checked))
  }

  return (
    <BaseCard>
      <BaseForm isLoading={false}>
        <BaseInput
          id="categoryTypeExpenseFilter"
          name="categoryTypeFilter"
          type="radio"
          label="Category Type Expense"
          isValid={true}
          value={CategoryType.EXPENSE}
          onChange={categoryTypeFilterHandler}
        />
        <BaseInput
          id="categoryTypeIncomeFilter"
          name="categoryTypeFilter"
          type="radio"
          label="Category Type Income"
          isValid={true}
          value={CategoryType.INCOME}
          onChange={categoryTypeFilterHandler}
        />
        <BaseInput
          id="categoryTypeAllFilter"
          name="categoryTypeFilter"
          type="radio"
          label="All Category Types"
          isValid={true}
          value={'all'}
          onChange={categoryTypeFilterHandler}
          defaultChecked={true}
        />
        <SelectInput
          id="categoryFilter"
          name="categoryFilter"
          type="select"
          label="Filter by Category"
          isValid={true}
          options={[
            { value: '', label: 'All' },
            ...categories
              .filter((category) => {
                if (!categoryTypeFilter) return true
                return category.categoryType === categoryTypeFilter
              })
              .map((category) => ({ value: category.id.toString(), label: category.name }))
          ]}
          value={categoryFilter}
          onChange={categoryFilterHandler}
        />
        <BaseInput
          id="nameFilter"
          name="nameFilter"
          type="text"
          label="Filter by name"
          isValid={true}
          value={nameFilter}
          onChange={findByNameHandler}
        />
        <BaseInput
          id="ignoreFilter"
          name="ignoreFilter"
          type="checkbox"
          label="Ignore"
          isValid={true}
          onChange={ignoreFilterHandler}
          checked={ignoreFilter}
        />
        {filterType === Filter.MONTH && (
          <BaseCard>
            <BaseInput
              id="month"
              name="month"
              type="month"
              label="Month"
              isValid={true}
              value={filterMonth}
              onChange={(e) => dispatch(budgetItemActions.setFilterMonth(e.target.value))}
            />
            <button type="button" className="btn btn-primary" onClick={() => dispatch(budgetItemActions.decreaseMonth())}>
              Previous Month
            </button>
            <button type="button" className="btn btn-primary" onClick={() => dispatch(budgetItemActions.increaseMonth())}>
              Next Month
            </button>
          </BaseCard>
        )}
        {filterType === Filter.YEAR && (
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
        )}
      </BaseForm>
      <BaseCard>
        <button
          type="button"
          className={`btn btn-primary ${filterType === Filter.ALL ? 'active' : ''}`}
          onClick={setFilterHandler.bind(null, Filter.ALL)}
        >
          Show all
        </button>
        <button
          type="button"
          className={`btn btn-primary ${filterType === Filter.YEAR ? 'active' : ''}`}
          onClick={setFilterHandler.bind(null, Filter.YEAR)}
        >
          Show by year
        </button>
        <button
          type="button"
          className={`btn btn-primary ${filterType === Filter.MONTH ? 'active' : ''}`}
          onClick={setFilterHandler.bind(null, Filter.MONTH)}
        >
          Show by month
        </button>
      </BaseCard>
    </BaseCard>
  )
}

export default FilterBudgetListForm
