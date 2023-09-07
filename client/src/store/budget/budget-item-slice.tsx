import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { formatDateYearMonth, getCurrentYearMonth } from '../../utils/date'

export interface BudgetItem {
  id: number
  name: string
  value: number
  userDate: string
  category: {
    id: number
    name: string
    categoryType: string
  }
}

export interface BudgetItemsFilters {
  month?: string
}

export interface BudgetItemState {
  budgetItems: BudgetItem[]
  filters: BudgetItemsFilters
}

const initialState: BudgetItemState = {
  budgetItems: [],
  filters: {
    month: getCurrentYearMonth()
  }
}

const budgetItemSlice = createSlice({
  name: 'budget items',
  initialState,
  reducers: {
    setBudgetItems(state, action: PayloadAction<BudgetItem[]>) {
      const budgetItems = action.payload.map(
        (budgetItem): BudgetItem => ({
          ...budgetItem,
          value: +budgetItem.value,
          category: {
            ...budgetItem.category,
            id: +budgetItem.category.id
          }
        })
      )
      state.budgetItems = budgetItems
    },
    setFilterMonth(state, action: PayloadAction<string>) {
      state.filters.month = action.payload
    },
    increaseMonth(state) {
      if (!state.filters.month) return
      const date = new Date(state.filters.month)
      date.setMonth(date.getMonth() + 1)
      state.filters.month = formatDateYearMonth(date)
    },
    decreaseMonth(state) {
      if (!state.filters.month) return
      const date = new Date(state.filters.month)
      date.setMonth(date.getMonth() - 1)
      state.filters.month = formatDateYearMonth(date)
    }
  }
})

export const budgetItemActions = budgetItemSlice.actions

export default budgetItemSlice.reducer
