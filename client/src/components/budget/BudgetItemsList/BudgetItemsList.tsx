import { FC, useEffect } from 'react'

import { useAppSelector, useAppDispatch } from '../../../hooks/useReduxTS'
import { getBudgetItems } from '../../../store/budget/budget-item-actions'

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
    <ul>
      {budgetItems.length !== 0 &&
        budgetItems.map((budgetItem) => (
          <li key={budgetItem.id}>
            {budgetItem.name} {budgetItem.value} {budgetItem.userDate.toString()} {budgetItem.categoryId}
          </li>
        ))}
    </ul>
  )
}

export default BudgetItemsList
