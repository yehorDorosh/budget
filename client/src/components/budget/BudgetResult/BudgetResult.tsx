import { useAppSelector } from '../../../hooks/useReduxTS'
import { CategoryType } from '../../../types/enum'

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

  const expensesList = budgetItems
    .filter((budgetItem) => budgetItem.category.categoryType === CategoryType.EXPENSE)
    .sort((a, b) => b.value - a.value)
  return (
    <div>
      <div>
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
          </tbody>
        </table>
      </div>
      <div>
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
