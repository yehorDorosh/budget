import { Fragment, useEffect } from 'react'

import { useAppSelector, useAppDispatch } from '../../hooks/useReduxTS'
import BudgetItemsList from '../budget/BudgetItemsList/BudgetItemsList'
import AddBudgetItemForm from '../budget/AddBudgetItemForm/AddBudgetItemForm/AddBudgetItemForm'
import { getCategories } from '../../store/categories/categories-actions'

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
      <AddBudgetItemForm token={token} />
      <BudgetItemsList token={token} />
    </Fragment>
  )
}

export default BudgetPage
