import { useAppSelector } from '../../../hooks/useReduxTS'
import { CategoryType } from '../../../types/enum'
import BaseCard from '../../ui/BaseCard/BaseCard'

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

  const itemsByCategory: { [key: string]: number } = {}
  budgetItems.forEach((budgetItem) => {
    if (itemsByCategory[budgetItem.category.name]) {
      itemsByCategory[budgetItem.category.name] += budgetItem.value
    } else {
      itemsByCategory[budgetItem.category.name] = budgetItem.value
    }
  })
  const expensesList = Object.entries(itemsByCategory).sort((a, b) => b[1] - a[1])

  return (
    <BaseCard className="mb-4" data-testid="budget-result">
      <div className={classes.resultContainer}>
        <div className={classes.column}>
          <h3>Summary</h3>
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
                <td data-testid="total-income">{sumIncomes.toFixed(2)}</td>
              </tr>
              <tr className="table-light">
                <td>Expenses</td>
                <td data-testid="total-expense">{sumExpenses.toFixed(2)}</td>
              </tr>
              <tr className="table-light">
                <td>Total</td>
                <td data-testid="total">{total.toFixed(2)}</td>
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
              {expensesList.map((budgetItem) => {
                return (
                  <tr key={budgetItem[0]} className="table-light" data-testid="expense-list-item">
                    <td>{budgetItem[0]}</td>
                    <td>{budgetItem[1].toFixed(2)}</td>
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
