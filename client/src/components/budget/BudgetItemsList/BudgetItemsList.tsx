/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useRef, useState } from 'react'

import { useAppSelector, useAppDispatch } from '../../../hooks/useReduxTS'
import { getBudgetItems } from '../../../store/budget/budget-item-actions'
import BudgetItem from './BudgetItem'
import BaseCard from '../../ui/BaseCard/BaseCard'
import { BudgetItem as BudgetItemInterface, budgetItemActions } from '../../../store/budget/budget-item-slice'
import { isActionPayload } from '../../../types/store-actions'

interface Props {
  token: string
}

const BudgetItemsList: FC<Props> = ({ token }) => {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.budgetItem.filters)
  const [list, setList] = useState<BudgetItemInterface[]>([])
  const observerTarget = useRef<HTMLDivElement>(null)

  const fetchBudgetItems = async (override = false) => {
    const res = await dispatch(getBudgetItems({ token }))
    if (isActionPayload(res) && res.data.payload && res.data.payload.budgetItems) {
      const newItems = res.data.payload.budgetItems
      if (override) setList(newItems)
      else setList((prev) => [...prev, ...newItems])
      if (newItems.length) dispatch(budgetItemActions.incrementPage())
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined
    if (token) {
      timer = setTimeout(async () => {
        dispatch(budgetItemActions.resetPage())
        fetchBudgetItems(true)
      }, 1000)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [filters.name])

  useEffect(() => {
    if (token) {
      dispatch(budgetItemActions.resetPage())
      fetchBudgetItems(true)
    }
  }, [filters.year, filters.active, filters.month, filters.categoryType, filters.category, filters.ignore])

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && token) {
          await fetchBudgetItems()
        }
      },
      { threshold: 1 }
    )
    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [observerTarget, token])
  return (
    <BaseCard data-testid="budget-item-list">
      {list.length !== 0 && list.map((budgetItem) => <BudgetItem key={budgetItem.id} token={token} budgetItem={budgetItem} />)}
      <div ref={observerTarget}></div>
    </BaseCard>
  )
}

export default BudgetItemsList
