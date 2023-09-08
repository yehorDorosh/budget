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
  const budgetItemsTrend = useAppSelector((state) => state.budgetItem.trendBudgetItems)
  const budgetItemsList = useAppSelector((state) => state.budgetItem.budgetItems)

  const budgetItemsByMonth: number[] = Array.from({ length: 12 }, () => 0)

  budgetItemsTrend.forEach((item) => {
    if (item.category.categoryType === CategoryType.INCOME) return

    const month = new Date(item.userDate).getMonth()
    if (!budgetItemsByMonth[month]) {
      budgetItemsByMonth[month] = item.value
    } else {
      budgetItemsByMonth[month] += item.value
    }
  })

  const max = Math.max(...budgetItemsByMonth)

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
      <div className={classes.container}>
        {budgetItemsByMonth.map((value, i) => (
          <div key={i} className={classes.column}>
            <p className={classes.value}>{value.toFixed(2)}</p>
            <div className={classes.columnTrend}>
              <div className={classes.fill} style={{ top: `${max ? 100 - (value * 100) / max : 100}%` }}></div>
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
