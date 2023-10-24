/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../../hooks/useReduxTS'
import BaseCard from '../../ui/BaseCard/BaseCard'
import { getStatistics } from '../../../store/budget/budget-item-actions'

import classes from './BudgetResult.module.scss'
import { isActionPayload } from '../../../types/store-actions'

const BudgetResult = () => {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.user.token)
  const filters = useAppSelector((state) => state.budgetItem.filters)
  const [statistics, setStatistics] = useState<StatisticsPayload>()
  const fetchStatistics = async (token: string) => {
    const res = await dispatch(getStatistics({ token }))

    if (isActionPayload(res) && res.data.payload && res.data.payload) {
      setStatistics(res.data.payload)
    }
  }

  useEffect(() => {
    if (token) {
      fetchStatistics(token)
    }
  }, [token, dispatch, filters.year, filters.active, filters.month])

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined
    if (token) {
      timer = setTimeout(async () => {
        fetchStatistics(token)
      }, 1000)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [filters.name])

  if (!statistics) return null

  return (
    <BaseCard className="mb-4" data-testid="budget-result">
      <div className={classes.resultContainer}>
        <div className={classes.column}>
          <h3 data-testid="summary">Summary</h3>
          <table className="table table-primary">
            <thead>
              <tr>
                <th>Category</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-light">
                <td>Income</td>
                <td data-testid="total-income">{statistics.incomes}</td>
              </tr>
              <tr className="table-light">
                <td>Expenses</td>
                <td data-testid="total-expense">{statistics.expenses}</td>
              </tr>
              <tr className="table-light">
                <td>Total</td>
                <td data-testid="total">{statistics.sum}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={[classes.column, classes.list].join(' ')}>
          <h3>Most Expenses</h3>
          <table className="table table-primary">
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {statistics.categoriesRates.map((category) => {
                return (
                  <tr key={category.name} className="table-light" data-testid="expense-list-item">
                    <td>{category.name}</td>
                    <td>{category.sum}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </BaseCard>
  )
}

export default BudgetResult
