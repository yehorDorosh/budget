import { useAppSelector } from '../../../hooks/useReduxTS'
import { CategoryType } from '../../../types/enum'

import classes from './BudgetResult.module.scss'

const BudgetResult = () => {
  const budgetItems = useAppSelector((state) => state.budgetItem.budgetItems)

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

  const total = sumIncomes - sumExpenses

  const expensesByCategory: { [key: string]: number } = {}
  budgetItems.forEach((budgetItem) => {
    if (budgetItem.category.categoryType === CategoryType.EXPENSE) {
      if (expensesByCategory[budgetItem.category.name]) {
        expensesByCategory[budgetItem.category.name] += budgetItem.value
      } else {
        expensesByCategory[budgetItem.category.name] = budgetItem.value
      }
    }
  })
  const expensesList = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])

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
              <td>{sumIncomes.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Expenses</td>
              <td>{sumExpenses.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Total</td>
              <td>{total.toFixed(2)}</td>
            </tr>
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
                <tr key={budgetItem[0]}>
                  <td>{budgetItem[0]}</td>
                  <td>{budgetItem[1].toFixed(2)}</td>
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
