import { Fragment } from 'react'
import { useAppSelector } from '../../../hooks/useReduxTS'
import { CategoryType, QueryFilter } from '../../../types/enum'

import classes from './BudgetResult.module.scss'

const BudgetResult = () => {
  const budgetItems = useAppSelector((state) => state.budgetItem.budgetItems)
  const filterType = useAppSelector((state) => state.budgetItem.filters.active)

  const sumExpenses = budgetItems.reduce((acc, budgetItem) => {
    if (budgetItem.category.categoryType === CategoryType.EXPENSE) {
      return acc + budgetItem.value
    }
    return acc
  }, 0)

  const sumIncomes = budgetItems.reduce((acc, budgetItem) => {
    if (budgetItem.category.categoryType === CategoryType.INCOME) {
      return acc + budgetItem.value
    }
    return acc
  }, 0)

  const averageYearExpenses = (sumExpenses / 12).toFixed(2)
  const averageYearIncomes = (sumIncomes / 12).toFixed(2)
  const total = sumIncomes - sumExpenses

  const expensesList = budgetItems
    .filter((budgetItem) => budgetItem.category.categoryType === CategoryType.EXPENSE)
    .sort((a, b) => b.value - a.value)
  return (
    <div className={classes.container}>
      <div className={classes.column}>
        <h3>Summary</h3>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Income</td>
              <td>{sumIncomes}</td>
            </tr>
            <tr>
              <td>Expenses</td>
              <td>{sumExpenses}</td>
            </tr>
            <tr>
              <td>Total</td>
              <td>{total}</td>
            </tr>
            {filterType === QueryFilter.YEAR && (
              <Fragment>
                <tr>
                  <td>Average Expenses</td>
                  <td>{averageYearExpenses}</td>
                </tr>
                <tr>
                  <td>Average Income</td>
                  <td>{averageYearIncomes}</td>
                </tr>
              </Fragment>
            )}
          </tbody>
        </table>
      </div>
      <div className={[classes.column, classes.list].join(' ')}>
        <h3>Most Expenses</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {expensesList.map((budgetItem) => {
              return (
                <tr key={budgetItem.id}>
                  <td>{budgetItem.name}</td>
                  <td>{budgetItem.value}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BudgetResult
