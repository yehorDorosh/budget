import { Fragment, useEffect } from 'react'

import { useAppSelector, useAppDispatch } from '../../../hooks/useReduxTS'
import BudgetItemsList from '../../budget/BudgetItemsList/BudgetItemsList'
// import AddBudgetItemForm from '../budget/AddBudgetItemForm/AddBudgetItemForm'
import { getCategories } from '../../../store/categories/categories-actions'
import FilterBudgetListForm from '../../budget/FilterBudgetListForm/FilterBudgetListForm'
import BudgetResult from '../../budget/BudgetResult/BudgetResult'
import MonthsTrend from '../../budget/MonthsTrend/MonthsTrend'

const BudgetPage = () => {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.user.token)!

  useEffect(() => {
    if (token) {
      dispatch(getCategories({ token }))
    }
  }, [dispatch, token])
  return (
    <Fragment>
      <h1>Budget</h1>
      {/* <AddBudgetItemForm token={token} /> */}
      <MonthsTrend token={token} />
      <BudgetResult />
      <FilterBudgetListForm />
      <BudgetItemsList token={token} />
    </Fragment>
  )
}

export default BudgetPage
