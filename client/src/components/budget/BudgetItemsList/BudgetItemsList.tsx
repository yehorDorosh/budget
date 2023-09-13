/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect } from 'react'

import { useAppSelector, useAppDispatch } from '../../../hooks/useReduxTS'
import { getBudgetItems } from '../../../store/budget/budget-item-actions'
import BudgetItem from './BudgetItem'
import BaseCard from '../../ui/BaseCard/BaseCard'

import classes from './BudgetItemsList.module.scss'

interface Props {
  token: string
}

const BudgetItemsList: FC<Props> = ({ token }) => {
  const dispatch = useAppDispatch()
  const budgetItems = useAppSelector((state) => state.budgetItem.budgetItems)
  const filters = useAppSelector((state) => state.budgetItem.filters)

  useEffect(() => {
    if (token) {
      dispatch(getBudgetItems({ token, filters }))
    }
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined
    if (token) {
      timer = setTimeout(() => {
        dispatch(getBudgetItems({ token, filters }))
      }, 1000)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [filters.name])

  useEffect(() => {
    if (token) {
      dispatch(getBudgetItems({ token, filters }))
    }
  }, [token, filters.year, filters.active, filters.month, filters.categoryType, filters.category, filters.ignore])
  return (
    <BaseCard>
      <table className={classes.table}>
        <thead>
          <tr>
            <th className="left">Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Category</th>
            <th>T</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgetItems.length !== 0 &&
            budgetItems.map((budgetItem) => <BudgetItem key={budgetItem.id} token={token} budgetItem={budgetItem} />)}
        </tbody>
      </table>
    </BaseCard>
  )
}

export default BudgetItemsList
