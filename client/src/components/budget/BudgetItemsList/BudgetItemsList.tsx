import { FC, useEffect } from 'react'

import { useAppSelector, useAppDispatch } from '../../../hooks/useReduxTS'
import { getBudgetItems } from '../../../store/budget/budget-item-actions'
import BudgetItem from './BudgetItem'

interface Props {
  token: string
}

const BudgetItemsList: FC<Props> = ({ token }) => {
  const dispatch = useAppDispatch()
  const budgetItems = useAppSelector((state) => state.budgetItem.budgetItems)

  useEffect(() => {
    if (token) {
      dispatch(getBudgetItems({ token }))
    }
  }, [token, dispatch])
  return (
    <table>
      <tbody>
        {budgetItems.length !== 0 &&
          budgetItems.map((budgetItem) => <BudgetItem key={budgetItem.id} token={token} budgetItem={budgetItem} />)}
      </tbody>
    </table>
  )
}

export default BudgetItemsList
