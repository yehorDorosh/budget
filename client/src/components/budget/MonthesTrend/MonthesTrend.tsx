import React, { FC, useEffect } from 'react'
import { useState } from 'react'
import BaseForm from '../../ui/BaseForm/BaseForm'
import BaseInput from '../../ui/BaseInput/BaseInput'
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxTS'
import { getBudgetItems } from '../../../store/budget/budget-item-actions'
import { CategoryType, Monthes, QueryFilter, ReducerType } from '../../../types/enum'

import classes from './MonthesTrend.module.scss'

interface Props {
  token: string
}

const MonthesTrend: FC<Props> = ({ token }) => {
  const dispatch = useAppDispatch()
  const [year, setYear] = useState(new Date().getFullYear())
  const budgetItemsTrend = useAppSelector((state) => state.budgetItem.trendBudgetItems).filter((item) => !item.ignore)
  const budgetItemsList = useAppSelector((state) => state.budgetItem.budgetItems)

  const expensesByMonth: number[] = Array.from({ length: 12 }, () => 0)
  const incomesByMonth: number[] = Array.from({ length: 12 }, () => 0)

  budgetItemsTrend.forEach((item) => {
    const month = new Date(item.userDate).getMonth()

    if (item.category.categoryType === CategoryType.INCOME) {
      incomesByMonth[month] += item.value
    }

    if (item.category.categoryType === CategoryType.EXPENSE) {
      expensesByMonth[month] += item.value
    }
  })

  const max = Math.max(...expensesByMonth, ...incomesByMonth)
  const isCurrentYear = new Date().getFullYear() === +year
  const monthesAmount = isCurrentYear ? new Date().getMonth() + 1 : 12

  const sumExpenses = budgetItemsTrend.reduce((acc, budgetItem) => {
    if (budgetItem.category.categoryType === CategoryType.EXPENSE) {
      return acc + budgetItem.value
    }
    return acc
  }, 0)

  const sumIncomes = budgetItemsTrend.reduce((acc, budgetItem) => {
    if (budgetItem.category.categoryType === CategoryType.INCOME) {
      return acc + budgetItem.value
    }
    return acc
  }, 0)

  const averageYearExpenses = sumExpenses / monthesAmount
  const averageYearIncomes = sumIncomes / monthesAmount

  const yearHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYear(Number(e.target.value))
  }

  useEffect(() => {
    if (token) {
      dispatch(getBudgetItems({ token, filters: { year: String(year), active: QueryFilter.YEAR } }, ReducerType.BudgetItemsTrend))
    }
  }, [year, token, dispatch, budgetItemsList])

  return (
    <div>
      <ul>
        <li>Average Expenses: {averageYearExpenses.toFixed(2)}</li>
        <li>Average Income: {averageYearIncomes.toFixed(2)}</li>
        <li>Average Saved: {(averageYearIncomes - averageYearExpenses).toFixed(2)}</li>
        <li>Total saved: {(sumIncomes - sumExpenses).toFixed(2)}</li>
      </ul>
      <div className={classes.container}>
        {expensesByMonth.map((value, i) => (
          <div key={i} className={classes.column}>
            <p className={[classes.value, classes.expense].join(' ')}>{value.toFixed(2)}</p>
            <p className={[classes.value, classes.income].join(' ')}>{incomesByMonth[i].toFixed(2)}</p>
            <p className={[classes.value, incomesByMonth[i] - value < 0 ? classes.expense : classes.income].join(' ')}>
              {(incomesByMonth[i] - value).toFixed(2)}
            </p>
            <div className={classes.columnTrend}>
              <div
                className={[classes.fill, classes.expenseTrend].join(' ')}
                style={{ top: `${max ? 100 - (value * 100) / max : 100}%` }}
              ></div>
              <div
                className={[classes.fill, classes.averageExpenses].join(' ')}
                style={{ top: `${max ? 100 - (averageYearExpenses * 100) / max : 100}%` }}
              ></div>
              <div
                className={[classes.fill, classes.incomesTrend].join(' ')}
                style={{ top: `${max ? 100 - (incomesByMonth[i] * 100) / max : 100}%` }}
              ></div>
              <div
                className={[classes.fill, classes.averageIncomes].join(' ')}
                style={{ top: `${max ? 100 - (averageYearIncomes * 100) / max : 100}%` }}
              ></div>
            </div>
            <p className={classes.month}>{Monthes[i]}</p>
          </div>
        ))}
      </div>
      <BaseForm isLoading={false}>
        <BaseInput
          id="year-trend"
          name="year"
          type="number"
          label="Year"
          isValid={true}
          value={year}
          onChange={yearHandler}
          min={2015}
          max={2100}
          step={1}
        />
      </BaseForm>
    </div>
  )
}

export default MonthesTrend
