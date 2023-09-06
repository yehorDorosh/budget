import { Fragment } from 'react'

import { useAppSelector } from '../../hooks/useReduxTS'
import BudgetItemsList from '../budget/BudgetItemsList/BudgetItemsList'
import AddBudgetItemForm from '../budget/AddBudgetItemForm/AddBudgetItemForm/AddBudgetItemForm'

const BudgetPage = () => {
  const token = useAppSelector((state) => state.user.token)!

  return (
    <Fragment>
      <h1>Budget</h1>
      <AddBudgetItemForm token={token} />
      <BudgetItemsList token={token} />
    </Fragment>
  )
}

export default BudgetPage
