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

  const listChangesHandler = async (budgetItem: BudgetItemInterface) => {
    if (budgetItem) {
      setList((prev) => {
        const index = prev.findIndex((i) => i.id === budgetItem.id)
        const newList = [...prev]
        newList[index] = budgetItem
        return newList
      })
      dispatch(budgetItemActions.onChangeBudgetItems())
    }
  }

  const deleteListItemHandler = async (id: number) => {
    /** Override page where element was deleted and shift all elements on next pages. Final clear last empty elements */
    const prevPage = filters.page || 1
    const index = list.findIndex((item) => item.id === id)
    const itemPage = Math.ceil((index + 1) / filters.perPage!)

    dispatch(budgetItemActions.setPage(itemPage))

    const res = await dispatch(getBudgetItems({ token }))

    if (isActionPayload(res) && res.data.payload && res.data.payload.budgetItems) {
      const chunk = res.data.payload.budgetItems
      const start = itemPage * filters.perPage! - filters.perPage!
      const prevList = [...list]

      for (let i = 0; i < prevList.length; i++) {
        if (i >= start && i < start + chunk.length) {
          prevList[i] = chunk[i - start]
        }

        if (i >= start + chunk.length) {
          prevList[i] = prevList[i + 1]
        }
      }

      setList(prevList.filter((_) => !!_))
    }

    dispatch(budgetItemActions.setPage(prevPage))
    dispatch(budgetItemActions.onChangeBudgetItems())
  }

  const updateList = () => {
    dispatch(budgetItemActions.resetPage())
    fetchBudgetItems(true)
    dispatch(budgetItemActions.onChangeBudgetItems())
  }

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined
    if (token) {
      timer = setTimeout(async () => {
        updateList()
      }, 1000)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [filters.name])

  useEffect(() => {
    if (token) {
      updateList()
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
      {list.length !== 0 &&
        list.map((budgetItem) => (
          <BudgetItem
            key={budgetItem.id}
            token={token}
            budgetItem={budgetItem}
            onChange={listChangesHandler}
            onDelete={deleteListItemHandler}
          />
        ))}
      <div ref={observerTarget}></div>
    </BaseCard>
  )
}

export default BudgetItemsList
