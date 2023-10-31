import React, { FC, useEffect } from 'react'
import { useState } from 'react'
import BaseForm from '../../ui/BaseForm/BaseForm'
import BaseInput from '../../ui/BaseInput/BaseInput'
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxTS'
import { getMonthlyTrend } from '../../../store/budget/budget-item-actions'
import { Months } from '../../../types/enum'

import classes from './MonthsTrend.module.scss'
import BaseCard from '../../ui/BaseCard/BaseCard'
import { isActionPayload } from '../../../types/store-actions'

interface Props {
  token: string
}

const MonthsTrend: FC<Props> = ({ token }) => {
  const dispatch = useAppDispatch()
  const onChangeBudgetItems = useAppSelector((state) => state.budgetItem.onChangeBudgetItems)
  const [year, setYear] = useState(new Date().getFullYear())
  const [payload, setPayload] = useState<MonthlyTrendPayload>({
    aveExpenses: null,
    aveIncomes: null,
    aveSaved: null,
    totalSaved: null,
    monthlyExpenses: [],
    monthlyIncomes: [],
    maxTotal: null
  })

  const { aveExpenses, aveIncomes, aveSaved, totalSaved, maxTotal, monthlyExpenses, monthlyIncomes } = payload
  const max = maxTotal !== null ? +maxTotal : 0
  const averageYearExpenses = aveExpenses !== null ? +aveExpenses : 0
  const averageYearIncomes = aveIncomes !== null ? +aveIncomes : 0
  const expensesByMonth: number[] = Array.from({ length: 12 }, () => 0)
  const incomesByMonth: number[] = Array.from({ length: 12 }, () => 0)

  monthlyExpenses.forEach((_) => {
    expensesByMonth[+_.month] = +_.total
  })

  monthlyIncomes.forEach((_) => {
    incomesByMonth[+_.month] = +_.total
  })

  const totalExpenses = expensesByMonth.reduce((acc, curr) => acc + curr, 0).toFixed(2)
  const totalIncomes = incomesByMonth.reduce((acc, curr) => acc + curr, 0).toFixed(2)

  const yearHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYear(Number(e.target.value))
  }

  useEffect(() => {
    const fetchMonthlyTrend = async () => {
      if (token) {
        const res = await dispatch(getMonthlyTrend({ token, year }))

        if (isActionPayload(res) && res.data.payload) {
          setPayload(res.data.payload)
        }
      }
    }
    fetchMonthlyTrend()
  }, [year, token, dispatch, onChangeBudgetItems])

  return (
    <BaseCard className="mb-4" data-testid="months-trend">
      <ul>
        <li>Average Expenses: {averageYearExpenses}</li>
        <li>Average Income: {averageYearIncomes}</li>
        <li>Average Saved: {aveSaved}</li>
        <li>Total saved: {totalSaved}</li>
        <li>Total Expenses: {totalExpenses}</li>
        <li>Total Income: {totalIncomes}</li>
      </ul>
      <div className={classes.trendContainer}>
        {expensesByMonth.map((value, i) => (
          <div key={i} className={classes.column}>
            <p className={[classes.value, classes.expense].join(' ')} data-testid={`expense-${i}`}>
              {value.toFixed(2)}
            </p>
            <p className={[classes.value, classes.income].join(' ')} data-testid={`income-${i}`}>
              {incomesByMonth[i].toFixed(2)}
            </p>
            <p
              className={[classes.value, incomesByMonth[i] - value < 0 ? classes.expense : classes.income].join(' ')}
              data-testid={`total-${i}`}
            >
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
            <p className={classes.month}>{Months[i]}</p>
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
      <div className="btn-group">
        <button type="button" className="btn btn-primary" onClick={() => setYear((prev) => prev - 1)}>
          Previous Year
        </button>
        <button type="button" className="btn btn-primary" onClick={() => setYear((prev) => prev + 1)}>
          Next Year
        </button>
      </div>
    </BaseCard>
  )
}

export default MonthsTrend
